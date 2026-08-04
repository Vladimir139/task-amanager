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

import styles from "./SidebarNavigation.module.scss";

const navigationItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    icon: DashboardOutlined,
  },
  {
    id: "projects",
    path: "/projects",
    icon: FolderCopyOutlined,
  },
  {
    id: "tasks",
    path: "/tasks",
    icon: MenuBookOutlined,
  },
  {
    id: "settings",
    path: "/settings",
    icon: SettingsOutlined,
  },
  {
    id: "messages",
    path: "/messages",
    icon: SendOutlined,
  },
  {
    id: "files",
    path: "/files",
    icon: FolderOutlined,
  },
];

export const SidebarNavigation: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/dashboard">
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
