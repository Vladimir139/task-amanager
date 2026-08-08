import {
  DashboardOutlined,
  FolderCopyOutlined,
  FolderOutlined,
  MenuBookOutlined,
  SendOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { type FC } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/router";

import styles from "./SidebarNavigation.module.scss";

const navigationItems = [
  {
    id: "dashboard",
    path: ROUTES.dashboard.page,
    icon: DashboardOutlined,
  },
  {
    id: "projects",
    path: ROUTES.projects.page,
    icon: FolderCopyOutlined,
  },
  {
    id: "tasks",
    path: ROUTES.tasks.page,
    icon: MenuBookOutlined,
  },
  {
    id: "settings",
    path: ROUTES.settings.page,
    icon: SettingsOutlined,
  },
  {
    id: "messages",
    path: ROUTES.messages.page,
    icon: SendOutlined,
  },
  {
    id: "files",
    path: ROUTES.files.page,
    icon: FolderOutlined,
  },
];

export const SidebarNavigation: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar}>
      <NavLink to={ROUTES.dashboard.page}>
        <img src="/images/octom-logo.png" alt="octom logo" className={styles.logo} />
      </NavLink>

      <Box component="nav" className={styles.navigation}>
        {navigationItems.map(({ id, icon: Icon, path }) => {
          const isActive = pathname === path;

          return (
            <IconButton
              key={id}
              className={`${styles.navigationButton} ${
                isActive ? styles.activeNavigationButton : ""
              }`}
              onClick={async () => navigate(path)}
              aria-label={id}
            >
              <Icon />
            </IconButton>
          );
        })}
      </Box>
    </aside>
  );
};
