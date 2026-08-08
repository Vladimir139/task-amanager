import { Box, Paper, Typography } from "@mui/material";
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
        <Box className={styles.columnMeta}>
          <Typography component="h2">{title}</Typography>
          <Typography>{tasks.length} tasks</Typography>
        </Box>
      </Paper>

      <Box className={styles.columnTasks}>
        {tasks.length > 0 ? (
          tasks.map((task) => <BoardTaskCard key={task.id} task={task} />)
        ) : (
          <Typography className={styles.emptyState}>No tasks in this column yet.</Typography>
        )}
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
