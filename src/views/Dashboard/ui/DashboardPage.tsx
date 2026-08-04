import { Box } from "@mui/material";
import type { FC } from "react";

import { DashboardStatistics, MessagesPreview, NewTask, TaskAnalytics, TaskList } from "@/widgets";

import styles from "./DashboardPage.module.scss";

export const DashboardPage: FC = () => {
  return (
    <Box className={styles.pageContent}>
      <div className={styles.mainContent}>
        <DashboardStatistics />
        <TaskAnalytics />
        <TaskList />
      </div>

      <aside className={styles.rightSidebar}>
        <MessagesPreview />
        <NewTask />
      </aside>
    </Box>
  );
};
