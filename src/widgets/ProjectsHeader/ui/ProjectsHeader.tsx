import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";

import styles from "./ProjectsHeader.module.scss";

export const ProjectsHeader: FC = () => {
  const handleCreateProject = () => {
    console.log("Open create project modal");
  };

  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Typography component="h1">Projects</Typography>

        <Typography>Manage your projects, tasks and team workload.</Typography>
      </Box>

      <Button
        variant="contained"
        disableElevation
        startIcon={<Add />}
        className={styles.createButton}
        onClick={handleCreateProject}
      >
        New Project
      </Button>
    </Box>
  );
};
