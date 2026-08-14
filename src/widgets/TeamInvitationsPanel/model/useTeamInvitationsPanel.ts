import { useMemo, useState } from "react";

import { useGetReceivedProjectInvitationsQuery } from "@/entities/project";
import {
  useAcceptProjectInvitationMutation,
  useDeclineProjectInvitationMutation,
} from "@/features/projectInvitations";
import { getApiErrorMessage } from "@/shared/lib/api";

interface TeamInvitationItem {
  createdAt: string;
  email: string;
  id: string;
  invitedByName: string;
  projectTitle: string;
  roleLabel: string;
}

interface UseTeamInvitationsPanelResult {
  handleAcceptInvitation: (invitationId: string) => Promise<void>;
  handleDeclineInvitation: (invitationId: string) => Promise<void>;
  invitationItems: TeamInvitationItem[];
  isLoading: boolean;
  isMutating: boolean;
  isLoadError: boolean;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
}

const roleLabels: Record<"admin" | "member" | "viewer" | "owner", string> = {
  admin: "Admin access",
  member: "Member access",
  owner: "Owner access",
  viewer: "Viewer access",
};

const formatDateLabel = (value?: string): string => {
  if (!value) {
    return "today";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
};

export const useTeamInvitationsPanel = (): UseTeamInvitationsPanelResult => {
  const {
    data: invitations = [],
    isError: isLoadError,
    isLoading,
  } = useGetReceivedProjectInvitationsQuery();
  const [acceptProjectInvitation, { isLoading: isAccepting }] =
    useAcceptProjectInvitationMutation();
  const [declineProjectInvitation, { isLoading: isDeclining }] =
    useDeclineProjectInvitationMutation();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);

  const invitationItems = useMemo<TeamInvitationItem[]>(
    () =>
      invitations.map((invitation) => ({
        createdAt: formatDateLabel(invitation.createdAt),
        email: invitation.email,
        id: invitation._id,
        invitedByName: invitation.invitedByName ?? "Your teammate",
        projectTitle: invitation.projectTitle ?? "Project",
        roleLabel: roleLabels[invitation.role] ?? "Project access",
      })),
    [invitations],
  );

  const handleAcceptInvitation = async (invitationId: string): Promise<void> => {
    setStatusMessage(null);
    setStatusTone(null);

    try {
      await acceptProjectInvitation({ invitationId }).unwrap();
      setStatusMessage("Invitation accepted. The project is now available in your workspace.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to accept the invitation."));
      setStatusTone("error");
    }
  };

  const handleDeclineInvitation = async (invitationId: string): Promise<void> => {
    setStatusMessage(null);
    setStatusTone(null);

    try {
      await declineProjectInvitation({ invitationId }).unwrap();
      setStatusMessage("Invitation declined.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to decline the invitation."));
      setStatusTone("error");
    }
  };

  return {
    handleAcceptInvitation,
    handleDeclineInvitation,
    invitationItems,
    isLoading,
    isLoadError,
    isMutating: isAccepting || isDeclining,
    statusMessage,
    statusTone,
  };
};
