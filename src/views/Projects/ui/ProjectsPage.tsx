import { Box } from "@mui/material";
import type { FC } from "react";

import { ProjectsCatalog, ProjectsHeader, ProjectStatistics } from "@/widgets";

import styles from "./ProjectsPage.module.scss";

export const ProjectsPage: FC = () => {
  return (
    <Box component="main" className={styles.page}>
      <ProjectsHeader />
      <ProjectStatistics />
      <ProjectsCatalog />
    </Box>
  );
};
