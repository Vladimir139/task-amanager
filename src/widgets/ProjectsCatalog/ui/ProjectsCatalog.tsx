import { FilterList, GridViewOutlined, Search, Sort, ViewListOutlined } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";

import type { Project } from "@/entities/project";
import { ProjectCard, useGetProjectsQuery } from "@/entities/project";
import { useGetUsersQuery } from "@/entities/user";
import { formatDateLabel, getInitials } from "@/shared/lib/formatters";

import { projectFilterItems } from "../model/constants";
import type { ProjectFilter, ProjectSort, ViewMode } from "../model/types";
import styles from "./ProjectsCatalog.module.scss";

const mapProjectStatus = (status: string): Project["status"] => {
  if (status === "completed") {
    return "completed";
  }

  if (status === "on-hold" || status === "archived") {
    return "on-hold";
  }

  return "active";
};

const mapProjectColor = (color: string): Project["color"] => {
  if (["purple", "blue", "orange", "green", "red"].includes(color)) {
    return color as Project["color"];
  }

  return "blue";
};

export const ProjectsCatalog: FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<ProjectSort>("default");

  const { data, isError, isLoading } = useGetProjectsQuery({
    limit: 24,
    page: 1,
    search,
    sort: sort === "default" ? undefined : sort,
    status: status === "all" ? undefined : status,
  });
  const { data: users } = useGetUsersQuery();

  const projects = useMemo(() => {
    const userMap = new Map((users ?? []).map((user) => [user._id, user]));

    return (data?.items ?? []).map((project) => {
      const owner = userMap.get(project.ownerId);
      const members = Array.from({ length: Math.min(project.memberCount, 4) }, (_, index) => {
        if (owner && index === 0) {
          return {
            id: owner._id,
            initials: getInitials(owner.firstName, owner.lastName),
            name: `${owner.firstName} ${owner.lastName}`.trim(),
          };
        }

        return {
          id: `${project._id}-member-${index}`,
          initials: `M${index + 1}`,
          name: `Member ${index + 1}`,
        };
      });

      return {
        color: mapProjectColor(project.color),
        description: project.description || "No description yet",
        dueDate: formatDateLabel(project.dueDate),
        id: project._id,
        members,
        progress: project.progressPercent,
        status: mapProjectStatus(project.status),
        tasksCompleted: project.completedTaskCount,
        tasksTotal: Math.max(project.taskCount, project.completedTaskCount, 1),
        title: project.title,
      } satisfies Project;
    });
  }, [data?.items, users]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as ProjectFilter);
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value as ProjectSort);
  };

  const handleOpenProject = (project: Project) => {
    console.log("Open project:", project.id);
  };

  return (
    <Paper className={styles.projectsSection} elevation={0}>
      <Box className={styles.projectsToolbar}>
        <Box className={styles.projectsToolbarTitle}>
          <Typography component="h2">All Projects</Typography>

          <span>{projects.length}</span>
        </Box>

        <Box className={styles.toolbarActions}>
          <TextField
            value={search}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            size="small"
            className={styles.searchField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
              htmlInput: {
                "aria-label": "Search projects",
              },
            }}
          />

          <TextField
            select
            size="small"
            value={status}
            onChange={handleStatusChange}
            className={styles.filterSelect}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
              },
              htmlInput: {
                "aria-label": "Filter projects by status",
              },
            }}
          >
            {projectFilterItems.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            value={sort}
            onChange={handleSortChange}
            className={styles.sortSelect}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Sort />
                  </InputAdornment>
                ),
              },
              htmlInput: {
                "aria-label": "Sort projects",
              },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="progress-desc">Progress: high to low</MenuItem>
            <MenuItem value="progress-asc">Progress: low to high</MenuItem>
            <MenuItem value="due-date">Due date</MenuItem>
          </TextField>

          <Box className={styles.viewSwitcher}>
            <IconButton
              className={viewMode === "grid" ? styles.activeViewButton : undefined}
              onClick={() => {
                setViewMode("grid");
              }}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <GridViewOutlined />
            </IconButton>

            <IconButton
              className={viewMode === "list" ? styles.activeViewButton : undefined}
              onClick={() => {
                setViewMode("list");
              }}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <ViewListOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {isError && <Typography>Unable to load projects.</Typography>}
      {isLoading && <Typography>Loading projects...</Typography>}

      {projects.length > 0 ? (
        <Box className={viewMode === "grid" ? styles.projectsGrid : styles.projectsList}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onOpen={handleOpenProject}
            />
          ))}
        </Box>
      ) : (
        <Box className={styles.emptyState}>
          <Search />

          <Typography component="h3">Projects not found</Typography>

          <Typography>Try changing the search query or selected filter.</Typography>
        </Box>
      )}
    </Paper>
  );
};
