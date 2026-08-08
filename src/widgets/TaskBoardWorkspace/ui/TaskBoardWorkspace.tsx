import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { TaskBoardColumns } from "@/widgets/TaskBoardColumns";
import { TaskBoardHeader } from "@/widgets/TaskBoardHeader";
import { TaskBoardSidebar } from "@/widgets/TaskBoardSidebar";

import { useTaskBoardWorkspace } from "../model/useTaskBoardWorkspace";
import styles from "./TaskBoardWorkspace.module.scss";

export const TaskBoardWorkspace: FC = () => {
  const {
    boardColumns,
    boardMembers,
    boardMessages,
    hasBoard,
    isLoading,
    isSendingMessage,
    message,
    sendMessage,
    setMessage,
    taskBoardEmoji,
    taskBoardExtraMembersCount,
    taskBoardMembersCount,
    taskBoardTitle,
  } = useTaskBoardWorkspace();

  if (isLoading) {
    return <Typography>Loading board...</Typography>;
  }

  if (!hasBoard) {
    return <Typography>No board available yet. Create a project first.</Typography>;
  }

  return (
    <Box className={styles.page}>
      <div className={styles.boardContent}>
        <TaskBoardHeader
          emoji={taskBoardEmoji}
          title={taskBoardTitle}
          members={boardMembers.slice(0, 5)}
          extraMembersCount={taskBoardExtraMembersCount}
        />

        <TaskBoardColumns columns={boardColumns} />
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
        isSubmitting={isSendingMessage}
      />
    </Box>
  );
};
