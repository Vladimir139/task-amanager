import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";
import { TaskBoardColumns } from "@/widgets/TaskBoardColumns";
import { TaskBoardHeader } from "@/widgets/TaskBoardHeader";
import {
  type TaskBoardManagementMode,
  TaskBoardManagementPanel,
} from "@/widgets/TaskBoardManagementPanel";
import { TaskBoardSidebar } from "@/widgets/TaskBoardSidebar";
import { TaskBoardTaskDialog } from "@/widgets/TaskBoardTaskDialog";

import { useTaskBoardWorkspace } from "../model/useTaskBoardWorkspace";
import styles from "./TaskBoardWorkspace.module.scss";

export const TaskBoardWorkspace: FC = () => {
  const [managementMode, setManagementMode] = useState<TaskBoardManagementMode | null>(null);
  const {
    activeBoardId,
    board,
    boardColumnRecords,
    boardColumns,
    boardMembers,
    boardMessages,
    boards,
    canManageBoard,
    canManageTasks,
    canWriteBoardChat,
    closeCreateTask,
    closeTask,
    createTaskColumnId,
    hasBoard,
    isError,
    isLoading,
    isMessagesError,
    isSavingGlobalProject,
    isSendingMessage,
    memberOptions,
    message,
    onAudioRecorded,
    onBoardSelect,
    onCloseDeleteMessageConfirm,
    onConfirmDeleteMessage,
    onCreateTask,
    onMakeProjectGlobal,
    onOpenTask,
    pendingDeleteMessageId,
    pendingDeleteMessageText,
    projectId,
    selectedTaskId,
    sendMessage,
    setMessage,
    shouldShowMakeProjectGlobalAction,
    taskBoardEmoji,
    taskBoardExtraMembersCount,
    taskBoardMembersCount,
    taskBoardTitle,
    tasksByColumn,
    typingText,
  } = useTaskBoardWorkspace();

  if (isLoading) {
    return <Typography>Loading board...</Typography>;
  }

  if (isError) {
    return <Typography>Unable to load board for the selected project.</Typography>;
  }

  if (!hasBoard) {
    return <Typography>No board available yet. Create a project first.</Typography>;
  }

  return (
    <Box className={styles.page}>
      <div className={styles.boardContent}>
        <TaskBoardHeader
          activeBoardId={activeBoardId}
          boards={boards}
          canManageBoard={canManageBoard}
          emoji={taskBoardEmoji}
          isMakingProjectGlobal={isSavingGlobalProject}
          title={taskBoardTitle}
          members={boardMembers.slice(0, 5)}
          extraMembersCount={taskBoardExtraMembersCount}
          onCreateBoard={() => {
            setManagementMode("create-board");
          }}
          onBoardSelect={onBoardSelect}
          onCreateColumn={() => {
            setManagementMode("create-column");
          }}
          onEditBoard={() => {
            setManagementMode("current-board");
          }}
          onMakeProjectGlobal={() => {
            void onMakeProjectGlobal();
          }}
          showMakeProjectGlobalButton={shouldShowMakeProjectGlobalAction}
        />

        {activeBoardId && projectId && (
          <TaskBoardColumns
            boardId={activeBoardId}
            canManageBoard={canManageBoard}
            canManageTasks={canManageTasks}
            columnRecords={boardColumnRecords}
            columns={boardColumns}
            projectId={projectId}
            tasksByColumn={tasksByColumn}
            onCreateTask={onCreateTask}
            onOpenTask={onOpenTask}
          />
        )}
      </div>

      <TaskBoardSidebar
        canWrite={canWriteBoardChat}
        members={boardMembers.slice(0, 6)}
        membersCount={taskBoardMembersCount}
        messages={boardMessages}
        message={message}
        onAudioRecorded={(payload) => {
          void onAudioRecorded(payload);
        }}
        onMessageChange={setMessage}
        onMessageSubmit={() => {
          void sendMessage();
        }}
        isError={isMessagesError}
        isSubmitting={isSendingMessage}
        typingText={typingText}
      />

      {activeBoardId && projectId && (
        <TaskBoardTaskDialog
          boardId={activeBoardId}
          canManageBoard={canManageBoard}
          canManageTasks={canManageTasks}
          columns={boardColumnRecords}
          createColumnId={createTaskColumnId}
          memberOptions={memberOptions}
          onClose={() => {
            closeCreateTask();
            closeTask();
          }}
          onTaskCreated={(taskId) => {
            closeCreateTask();
            onOpenTask(taskId);
          }}
          openTaskId={selectedTaskId}
          projectId={projectId}
          tasksByColumn={tasksByColumn}
        />
      )}

      {board && projectId && managementMode && (
        <TaskBoardManagementPanel
          board={board}
          boards={boards}
          canManageBoard={canManageBoard}
          columns={boardColumnRecords}
          mode={managementMode}
          onClose={() => {
            setManagementMode(null);
          }}
          open={Boolean(managementMode)}
          projectId={projectId}
          tasksByColumn={tasksByColumn}
        />
      )}

      <AppModal
        open={Boolean(pendingDeleteMessageId)}
        onClose={onCloseDeleteMessageConfirm}
        title="Delete message?"
        footer={
          <>
            <Button variant="outlined" onClick={onCloseDeleteMessageConfirm}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={() => void onConfirmDeleteMessage()}>
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          {pendingDeleteMessageText
            ? `This message will be deleted: “${pendingDeleteMessageText}”.`
            : "This message will be deleted permanently."}
        </Typography>
      </AppModal>
    </Box>
  );
};
