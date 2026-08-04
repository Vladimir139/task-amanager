import {
  Add,
  CheckCircleOutlined,
  DashboardOutlined,
  FilterList,
  GridViewOutlined,
  MoreHoriz,
  Search,
  Sort,
  TimelapseOutlined,
  ViewListOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { projects, projectStatistics } from "../model/projects.data";
import type { Project, ProjectStatistic, ProjectStatus } from "../model/projects.types";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectsPage.module.scss";

type ProjectFilter = "all" | ProjectStatus;
type ViewMode = "grid" | "list";

const statisticIcons: Record<ProjectStatistic["type"], typeof DashboardOutlined> = {
  total: DashboardOutlined,
  progress: TimelapseOutlined,
  completed: CheckCircleOutlined,
  overdue: WarningAmberOutlined,
};

const filterItems: Array<{
  value: ProjectFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "All Projects",
  },
  {
    value: "active",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "on-hold",
    label: "On Hold",
  },
];

export const ProjectsPage: FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = status === "all" || project.status === status;

      const matchesSearch =
        !normalizedSearch ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const handleCreateProject = () => {
    console.log("Open create project modal");
  };

  return (
    <Box component="main" className={styles.page}>
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

      <Box className={styles.statistics}>
        {projectStatistics.map((statistic) => {
          const Icon = statisticIcons[statistic.type];

          return (
            <Paper key={statistic.id} className={styles.statisticCard} elevation={0}>
              <Box className={`${styles.statisticIcon} ${styles[`${statistic.type}Statistic`]}`}>
                <Icon />
              </Box>

              <Box className={styles.statisticContent}>
                <Typography>{statistic.title}</Typography>

                <Box>
                  <Typography component="strong">{statistic.value}</Typography>

                  <Typography>{statistic.difference}</Typography>
                </Box>
              </Box>

              <IconButton
                className={styles.statisticMenu}
                aria-label={`Actions for ${statistic.title}`}
              >
                <MoreHoriz />
              </IconButton>
            </Paper>
          );
        })}
      </Box>

      <Paper className={styles.projectsSection} elevation={0}>
        <Box className={styles.projectsToolbar}>
          <Box className={styles.projectsToolbarTitle}>
            <Typography component="h2">All Projects</Typography>

            <span>{filteredProjects.length}</span>
          </Box>

          <Box className={styles.toolbarActions}>
            <TextField
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
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
              }}
            />

            <TextField
              select
              size="small"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as ProjectFilter);
              }}
              className={styles.filterSelect}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {filterItems.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <IconButton className={styles.sortButton} aria-label="Sort projects">
              <Sort />
            </IconButton>

            <Box className={styles.viewSwitcher}>
              <IconButton
                className={viewMode === "grid" ? styles.activeViewButton : ""}
                onClick={() => {
                  setViewMode("grid");
                }}
                aria-label="Grid view"
              >
                <GridViewOutlined />
              </IconButton>

              <IconButton
                className={viewMode === "list" ? styles.activeViewButton : ""}
                onClick={() => {
                  setViewMode("list");
                }}
                aria-label="List view"
              >
                <ViewListOutlined />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {filteredProjects.length > 0 ? (
          <Box
            className={`${styles.projectsGrid} ${viewMode === "list" ? styles.projectsList : ""}`}
          >
            {filteredProjects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
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
    </Box>
  );
};
