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
import type { FC } from "react";

import { ProjectCard } from "@/entities/project";

import { projectFilterItems } from "../model/constants";
import { useProjectsCatalog } from "../model/useProjectsCatalog";
import styles from "./ProjectsCatalog.module.scss";

export const ProjectsCatalog: FC = () => {
  const {
    handleOpenProject,
    handleSearchChange,
    handleSortChange,
    handleStatusChange,
    isError,
    isLoading,
    projects,
    search,
    setViewMode,
    sort,
    status,
    viewMode,
  } = useProjectsCatalog();

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
