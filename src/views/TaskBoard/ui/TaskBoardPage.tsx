import {
  Add,
  AttachFile,
  ChatBubbleOutlined,
  CheckCircleOutlined,
  MicNoneOutlined,
  MoreHoriz,
  Pause,
} from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import { type FC, useState } from "react";

import type { BoardTask, TaskCategory } from "@/views/TaskBoard/model/taskBoard.types.ts";

import { boardColumns, boardMembers, chatMessages } from "../model/taskBoard.data.ts";
import styles from "./TaskBoardPage.module.scss";

const categoryClassNames: Record<TaskCategory, string> = {
  Design: styles.designCategory,
  Research: styles.researchCategory,
  Planning: styles.planningCategory,
  Content: styles.contentCategory,
};

function MemberAvatar({ member, size = "medium" }: { member: string; size?: "small" | "medium" }) {
  return (
    <Avatar
      className={`${styles.memberAvatar} ${size === "small" ? styles.smallMemberAvatar : ""}`}
    >
      {member}
      <span className={styles.memberStatus} />
    </Avatar>
  );
}

function TaskCard({ task }: { task: BoardTask }) {
  return (
    <Paper className={styles.taskCard} elevation={0}>
      <Box className={`${styles.taskCategory} ${categoryClassNames[task.category]}`}>
        {task.category}
      </Box>

      {task.image && <Box component="img" src={task.image} alt="" className={styles.taskImage} />}

      <Typography component="h3" className={styles.taskTitle}>
        {task.title}
      </Typography>

      <Typography className={styles.taskDescription}>{task.description}</Typography>

      <Box className={styles.taskDate}>{task.date}</Box>

      <Box className={styles.taskFooter}>
        <AvatarGroup
          max={4}
          className={styles.taskMembers}
          slotProps={{
            surplus: {
              className: styles.additionalAvatar,
            },
          }}
        >
          {task.members.map((member) => (
            <Avatar key={`${task.id}-${member}`}>{member}</Avatar>
          ))}
        </AvatarGroup>

        <Box className={styles.taskStatistics}>
          {task.comments !== undefined && (
            <Box>
              <ChatBubbleOutlined />
              <span>{task.comments} Comment</span>
            </Box>
          )}

          {task.files !== undefined && (
            <Box>
              <AttachFile />
              <span>{task.files} file</span>
            </Box>
          )}

          {task.total !== undefined && (
            <Box>
              <CheckCircleOutlined />
              <span>
                {task.completed}/{task.total}
              </span>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

function BoardColumn({ title, tasks }: { title: string; tasks: BoardTask[] }) {
  return (
    <section className={styles.boardColumn}>
      <Paper className={styles.columnHeader} elevation={0}>
        <Typography component="h2">{title}</Typography>

        <Box>
          <IconButton aria-label={`More actions for ${title}`}>
            <MoreHoriz />
          </IconButton>

          <IconButton className={styles.addTaskButton} aria-label={`Add task to ${title}`}>
            <Add />
          </IconButton>
        </Box>
      </Paper>

      <Box className={styles.columnTasks}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </section>
  );
}

function AudioMessage() {
  const audioLines = [10, 20, 16, 27, 19, 31, 24, 15, 27, 20, 12, 18, 26, 11, 20, 14, 9, 18];

  return (
    <Box className={styles.audioMessage}>
      <IconButton>
        <Pause />
      </IconButton>

      <Box className={styles.audioWave}>
        {audioLines.map((height, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${height}-${index}`}
            style={{
              height,
            }}
          />
        ))}
      </Box>

      <Typography>1:25</Typography>
    </Box>
  );
}

export const TaskBoardPage: FC = () => {
  const [message, setMessage] = useState("");

  return (
    <Box className={styles.page}>
      <div className={styles.boardContent}>
        <Box className={styles.boardTop}>
          <Typography component="h1">
            <span>🔥</span>
            Task - Artyfact
          </Typography>

          <Box className={styles.boardMemberSummary}>
            <AvatarGroup max={5} className={styles.boardMemberGroup}>
              {boardMembers.slice(0, 5).map((member) => (
                <Avatar key={`${member}`}>{member}</Avatar>
              ))}
            </AvatarGroup>

            <Typography>+6</Typography>

            <IconButton>
              <Add />
            </IconButton>
          </Box>
        </Box>

        <Box className={styles.board}>
          {boardColumns.map((column) => (
            <BoardColumn key={column.id} title={column.title} tasks={column.tasks} />
          ))}
        </Box>
      </div>

      <aside className={styles.chatSidebar}>
        <Box className={styles.membersSection}>
          <Box className={styles.membersHeader}>
            <Typography>
              Member <span>(25)</span>
            </Typography>

            <button type="button">View All</button>
          </Box>

          <Box className={styles.membersList}>
            {boardMembers.slice(0, 6).map((member) => (
              <MemberAvatar key={`${member}`} member={member} />
            ))}
          </Box>
        </Box>

        <section className={styles.chatSection}>
          <Typography component="h2">Group Chat</Typography>

          <Box className={styles.messages}>
            {chatMessages.map((chatMessage) => (
              <Box
                key={chatMessage.id}
                className={`${styles.messageRow} ${chatMessage.isOwn ? styles.ownMessageRow : ""}`}
              >
                {!chatMessage.isOwn && <MemberAvatar member={chatMessage.avatar} size="small" />}

                <Box className={styles.messageContainer}>
                  {chatMessage.audio ? (
                    <AudioMessage />
                  ) : (
                    <Box
                      className={`${styles.messageBubble} ${
                        chatMessage.isOwn ? styles.ownMessageBubble : ""
                      }`}
                    >
                      {chatMessage.text}
                    </Box>
                  )}

                  <Typography className={styles.messageTime}>{chatMessage.time}</Typography>
                </Box>

                {chatMessage.isOwn && <MemberAvatar member={chatMessage.avatar} size="small" />}
              </Box>
            ))}
          </Box>
        </section>

        <Box className={styles.messageInputWrapper}>
          <TextField
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            placeholder="write here..."
            className={styles.messageInput}
            fullWidth
          />

          <IconButton aria-label="Record voice message">
            <MicNoneOutlined />
          </IconButton>

          <IconButton aria-label="More message options">
            <MoreHoriz />
          </IconButton>
        </Box>
      </aside>
    </Box>
  );
};
