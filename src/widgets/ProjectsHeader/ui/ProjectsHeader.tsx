import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";

import { useCreateProjectMutation } from "@/entities/project";

import styles from "./ProjectsHeader.module.scss";

export const ProjectsHeader: FC = () => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleCreateProject = async () => {
    const title = window.prompt("Project title");

    if (!title?.trim()) {
      return;
    }

    const description = window.prompt("Project description") ?? "";

    await createProject({
      color: "blue",
      description,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      title: title.trim(),
    });
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
        onClick={() => {
          void handleCreateProject();
        }}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "New Project"}
      </Button>
    </Box>
  );
};
