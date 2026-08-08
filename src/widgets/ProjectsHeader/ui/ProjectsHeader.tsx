import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { CreateProjectButton } from "@/features/createProject";

import styles from "./ProjectsHeader.module.scss";

export const ProjectsHeader: FC = () => {
  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Typography component="h1">Projects</Typography>

        <Typography>Manage your projects, tasks and team workload.</Typography>
      </Box>

      <CreateProjectButton className={styles.createButton} />
    </Box>
  );
};
