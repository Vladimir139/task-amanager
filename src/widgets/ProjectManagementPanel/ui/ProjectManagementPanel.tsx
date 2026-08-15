import { Alert, Avatar, Box, Button, Chip, MenuItem, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useNavigate } from "react-router-dom";

import {
  projectColorOptions,
  projectMemberRoleOptions,
  projectStatusOptions,
} from "@/entities/project";
import { getProjectsRoute } from "@/shared/config/router";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";
import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";

import { useProjectManagementPanel } from "../model/useProjectManagementPanel";
import styles from "./ProjectManagementPanel.module.scss";

export const ProjectManagementPanel: FC = () => {
  const navigate = useNavigate();
  const {
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
    isLoading,
    isProjectDirty,
    isMutating,
    invitationEmail,
    invitationRole,
    memberItems,
    pendingInvitationItems,
    projectForm,
    selectedProjectId,
    selectedProjectTitle,
    statusMessage,
    statusTone,
  } = useProjectManagementPanel();

  useStatusToast({ message: statusMessage, tone: statusTone });

  if (!selectedProjectId) {
    return null;
  }

  return (
    <AppModal
      open={Boolean(selectedProjectId)}
      onClose={() => {
        void navigate(getProjectsRoute(), { replace: true });
      }}
      title="Project control center"
    >
      <Box className={styles.panel}>
        <Box className={styles.panelHeader}>
          <Box>
            <Typography className={styles.subtitle}>
              Manage {selectedProjectTitle}, its board access, and its team members.
            </Typography>
          </Box>

          <Box className={styles.headerActions}>
            <Button variant="outlined" onClick={handleOpenBoard}>
              Open board
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                void handleSaveProject();
              }}
              disabled={
                !canManageProject || isMutating || !projectForm.title.trim() || !isProjectDirty
              }
            >
              Save project
            </Button>

            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                void handleDeleteProject();
              }}
              disabled={!canManageProject || isDeletingProject}
            >
              {isDeletingProject ? "Deleting..." : "Delete project"}
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <Typography>Loading project settings...</Typography>
        ) : (
          <>
            {!canManageProject && (
              <Alert severity="info" className={styles.statusAlert}>
                You have read access to this project. Only owners and admins can edit project
                settings or manage members.
              </Alert>
            )}

            <Box className={styles.contentGrid}>
              <section className={styles.section}>
                <Typography component="h3" className={styles.sectionTitle}>
                  Project details
                </Typography>

                <Box className={styles.formGrid}>
                  <TextField
                    label="Title"
                    value={projectForm.title}
                    onChange={handleFieldChange("title")}
                    disabled={!canManageProject}
                    fullWidth
                  />

                  <Box className={styles.detailsRows}>
                    <Box className={styles.detailsRow}>
                      <TextField
                        select
                        label="Status"
                        value={projectForm.status}
                        onChange={handleFieldChange("status")}
                        disabled={!canManageProject}
                        fullWidth
                      >
                        {projectStatusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Color"
                        value={projectForm.color}
                        onChange={handleFieldChange("color")}
                        disabled={!canManageProject}
                        fullWidth
                      >
                        {projectColorOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className={styles.detailsRow}>
                      <TextField
                        label="Start date"
                        type="date"
                        value={projectForm.startDate}
                        onChange={handleFieldChange("startDate")}
                        disabled={!canManageProject}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />

                      <TextField
                        label="Due date"
                        type="date"
                        value={projectForm.dueDate}
                        onChange={handleFieldChange("dueDate")}
                        disabled={!canManageProject}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Box>
                  </Box>
                </Box>
              </section>

              <section className={styles.section}>
                <Typography component="h3" className={styles.sectionTitle}>
                  Project members
                </Typography>

                <Box className={styles.addMemberRow}>
                  <TextField
                    label="Invite by email"
                    type="email"
                    value={invitationEmail}
                    onChange={handleInvitationEmailChange}
                    disabled={!canManageProject}
                    fullWidth
                    placeholder="name@example.com"
                  />

                  <TextField
                    select
                    label="Role"
                    value={invitationRole}
                    onChange={handleInvitationRoleChange}
                    disabled={!canManageProject}
                    fullWidth
                  >
                    {projectMemberRoleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    onClick={() => {
                      void handleSendInvitation();
                    }}
                    disabled={!canManageProject || !invitationEmail.trim() || isMutating}
                  >
                    Invite
                  </Button>
                </Box>

                {pendingInvitationItems.length > 0 && (
                  <Box className={styles.pendingInvitations}>
                    <Typography className={styles.helperText}>Pending invitations</Typography>

                    <Box className={styles.pendingInvitationList}>
                      {pendingInvitationItems.map((invitation) => (
                        <Box key={invitation.id} className={styles.pendingInvitationRow}>
                          <Box>
                            <Typography className={styles.memberName}>
                              {invitation.invitedUserName
                                ? `${invitation.invitedUserName} · ${invitation.email}`
                                : invitation.email}
                            </Typography>
                            <Typography className={styles.memberMeta}>
                              Sent {invitation.createdAt}
                            </Typography>
                          </Box>

                          <Box className={styles.pendingInvitationMeta}>
                            <Chip size="small" label={invitation.role} />
                            <Chip size="small" label="Pending" color="info" variant="outlined" />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <Box className={styles.memberList}>
                  {memberItems.map((member) => (
                    <Box key={member.id} className={styles.memberRow}>
                      <Box className={styles.memberInfo}>
                        <Avatar>{member.initials}</Avatar>

                        <Box>
                          <Typography className={styles.memberName}>
                            {member.name}
                            {member.isCurrentUser ? " (You)" : ""}
                          </Typography>
                          <Typography className={styles.memberMeta}>
                            {member.email} · Joined {member.joinedAt}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className={styles.memberActions}>
                        <TextField
                          select
                          size="small"
                          value={member.role}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            void handleMemberRoleChange(
                              member.id,
                              event.target.value as "admin" | "member" | "viewer",
                            );
                          }}
                          disabled={!canManageProject || member.isOwner || isMutating}
                        >
                          {member.isOwner ? (
                            <MenuItem value="owner">Owner</MenuItem>
                          ) : (
                            projectMemberRoleOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))
                          )}
                        </TextField>

                        <Button
                          color="error"
                          variant="text"
                          onClick={() => {
                            void handleRemoveMember(member.id);
                          }}
                          disabled={
                            member.isCurrentUser
                              ? member.isOwner || isMutating
                              : !canManageProject || member.isOwner || isMutating
                          }
                        >
                          {member.isCurrentUser ? "Leave project" : "Remove"}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </section>
            </Box>
          </>
        )}
      </Box>
    </AppModal>
  );
};
