import { Add, ArrowBackIosNew, ArrowForward, ArrowForwardIos, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Chip, IconButton, Paper, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import { StatisticsCard } from "@/entities/statistic/ui";
import { TaskCard } from "@/entities/task/ui";

import { messages, statistics, tasks } from "../model/dashboard.data.ts";
import styles from "./DashboardPage.module.scss";

const emojis = ["🎉", "😍", "😁", "🔥", "😘", "😉", "😎", "👩", "🙄"];

export const DashboardPage: FC = () => {
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");
  const [taskTitle, setTaskTitle] = useState("Create new");

  return (
    <Box className={styles.pageContent}>
      <div className={styles.mainContent}>
        <Box className={styles.statistics}>
          {statistics.map((statistic) => (
            <StatisticsCard statistic={statistic} key={statistic.id} />
          ))}
        </Box>

        <Paper className={styles.analyticsCard} elevation={0}>
          <Box className={styles.analyticsHeader}>
            <Typography component="h2">Task Done</Typography>

            <Box className={styles.periodNavigation}>
              {(["Daily", "Weekly", "Monthly"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={period === item ? styles.activePeriod : ""}
                  onClick={() => {
                    setPeriod(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </Box>
          </Box>

          <img src="/images/main-chart.png" alt="statistics chart" className={styles.mainChart} />
        </Paper>

        <section className={styles.tasksSection}>
          <Typography component="h2">Task</Typography>

          <Box className={styles.tasksList}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </section>
      </div>

      <aside className={styles.rightSidebar}>
        <section className={styles.messagesSection}>
          <Typography component="h2">Messages</Typography>

          <Box className={styles.messagesList}>
            {messages.map((message) => (
              <Box key={message.id} className={styles.message}>
                <Avatar className={styles.messageAvatar} sx={{ borderColor: message.color }}>
                  {message.avatar}
                </Avatar>

                <Box className={styles.messageContent}>
                  <Typography>{message.name}</Typography>
                  <Typography>{message.message}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </section>

        <section className={styles.newTaskSection}>
          <Box className={styles.newTaskHeader}>
            <Typography component="h2">New Task</Typography>

            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>

          <Typography className={styles.inputLabel}>Task Title - Artyfact (Project)</Typography>

          <TextField
            fullWidth
            value={taskTitle}
            onChange={(event) => {
              setTaskTitle(event.target.value);
            }}
            className={styles.taskInput}
          />

          <Box className={styles.emojiPicker}>
            <IconButton>
              <ArrowBackIosNew />
            </IconButton>

            <Box className={styles.emojis}>
              {emojis.map((emoji) => (
                <button key={emoji} type="button" aria-label={`Select ${emoji}`}>
                  {emoji}
                </button>
              ))}
            </Box>

            <IconButton>
              <ArrowForwardIos />
            </IconButton>
          </Box>

          <Box className={styles.newTaskDivider} />

          <Typography className={styles.inputLabel}>Add Collaborators</Typography>

          <Box className={styles.collaborators}>
            <Box className={styles.collaboratorChips}>
              <Chip avatar={<Avatar>AN</Avatar>} label="Angela" onDelete={() => undefined} />

              <Chip avatar={<Avatar>CH</Avatar>} label="Chris" onDelete={() => undefined} />

              <IconButton className={styles.addCollaboratorButton}>
                <Add />
              </IconButton>
            </Box>

            <IconButton className={styles.submitTaskButton}>
              <ArrowForward />
            </IconButton>
          </Box>
        </section>
      </aside>
    </Box>
  );
};
