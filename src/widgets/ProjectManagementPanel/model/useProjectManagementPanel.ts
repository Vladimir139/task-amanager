import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetProjectByIdQuery,
  useGetProjectInvitationsQuery,
  useGetProjectMembersQuery,
  useSelectedProjectId,
} from "@/entities/project";
import { selectAuthUser, useGetUsersQuery } from "@/entities/user";
import { useDeleteProjectMutation } from "@/features/deleteProject";
import { useInviteProjectMemberMutation } from "@/features/projectInvitations";
import {
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

interface PendingInvitationItem {
  createdAt: string;
  email: string;
  id: string;
  invitedUserName: string | null;
  role: EditableProjectRole;
}

interface UseProjectManagementPanelResult {
  canManageProject: boolean;
  handleDeleteProject: () => Promise<void>;
  handleFieldChange: (
    field: keyof ProjectFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInvitationEmailChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInvitationRoleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMemberRoleChange: (memberUserId: string, role: EditableProjectRole) => Promise<void>;
  handleOpenBoard: () => void;
  handleRemoveMember: (memberUserId: string) => Promise<void>;
  handleSaveProject: () => Promise<void>;
  handleSendInvitation: () => Promise<void>;
  isDeletingProject: boolean;
  isProjectDirty: boolean;
  isLoading: boolean;
  isMutating: boolean;
  invitationEmail: string;
  invitationRole: EditableProjectRole;
  memberItems: ProjectMemberItem[];
  pendingInvitationItems: PendingInvitationItem[];
  projectForm: ProjectFormState;
  selectedProjectId: string | null;
  selectedProjectTitle: string;
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
  const [invitationEmail, setInvitationEmail] = useState("");
  const [invitationRole, setInvitationRole] = useState<EditableProjectRole>("member");
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
  const currentUserRole = useMemo(() => {
    if (!authUser?.id) {
      return null;
    }

    return projectMembers?.find((member) => member.userId === authUser.id)?.role ?? null;
  }, [authUser?.id, projectMembers]);
  const canManageProject = currentUserRole === "owner" || currentUserRole === "admin";
  const {
    data: pendingInvitations = [],
    isError: isInvitationsError,
    isLoading: isInvitationsLoading,
  } = useGetProjectInvitationsQuery(selectedProjectId ?? "", {
    skip: !selectedProjectId || !canManageProject,
  });
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
  const [inviteProjectMember, { isLoading: isInvitingMember }] = useInviteProjectMemberMutation();
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
    setInvitationEmail("");
    setInvitationRole("member");
    setStatusMessage(null);
    setStatusTone(null);
  }, [selectedProject]);
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

  const pendingInvitationItems = useMemo<PendingInvitationItem[]>(
    () =>
      pendingInvitations.map((invitation) => ({
        createdAt: formatDateInput(invitation.createdAt) || "Today",
        email: invitation.email,
        id: invitation._id,
        invitedUserName: invitation.invitedUserName ?? null,
        role: invitation.role === "owner" ? "member" : invitation.role,
      })),
    [pendingInvitations],
  );

  const handleFieldChange =
    (field: keyof ProjectFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setProjectForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleInvitationEmailChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setInvitationEmail(event.target.value);
  };

  const handleInvitationRoleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInvitationRole(event.target.value as EditableProjectRole);
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

  const handleSendInvitation = async (): Promise<void> => {
    if (!selectedProjectId || !invitationEmail.trim()) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await inviteProjectMember({
        email: invitationEmail.trim(),
        projectId: selectedProjectId,
        role: invitationRole,
      }).unwrap();
      setInvitationEmail("");
      setInvitationRole("member");
      setStatusMessage("Invitation sent.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to send the invitation."));
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
    canManageProject,
    handleDeleteProject,
    handleFieldChange,
    handleInvitationEmailChange,
    handleInvitationRoleChange,
    handleMemberRoleChange,
    handleOpenBoard,
    handleRemoveMember,
    handleSaveProject,
    handleSendInvitation,
    isDeletingProject,
    isProjectDirty,
    isLoading: isProjectLoading || isMembersLoading || (canManageProject && isInvitationsLoading),
    isMutating:
      isUpdatingProject ||
      isInvitingMember ||
      isUpdatingMemberRole ||
      isRemovingMember ||
      isDeletingProject,
    invitationEmail,
    invitationRole,
    memberItems,
    pendingInvitationItems,
    projectForm,
    selectedProjectId,
    selectedProjectTitle: selectedProject?.title ?? "Project",
    statusMessage: !selectedProjectId
      ? "Select a project from the list to manage its details and members."
      : isProjectError || isMembersError || (canManageProject && isInvitationsError)
        ? "Unable to load the selected project."
        : statusMessage,
    statusTone:
      !selectedProjectId ||
      isProjectError ||
      isMembersError ||
      (canManageProject && isInvitationsError)
        ? !selectedProjectId
          ? null
          : "error"
        : statusTone,
  };
};
