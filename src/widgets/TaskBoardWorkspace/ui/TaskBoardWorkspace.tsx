import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/router";
import { TaskBoardColumns } from "@/widgets/TaskBoardColumns";
import { TaskBoardHeader } from "@/widgets/TaskBoardHeader";
import { TaskBoardManagementPanel } from "@/widgets/TaskBoardManagementPanel";
import { TaskBoardSidebar } from "@/widgets/TaskBoardSidebar";
import { TaskBoardTaskDialog } from "@/widgets/TaskBoardTaskDialog";

import { useTaskBoardWorkspace } from "../model/useTaskBoardWorkspace";
import styles from "./TaskBoardWorkspace.module.scss";

export const TaskBoardWorkspace: FC = () => {
  const {
    activeBoardId,
    board,
    boardColumnRecords,
    boardColumns,
    boardMembers,
    boardMessages,
    boards,
    canManageBoard,
    closeCreateTask,
    closeTask,
    createTaskColumnId,
    hasBoard,
    isError,
    isLoading,
    isMessagesError,
    isProjectSelected,
    isSendingMessage,
    memberOptions,
    message,
    onBoardSelect,
    onCreateTask,
    onOpenTask,
    projectId,
    selectedTaskId,
    sendMessage,
    setMessage,
    taskBoardEmoji,
    taskBoardExtraMembersCount,
    taskBoardMembersCount,
    taskBoardTitle,
    tasksByColumn,
    typingText,
  } = useTaskBoardWorkspace();

  if (!isProjectSelected) {
    return (
      <Box className={styles.page}>
        <Box className={styles.boardContent}>
          <Typography>Select a project from the projects page to open its board.</Typography>

          <Button component={Link} to={ROUTES.projects.page} variant="contained">
            Open projects
          </Button>
        </Box>
      </Box>
    );
  }

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
          emoji={taskBoardEmoji}
          title={taskBoardTitle}
          members={boardMembers.slice(0, 5)}
          extraMembersCount={taskBoardExtraMembersCount}
          onBoardSelect={onBoardSelect}
        />

        {board && projectId && (
          <TaskBoardManagementPanel
            board={board}
            boards={boards}
            canManageBoard={canManageBoard}
            columns={boardColumnRecords}
            projectId={projectId}
            tasksByColumn={tasksByColumn}
          />
        )}

        <TaskBoardColumns
          columns={boardColumns}
          onCreateTask={onCreateTask}
          onOpenTask={onOpenTask}
        />
      </div>

      <TaskBoardSidebar
        members={boardMembers.slice(0, 6)}
        membersCount={taskBoardMembersCount}
        messages={boardMessages}
        message={message}
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
    </Box>
  );
};
