import { Box, Button, Chip, Typography } from "@mui/material";
import type { FC } from "react";

import { useStatusToast } from "@/shared/lib/toast/useStatusToast";

import { useTeamInvitationsPanel } from "../model/useTeamInvitationsPanel";
import styles from "./TeamInvitationsPanel.module.scss";

export const TeamInvitationsPanel: FC = () => {
  const {
    handleAcceptInvitation,
    handleDeclineInvitation,
    invitationItems,
    isLoadError,
    isLoading,
    isMutating,
    statusMessage,
    statusTone,
  } = useTeamInvitationsPanel();

  useStatusToast({ message: statusMessage, tone: statusTone });

  return (
    <section className={styles.panel}>
      <Box className={styles.header}>
        <Box>
          <Typography className={styles.title}>Team invitations</Typography>
          <Typography className={styles.subtitle}>
            Accept or decline pending project invites sent to your email.
          </Typography>
        </Box>

        <Chip label={`${invitationItems.length} pending`} color="info" variant="outlined" />
      </Box>

      {isLoading ? (
        <Typography className={styles.emptyState}>Loading invitations...</Typography>
      ) : isLoadError ? (
        <Typography className={styles.emptyState}>Unable to load team invitations.</Typography>
      ) : invitationItems.length === 0 ? (
        <Typography className={styles.emptyState}>
          You have no pending invitations right now.
        </Typography>
      ) : (
        <Box className={styles.list}>
          {invitationItems.map((invitation) => (
            <Box key={invitation.id} className={styles.invitationCard}>
              <Box className={styles.cardHeader}>
                <Box>
                  <Typography className={styles.projectTitle}>{invitation.projectTitle}</Typography>
                  <Typography className={styles.metaText}>
                    Invited by {invitation.invitedByName} on {invitation.createdAt}
                  </Typography>
                  <Typography className={styles.metaText}>{invitation.email}</Typography>
                </Box>

                <Chip label={invitation.roleLabel} size="small" />
              </Box>

              <Box className={styles.actions}>
                <Button
                  variant="outlined"
                  disabled={isMutating}
                  onClick={() => {
                    void handleDeclineInvitation(invitation.id);
                  }}
                >
                  Decline
                </Button>

                <Button
                  variant="contained"
                  disabled={isMutating}
                  onClick={() => {
                    void handleAcceptInvitation(invitation.id);
                  }}
                >
                  Accept
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </section>
  );
};
