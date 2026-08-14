import { CalendarMonthOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, LinearProgress, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { Project, ProjectCardProps } from "../model/types";
import styles from "./ProjectCard.module.scss";

const statusLabels: Record<Project["status"], string> = {
  active: "In Progress",
  archived: "Archived",
  completed: "Completed",
  "on-hold": "On Hold",
};

const statusClassNames: Record<Project["status"], string> = {
  active: styles.activeStatus,
  archived: styles.archivedStatus,
  completed: styles.completedStatus,
  "on-hold": styles.onHoldStatus,
};

const colorClassNames: Record<Project["color"], string> = {
  purple: styles.purple,
  blue: styles.blue,
  orange: styles.orange,
  green: styles.green,
  red: styles.red,
  gray: styles.gray,
};

export const ProjectCard: FC<ProjectCardProps> = ({
  isSelected = false,
  onManage,
  project,
  viewMode = "grid",
  onOpen,
}) => {
  const colorClassName = colorClassNames[project.color];
  const statusClassName = statusClassNames[project.status];
  const progress =
    project.tasksTotal > 0 ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) : 0;
  const extraMembersCount = Math.max(project.memberCount - 4, 0);

  const handleOpen = () => {
    onOpen?.(project);
  };

  const handleManage = () => {
    onManage?.(project);
  };

  return (
    <Paper
      className={`${styles.projectCard} ${viewMode === "list" ? styles.listProjectCard : ""} ${
        isSelected ? styles.selectedProjectCard : ""
      }`}
      elevation={0}
    >
      <Box className={styles.projectCardHeader}>
        <Box className={`${styles.projectIcon} ${colorClassName}`} aria-hidden="true">
          {project.title.slice(0, 1)}
        </Box>
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

          <Typography>
            {project.tasksCompleted}/{project.tasksTotal} tasks
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          className={`${styles.projectProgress} ${colorClassName}`}
          aria-label={`${project.title}: ${project.tasksCompleted} of ${project.tasksTotal} tasks complete`}
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
        <Box className={styles.projectMembersGroup}>
          <AvatarGroup className={styles.projectMembers}>
            {project.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} alt={member.name}>
                {member.initials}
              </Avatar>
            ))}
          </AvatarGroup>

          {extraMembersCount > 0 && (
            <span className={styles.additionalMember}>+{extraMembersCount}</span>
          )}
        </Box>

        <Box className={styles.projectActions}>
          <button type="button" className={styles.manageProjectButton} onClick={handleManage}>
            Manage
          </button>

          <button type="button" className={styles.openProjectButton} onClick={handleOpen}>
            Open board
          </button>
        </Box>
      </Box>
    </Paper>
  );
};
