import { Add, MoreHoriz } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { BoardColumn } from "@/entities/boardTask";
import { BoardTaskCard } from "@/entities/boardTask";

import styles from "./TaskBoardColumns.module.scss";

interface TaskBoardColumnsProps {
  columns: BoardColumn[];
}

function BoardColumnSection({ title, tasks }: BoardColumn) {
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
          <BoardTaskCard key={task.id} task={task} />
        ))}
      </Box>
    </section>
  );
}

export const TaskBoardColumns: FC<TaskBoardColumnsProps> = ({ columns }) => {
  return (
    <Box className={styles.board}>
      {columns.map((column) => (
        <BoardColumnSection key={column.id} {...column} />
      ))}
    </Box>
  );
};
