import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetProjectByIdQuery,
  useGetProjectMembersQuery,
  useSelectedProjectId,
} from "@/entities/project";
import { selectAuthUser, useGetUsersQuery } from "@/entities/user";
import { useDeleteProjectMutation } from "@/features/deleteProject";
import {
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useUpdateProjectMemberRoleMutation,
} from "@/features/projectMembers";
import { useUpdateProjectMutation } from "@/features/updateProject";
import { getProjectsRoute, getTasksRoute } from "@/shared/config/router";
import { getApiErrorMessage } from "@/shared/lib/api";
import { getInitials } from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

type EditableProjectRole = "admin" | "member" | "viewer";

interface ProjectFormState {
  color: "purple" | "blue" | "orange" | "green" | "red" | "gray";
  description: string;
  dueDate: string;
  startDate: string;
  status: "active" | "completed" | "on-hold" | "archived";
  title: string;
}

interface ProjectMemberItem {
  email: string;
  id: string;
  initials: string;
  isCurrentUser: boolean;
  isOwner: boolean;
  joinedAt: string;
  name: string;
  role: "owner" | "admin" | "member" | "viewer";
}

interface UseProjectManagementPanelResult {
  addMemberRole: EditableProjectRole;
  availableUsers: Array<{ id: string; label: string }>;
  canManageProject: boolean;
  handleAddMember: () => Promise<void>;
  handleDeleteProject: () => Promise<void>;
  handleAddMemberRoleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFieldChange: (
    field: keyof ProjectFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMemberRoleChange: (memberUserId: string, role: EditableProjectRole) => Promise<void>;
  handleOpenBoard: () => void;
  handleRemoveMember: (memberUserId: string) => Promise<void>;
  handleSaveProject: () => Promise<void>;
  handleSelectedUserChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDeletingProject: boolean;
  isProjectDirty: boolean;
  isLoading: boolean;
  isMutating: boolean;
  memberItems: ProjectMemberItem[];
  projectForm: ProjectFormState;
  selectedProjectId: string | null;
  selectedProjectTitle: string;
  selectedUserId: string;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
}

const initialProjectForm: ProjectFormState = {
  color: "blue",
  description: "",
  dueDate: "",
  startDate: "",
  status: "active",
  title: "",
};

const formatDateInput = (value?: string | null): string => value?.split("T")[0] ?? "";

const toIsoDate = (value: string): string | undefined =>
  value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;

export const useProjectManagementPanel = (): UseProjectManagementPanelResult => {
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const selectedProjectId = useSelectedProjectId();
  const [projectForm, setProjectForm] = useState<ProjectFormState>(initialProjectForm);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addMemberRole, setAddMemberRole] = useState<EditableProjectRole>("member");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);

  const {
    data: selectedProject,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useGetProjectByIdQuery(selectedProjectId ?? "", {
    skip: !selectedProjectId,
  });
  const {
    data: projectMembers,
    isError: isMembersError,
    isLoading: isMembersLoading,
  } = useGetProjectMembersQuery(selectedProjectId ?? "", {
    skip: !selectedProjectId,
  });
  const { data: users = [] } = useGetUsersQuery();
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
  const [addProjectMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();
  const [updateProjectMemberRole, { isLoading: isUpdatingMemberRole }] =
    useUpdateProjectMemberRoleMutation();
  const [removeProjectMember, { isLoading: isRemovingMember }] = useRemoveProjectMemberMutation();

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    setProjectForm({
      color:
        selectedProject.color === "gray"
          ? "gray"
          : (selectedProject.color as ProjectFormState["color"]),
      description: selectedProject.description ?? "",
      dueDate: formatDateInput(selectedProject.dueDate),
      startDate: formatDateInput(selectedProject.startDate),
      status:
        selectedProject.status === "archived"
          ? "archived"
          : (selectedProject.status as ProjectFormState["status"]),
      title: selectedProject.title,
    });
    setStatusMessage(null);
    setStatusTone(null);
  }, [selectedProject]);

  const currentUserRole = useMemo(() => {
    if (!authUser?.id) {
      return null;
    }

    return projectMembers?.find((member) => member.userId === authUser.id)?.role ?? null;
  }, [authUser?.id, projectMembers]);

  const canManageProject = currentUserRole === "owner" || currentUserRole === "admin";
  const isProjectDirty = useMemo(() => {
    if (!selectedProject) {
      return false;
    }

    return (
      projectForm.title.trim() !== selectedProject.title ||
      projectForm.description !== (selectedProject.description ?? "") ||
      projectForm.color !== selectedProject.color ||
      projectForm.status !== selectedProject.status ||
      projectForm.startDate !== formatDateInput(selectedProject.startDate) ||
      projectForm.dueDate !== formatDateInput(selectedProject.dueDate)
    );
  }, [projectForm, selectedProject]);

  const memberItems = useMemo<ProjectMemberItem[]>(() => {
    const userMap = new Map(users.map((user) => [user._id, user]));

    return (projectMembers ?? []).map((member) => {
      const user = userMap.get(member.userId);
      const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "Unknown user";

      return {
        email: user?.email ?? "No email",
        id: member.userId,
        initials: user ? getInitials(user.firstName, user.lastName) : "NA",
        isCurrentUser: member.userId === authUser?.id,
        isOwner: member.role === "owner",
        joinedAt: formatDateInput(member.joinedAt) || "Unknown",
        name: fullName,
        role: member.role,
      };
    });
  }, [authUser?.id, projectMembers, users]);

  const availableUsers = useMemo(() => {
    const existingIds = new Set((projectMembers ?? []).map((member) => member.userId));

    return users
      .filter((user) => !existingIds.has(user._id))
      .map((user) => ({
        id: user._id,
        label: `${user.firstName} ${user.lastName}`.trim() || user.email,
      }));
  }, [projectMembers, users]);

  const handleFieldChange =
    (field: keyof ProjectFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setProjectForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSelectedUserChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedUserId(event.target.value);
  };

  const handleAddMemberRoleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAddMemberRole(event.target.value as EditableProjectRole);
  };

  const handleOpenBoard = (): void => {
    if (!selectedProjectId) {
      return;
    }

    void navigate(getTasksRoute(selectedProjectId));
  };

  const handleSaveProject = async (): Promise<void> => {
    if (!selectedProjectId || !isProjectDirty) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateProject({
        color: projectForm.color,
        description: projectForm.description,
        dueDate: toIsoDate(projectForm.dueDate),
        projectId: selectedProjectId,
        startDate: toIsoDate(projectForm.startDate),
        status: projectForm.status,
        title: projectForm.title.trim(),
      }).unwrap();

      setStatusMessage("Project details updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the project."));
      setStatusTone("error");
    }
  };

  const handleDeleteProject = async (): Promise<void> => {
    if (!selectedProjectId) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteProject(selectedProjectId).unwrap();
      await navigate(getProjectsRoute());
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to delete the project."));
      setStatusTone("error");
    }
  };

  const handleAddMember = async (): Promise<void> => {
    if (!selectedProjectId || !selectedUserId) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await addProjectMember({
        projectId: selectedProjectId,
        role: addMemberRole,
        userId: selectedUserId,
      }).unwrap();
      setSelectedUserId("");
      setAddMemberRole("member");
      setStatusMessage("Project member added.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to add the project member."));
      setStatusTone("error");
    }
  };

  const handleMemberRoleChange = async (
    memberUserId: string,
    role: EditableProjectRole,
  ): Promise<void> => {
    if (!selectedProjectId) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateProjectMemberRole({
        memberUserId,
        projectId: selectedProjectId,
        role,
      }).unwrap();
      setStatusMessage("Project member role updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the member role."));
      setStatusTone("error");
    }
  };

  const handleRemoveMember = async (memberUserId: string): Promise<void> => {
    if (!selectedProjectId) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await removeProjectMember({
        memberUserId,
        projectId: selectedProjectId,
      }).unwrap();
      setStatusMessage("Project member removed.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to remove the member."));
      setStatusTone("error");
    }
  };

  return {
    addMemberRole,
    availableUsers,
    canManageProject,
    handleAddMember,
    handleAddMemberRoleChange,
    handleDeleteProject,
    handleFieldChange,
    handleMemberRoleChange,
    handleOpenBoard,
    handleRemoveMember,
    handleSaveProject,
    handleSelectedUserChange,
    isDeletingProject,
    isProjectDirty,
    isLoading: isProjectLoading || isMembersLoading,
    isMutating:
      isUpdatingProject ||
      isAddingMember ||
      isUpdatingMemberRole ||
      isRemovingMember ||
      isDeletingProject,
    memberItems,
    projectForm,
    selectedProjectId,
    selectedProjectTitle: selectedProject?.title ?? "Project",
    selectedUserId,
    statusMessage: !selectedProjectId
      ? "Select a project from the list to manage its details and members."
      : isProjectError || isMembersError
        ? "Unable to load the selected project."
        : statusMessage,
    statusTone: !selectedProjectId ? null : isProjectError || isMembersError ? "error" : statusTone,
  };
};
