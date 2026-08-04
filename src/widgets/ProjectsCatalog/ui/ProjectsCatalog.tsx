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
import { ProjectCard } from "@/entities/project";

import { projectFilterItems } from "../model/constants";
import { projects } from "../model/projects.data";
import type { ProjectFilter, ProjectSort, ViewMode } from "../model/types";
import styles from "./ProjectsCatalog.module.scss";

const sortProjects = (projectItems: Project[], sort: ProjectSort): Project[] => {
  const sortedProjects = [...projectItems];

  switch (sort) {
    case "title":
      return sortedProjects.sort((firstProject, secondProject) =>
        firstProject.title.localeCompare(secondProject.title),
      );

    case "progress-asc":
      return sortedProjects.sort(
        (firstProject, secondProject) => firstProject.progress - secondProject.progress,
      );

    case "progress-desc":
      return sortedProjects.sort(
        (firstProject, secondProject) => secondProject.progress - firstProject.progress,
      );

    case "due-date":
      return sortedProjects.sort(
        (firstProject, secondProject) =>
          new Date(firstProject.dueDate).getTime() - new Date(secondProject.dueDate).getTime(),
      );

    case "default":
      return sortedProjects;
  }
};

export const ProjectsCatalog: FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectFilter>("all");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [sort, setSort] = useState<ProjectSort>("default");

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchingProjects = projects.filter((project) => {
      const matchesStatus = status === "all" || project.status === status;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });

    return sortProjects(matchingProjects, sort);
  }, [search, sort, status]);

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

          <span>{filteredProjects.length}</span>
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

      {filteredProjects.length > 0 ? (
        <Box className={viewMode === "grid" ? styles.projectsGrid : styles.projectsList}>
          {filteredProjects.map((project) => (
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
