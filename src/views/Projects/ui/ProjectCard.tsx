import { CalendarMonthOutlined, CheckCircleOutlined, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import type { FC } from "react";

import type { Project } from "../model/projects.types";
import styles from "./ProjectsPage.module.scss";

interface ProjectCardProps {
  project: Project;
}

const statusLabels: Record<Project["status"], string> = {
  active: "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
};

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <Paper className={styles.projectCard} elevation={0}>
      <Box className={styles.projectCardHeader}>
        <Box className={`${styles.projectIcon} ${styles[project.color]}`} aria-hidden="true">
          {project.title.slice(0, 1)}
        </Box>

        <IconButton
          className={styles.projectMenuButton}
          aria-label={`Actions for ${project.title}`}
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Typography component="h2" className={styles.projectTitle}>
        {project.title}
      </Typography>

      <Typography className={styles.projectDescription}>{project.description}</Typography>

      <Box className={styles.projectStatusRow}>
        <span className={`${styles.projectStatus} ${styles[`${project.status}Status`]}`}>
          {statusLabels[project.status]}
        </span>

        <Typography>{project.progress}%</Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={project.progress}
        className={`${styles.projectProgress} ${styles[project.color]}`}
      />

      <Box className={styles.projectInformation}>
        <Box>
          <CheckCircleOutlined />
          <Typography>
            {project.tasksCompleted}/{project.tasksTotal} Tasks
          </Typography>
        </Box>

        <Box>
          <CalendarMonthOutlined />
          <Typography>{project.dueDate}</Typography>
        </Box>
      </Box>

      <Box className={styles.projectFooter}>
        <AvatarGroup
          max={4}
          className={styles.projectMembers}
          slotProps={{
            surplus: {
              className: styles.additionalMember,
            },
          }}
        >
          {project.members.map((member) => (
            <Avatar key={member.id} alt={member.name}>
              {member.initials}
            </Avatar>
          ))}
        </AvatarGroup>

        <button type="button" className={styles.openProjectButton}>
          Open Project
        </button>
      </Box>
    </Paper>
  );
};
