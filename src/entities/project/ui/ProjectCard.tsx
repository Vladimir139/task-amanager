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

import type { Project, ProjectCardProps } from "../model/types";
import styles from "./ProjectCard.module.scss";

const statusLabels: Record<Project["status"], string> = {
  active: "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
};

const statusClassNames: Record<Project["status"], string> = {
  active: styles.activeStatus,
  completed: styles.completedStatus,
  "on-hold": styles.onHoldStatus,
};

const colorClassNames: Record<Project["color"], string> = {
  purple: styles.purple,
  blue: styles.blue,
  orange: styles.orange,
  green: styles.green,
  red: styles.red,
};

export const ProjectCard: FC<ProjectCardProps> = ({ project, viewMode = "grid", onOpen }) => {
  const colorClassName = colorClassNames[project.color];
  const statusClassName = statusClassNames[project.status];

  const handleOpen = () => {
    onOpen?.(project);
  };

  return (
    <Paper
      className={`${styles.projectCard} ${viewMode === "list" ? styles.listProjectCard : ""}`}
      elevation={0}
    >
      <Box className={styles.projectCardHeader}>
        <Box className={`${styles.projectIcon} ${colorClassName}`} aria-hidden="true">
          {project.title.slice(0, 1)}
        </Box>

        <IconButton
          className={styles.projectMenuButton}
          aria-label={`Actions for ${project.title}`}
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Typography component="h3" className={styles.projectTitle}>
        {project.title}
      </Typography>

      <Typography className={styles.projectDescription}>{project.description}</Typography>

      <Box className={styles.projectStatusContainer}>
        <Box className={styles.projectStatusRow}>
          <span className={`${styles.projectStatus} ${statusClassName}`}>
            {statusLabels[project.status]}
          </span>

          <Typography>{project.progress}%</Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={project.progress}
          className={`${styles.projectProgress} ${colorClassName}`}
          aria-label={`${project.title}: ${project.progress}% complete`}
        />
      </Box>

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

        <button type="button" className={styles.openProjectButton} onClick={handleOpen}>
          Open Project
        </button>
      </Box>
    </Paper>
  );
};
