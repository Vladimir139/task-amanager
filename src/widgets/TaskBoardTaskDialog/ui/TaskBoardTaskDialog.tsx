import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";

import type { BoardColumnRecord, TaskRecord } from "@/shared/api/types";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";

import { useTaskBoardTaskDialog } from "../model/useTaskBoardTaskDialog";
import styles from "./TaskBoardTaskDialog.module.scss";

interface TaskBoardTaskDialogProps {
  boardId: string;
  canManageBoard: boolean;
  columns: BoardColumnRecord[];
  createColumnId: string | null;
  memberOptions: Array<{
    id: string;
    initials: string;
    isOnline?: boolean;
    name: string;
  }>;
  onClose: () => void;
  onTaskCreated: (taskId: string) => void;
  openTaskId: string | null;
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

export const TaskBoardTaskDialog: FC<TaskBoardTaskDialogProps> = ({
  boardId,
  canManageBoard,
  columns,
  createColumnId,
  memberOptions,
  onClose,
  onTaskCreated,
  openTaskId,
  projectId,
  tasksByColumn,
}) => {
  const {
    attachmentCount,
    availableFiles,
    canManageTask,
    commentDraft,
    commentLoadError,
    commentStatusMessage,
    commentStatusTone,
    comments,
    dialogTitle,
    editingCommentId,
    editingCommentText,
    form,
    handleAttachExistingFiles,
    handleCancelCommentEdit,
    handleCommentDraftChange,
    handleCreateComment,
    handleDeleteTask,
    handleDeleteComment,
    handleEditCommentTextChange,
    handleFieldChange,
    handleMovePlacementChange,
    handleMoveTask,
    handleSaveAssignees,
    handleSaveTask,
    handleSaveWatchers,
    handleSelectedExistingFileToggle,
    handleStartCommentEdit,
    handleUpdateComment,
    handleUploadNewFiles,
    handleWatcherToggle,
    isCommentMutating,
    isCommentsLoading,
    isCreateMode,
    isLoading,
    isMutating,
    isOpen,
    movePlacement,
    moveTargetColumnId,
    priorityOptions,
    recentFilesError,
    selectedExistingFileIds,
    setAssigneeSelection,
    setMoveTargetColumnId,
    statusMessage,
    statusTone,
    taskCategoryOptions,
    taskLoadError,
    taskWorkflowStateOptions,
    watcherIds,
  } = useTaskBoardTaskDialog({
    boardId,
    canManageBoard,
    columns,
    createColumnId,
    memberOptions,
    onClose,
    onTaskCreated,
    openTaskId,
    projectId,
    tasksByColumn,
  });

  useStatusToast({ message: statusMessage, tone: statusTone });
  useStatusToast({ message: commentStatusMessage, tone: commentStatusTone });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent dividers>
        <Box className={styles.content}>
          {!canManageTask && !isCreateMode && (
            <Alert severity="info">
              You can view this task, but only the reporter, board owners, and board admins can
              modify it.
            </Alert>
          )}

          {taskLoadError && !isCreateMode && (
            <Alert severity="error">Unable to load the selected task.</Alert>
          )}

          {isLoading && !isCreateMode ? (
            <Typography>Loading task details...</Typography>
          ) : taskLoadError && !isCreateMode ? null : (
            <>
              <section className={styles.section}>
                <Typography component="h3" className={styles.sectionTitle}>
                  Task details
                </Typography>

                <Box className={styles.formGrid}>
                  <TextField
                    label="Title"
                    value={form.title}
                    onChange={handleFieldChange("title")}
                    disabled={!canManageTask}
                    fullWidth
                  />

                  <TextField
                    label="Emoji"
                    value={form.emoji}
                    onChange={handleFieldChange("emoji")}
                    disabled={!canManageTask}
                    fullWidth
                  />

                  <TextField
                    select
                    label="Column"
                    value={form.columnId}
                    onChange={handleFieldChange("columnId")}
                    disabled={!canManageTask}
                    fullWidth
                  >
                    {columns.map((column) => (
                      <MenuItem key={column._id} value={column._id}>
                        {column.title}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Priority"
                    value={form.priority}
                    onChange={handleFieldChange("priority")}
                    disabled={!canManageTask}
                    fullWidth
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {!isCreateMode && (
                    <TextField
                      select
                      label="Workflow state"
                      value={form.workflowState}
                      onChange={handleFieldChange("workflowState")}
                      disabled={!canManageTask}
                      fullWidth
                    >
                      {taskWorkflowStateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  <TextField
                    select
                    label="Category"
                    value={form.category}
                    onChange={handleFieldChange("category")}
                    disabled={!canManageTask}
                    fullWidth
                  >
                    {taskCategoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Start date"
                    type="date"
                    value={form.startDate}
                    onChange={handleFieldChange("startDate")}
                    disabled={!canManageTask}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />

                  <TextField
                    label="Due date"
                    type="date"
                    value={form.dueDate}
                    onChange={handleFieldChange("dueDate")}
                    disabled={!canManageTask}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />

                  <TextField
                    label="Subtasks total"
                    type="number"
                    value={form.checklistTotal}
                    onChange={handleFieldChange("checklistTotal")}
                    disabled={!canManageTask}
                    slotProps={{ htmlInput: { min: 0 } }}
                    fullWidth
                  />

                  <TextField
                    label="Completed subtasks"
                    type="number"
                    value={form.checklistCompleted}
                    onChange={handleFieldChange("checklistCompleted")}
                    disabled={!canManageTask}
                    slotProps={{ htmlInput: { min: 0 } }}
                    fullWidth
                  />

                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={handleFieldChange("description")}
                    disabled={!canManageTask}
                    multiline
                    minRows={4}
                    fullWidth
                    className={styles.fullWidthField}
                  />
                </Box>

                <Box className={styles.actionRow}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      void handleSaveTask();
                    }}
                    disabled={!canManageTask || isMutating || !form.title.trim()}
                  >
                    {isCreateMode ? "Create task" : "Save task"}
                  </Button>

                  {!isCreateMode && (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => {
                        void handleDeleteTask();
                      }}
                      disabled={!canManageTask || isMutating}
                    >
                      Delete task
                    </Button>
                  )}
                </Box>
              </section>

              <section className={styles.section}>
                <Typography component="h3" className={styles.sectionTitle}>
                  Assignees
                </Typography>

                <Box className={styles.checkboxGrid}>
                  {memberOptions.map((member) => (
                    <FormControlLabel
                      key={member.id}
                      control={
                        <Checkbox
                          checked={form.assigneeIds.includes(member.id)}
                          onChange={() => {
                            setAssigneeSelection(member.id);
                          }}
                          disabled={!canManageTask}
                        />
                      }
                      label={member.name}
                    />
                  ))}
                </Box>

                {!isCreateMode && (
                  <Box className={styles.actionRow}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        void handleSaveAssignees();
                      }}
                      disabled={!canManageTask || isMutating}
                    >
                      Save assignees
                    </Button>
                  </Box>
                )}
              </section>

              {!isCreateMode && (
                <>
                  <section className={styles.section}>
                    <Typography component="h3" className={styles.sectionTitle}>
                      Watchers
                    </Typography>

                    <Box className={styles.checkboxGrid}>
                      {memberOptions.map((member) => (
                        <FormControlLabel
                          key={member.id}
                          control={
                            <Checkbox
                              checked={watcherIds.includes(member.id)}
                              onChange={() => {
                                handleWatcherToggle(member.id);
                              }}
                              disabled={!canManageTask}
                            />
                          }
                          label={member.name}
                        />
                      ))}
                    </Box>

                    <Box className={styles.actionRow}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          void handleSaveWatchers();
                        }}
                        disabled={!canManageTask || isMutating}
                      >
                        Save watchers
                      </Button>
                    </Box>
                  </section>

                  <section className={styles.section}>
                    <Typography component="h3" className={styles.sectionTitle}>
                      Move task
                    </Typography>

                    <Box className={styles.formGrid}>
                      <TextField
                        select
                        label="Target column"
                        value={moveTargetColumnId}
                        onChange={(event) => {
                          setMoveTargetColumnId(event.target.value);
                        }}
                        disabled={!canManageTask}
                        fullWidth
                      >
                        {columns.map((column) => (
                          <MenuItem key={column._id} value={column._id}>
                            {column.title}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Placement"
                        value={movePlacement}
                        onChange={handleMovePlacementChange}
                        disabled={!canManageTask}
                        fullWidth
                      >
                        <MenuItem value="top">Top of column</MenuItem>
                        <MenuItem value="bottom">Bottom of column</MenuItem>
                      </TextField>
                    </Box>

                    <Box className={styles.actionRow}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          void handleMoveTask();
                        }}
                        disabled={!canManageTask || isMutating}
                      >
                        Move task
                      </Button>
                    </Box>
                  </section>

                  <section className={styles.section}>
                    <Typography component="h3" className={styles.sectionTitle}>
                      Attachments
                    </Typography>

                    <Typography className={styles.helperText}>
                      This task currently has {attachmentCount} attached file
                      {attachmentCount === 1 ? "" : "s"}.
                    </Typography>

                    <Paper className={styles.attachmentPanel} elevation={0}>
                      <Typography className={styles.attachmentTitle}>
                        Attach recent files
                      </Typography>

                      {recentFilesError ? (
                        <Typography className={styles.helperText}>
                          Unable to load recent files for this task.
                        </Typography>
                      ) : availableFiles.length > 0 ? (
                        <Box className={styles.checkboxGrid}>
                          {availableFiles.map((file) => (
                            <FormControlLabel
                              key={file.id}
                              control={
                                <Checkbox
                                  checked={selectedExistingFileIds.includes(file.id)}
                                  onChange={() => {
                                    handleSelectedExistingFileToggle(file.id);
                                  }}
                                  disabled={!canManageTask}
                                />
                              }
                              label={file.label}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography className={styles.helperText}>
                          No recent files available for this project yet.
                        </Typography>
                      )}

                      <Box className={styles.actionRow}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            void handleAttachExistingFiles();
                          }}
                          disabled={
                            !canManageTask || isMutating || selectedExistingFileIds.length === 0
                          }
                        >
                          Attach selected files
                        </Button>
                      </Box>
                    </Paper>

                    <Paper className={styles.attachmentPanel} elevation={0}>
                      <Typography className={styles.attachmentTitle}>
                        Upload and attach new files
                      </Typography>

                      <Button
                        component="label"
                        variant="contained"
                        disabled={!canManageTask || isMutating}
                      >
                        Upload files
                        <input
                          hidden
                          multiple
                          type="file"
                          onChange={(event) => {
                            void handleUploadNewFiles(event);
                          }}
                        />
                      </Button>
                    </Paper>
                  </section>

                  <section className={styles.section}>
                    <Typography component="h3" className={styles.sectionTitle}>
                      Comments ({comments.length})
                    </Typography>

                    <Paper className={styles.commentComposer} elevation={0}>
                      <TextField
                        label="Add comment"
                        value={commentDraft}
                        onChange={handleCommentDraftChange}
                        multiline
                        minRows={3}
                        fullWidth
                      />

                      <Box className={styles.actionRow}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            void handleCreateComment();
                          }}
                          disabled={isCommentMutating || !commentDraft.trim()}
                        >
                          Add comment
                        </Button>
                      </Box>
                    </Paper>

                    {commentLoadError ? (
                      <Alert severity="error">Unable to load task comments.</Alert>
                    ) : isCommentsLoading ? (
                      <Typography>Loading comments...</Typography>
                    ) : comments.length === 0 ? (
                      <Typography className={styles.helperText}>
                        No comments yet. Start the discussion for this task.
                      </Typography>
                    ) : (
                      <Box className={styles.commentsList}>
                        {comments.map((comment) => {
                          const isEditing = editingCommentId === comment.id;

                          return (
                            <Paper key={comment.id} className={styles.commentCard} elevation={0}>
                              <Box className={styles.commentHeader}>
                                <Box className={styles.commentMeta}>
                                  <Typography className={styles.commentAuthor}>
                                    {comment.authorName}
                                  </Typography>
                                  <Typography className={styles.commentTimestamp}>
                                    {comment.createdAtLabel}
                                    {comment.editedAtLabel
                                      ? ` · Edited ${comment.editedAtLabel}`
                                      : ""}
                                  </Typography>
                                </Box>

                                {comment.canManage && !isEditing && (
                                  <Box className={styles.commentActions}>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        handleStartCommentEdit(comment.id, comment.text);
                                      }}
                                      disabled={isCommentMutating}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        void handleDeleteComment(comment.id);
                                      }}
                                      disabled={isCommentMutating}
                                    >
                                      Delete
                                    </Button>
                                  </Box>
                                )}
                              </Box>

                              {isEditing ? (
                                <Box className={styles.commentEditForm}>
                                  <TextField
                                    value={editingCommentText}
                                    onChange={handleEditCommentTextChange}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                  />

                                  <Box className={styles.actionRow}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        void handleUpdateComment();
                                      }}
                                      disabled={isCommentMutating || !editingCommentText.trim()}
                                    >
                                      Save comment
                                    </Button>
                                    <Button
                                      variant="text"
                                      onClick={handleCancelCommentEdit}
                                      disabled={isCommentMutating}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography className={styles.commentText}>
                                  {comment.text}
                                </Typography>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    )}
                  </section>
                </>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
