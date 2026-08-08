import { Alert, Avatar, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";

import {
  projectColorOptions,
  projectMemberRoleOptions,
  projectStatusOptions,
} from "@/entities/project";

import { useProjectManagementPanel } from "../model/useProjectManagementPanel";
import styles from "./ProjectManagementPanel.module.scss";

export const ProjectManagementPanel: FC = () => {
  const {
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
    isLoading,
    isMutating,
    memberItems,
    projectForm,
    selectedProjectId,
    selectedProjectTitle,
    selectedUserId,
    statusMessage,
    statusTone,
  } = useProjectManagementPanel();

  if (!selectedProjectId) {
    return (
      <Paper className={styles.panel} elevation={0}>
        <Typography component="h2" className={styles.title}>
          Project control center
        </Typography>

        <Typography className={styles.helperText}>
          Select a project from the list above to edit it, manage members, or open its board.
        </Typography>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper className={styles.panel} elevation={0}>
        <Typography>Loading project settings...</Typography>
      </Paper>
    );
  }

  return (
    <Paper className={styles.panel} elevation={0}>
      <Box className={styles.panelHeader}>
        <Box>
          <Typography component="h2" className={styles.title}>
            Project control center
          </Typography>

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
            disabled={!canManageProject || isMutating || !projectForm.title.trim()}
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

      {statusMessage && statusTone && (
        <Alert severity={statusTone} className={styles.statusAlert}>
          {statusMessage}
        </Alert>
      )}

      {!canManageProject && (
        <Alert severity="info" className={styles.statusAlert}>
          You have read access to this project. Only owners and admins can edit project settings or
          manage members.
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

            <TextField
              label="Description"
              value={projectForm.description}
              onChange={handleFieldChange("description")}
              multiline
              minRows={4}
              disabled={!canManageProject}
              fullWidth
              className={styles.descriptionField}
            />

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
        </section>

        <section className={styles.section}>
          <Typography component="h3" className={styles.sectionTitle}>
            Project members
          </Typography>

          <Box className={styles.addMemberRow}>
            <TextField
              select
              label="User"
              value={selectedUserId}
              onChange={handleSelectedUserChange}
              disabled={!canManageProject || availableUsers.length === 0}
              fullWidth
            >
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No users available
                </MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Role"
              value={addMemberRole}
              onChange={handleAddMemberRoleChange}
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
                void handleAddMember();
              }}
              disabled={!canManageProject || !selectedUserId || isMutating}
            >
              Add
            </Button>
          </Box>

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
                    disabled={!canManageProject || member.isOwner || isMutating}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </section>
      </Box>
    </Paper>
  );
};
