import { Box } from "@mui/material";
import { type FC } from "react";

import { ActivityChart, FilesHeader, FoldersList, RecentFiles, StorageOverview } from "@/widgets";

import styles from "./FilesPage.module.scss";

export const FilesPage: FC = () => {
  return (
    <main className={styles.page}>
      <FilesHeader />

      <Box className={styles.layout}>
        <Box className={styles.mainColumn}>
          <FoldersList />
          <RecentFiles />
        </Box>

        <aside className={styles.sideColumn}>
          <StorageOverview />
          <ActivityChart />
        </aside>
      </Box>
    </main>
  );
};
