export const ROUTES = {
  appRoute: "/",
  auth: {
    route: "/auth",
    login: {
      route: "login",
      page: "/auth/login",
    },
    register: {
      route: "register",
      page: "/auth/register",
    },
  },
  dashboard: {
    route: "dashboard",
    page: "/dashboard",
  },
  projects: {
    route: "projects",
    page: "/projects",
  },
  tasks: {
    route: "tasks",
    page: "/tasks",
  },
  messages: {
    route: "messages",
    page: "/messages",
  },
  files: {
    route: "files",
    page: "/files",
  },
  settings: {
    route: "settings",
    page: "/settings",
  },
} as const;
