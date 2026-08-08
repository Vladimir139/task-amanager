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

export const getTasksRoute = (projectId?: string, boardId?: string, taskId?: string): string => {
  if (!projectId && !boardId && !taskId) {
    return ROUTES.tasks.page;
  }

  const params = new URLSearchParams();

  if (projectId) {
    params.set("projectId", projectId);
  }

  if (boardId) {
    params.set("boardId", boardId);
  }

  if (taskId) {
    params.set("taskId", taskId);
  }

  return `${ROUTES.tasks.page}?${params.toString()}`;
};

export const getProjectsRoute = (projectId?: string): string => {
  if (!projectId) {
    return ROUTES.projects.page;
  }

  return `${ROUTES.projects.page}?projectId=${encodeURIComponent(projectId)}`;
};

export const getMessagesRoute = (conversationId?: string): string => {
  if (!conversationId) {
    return ROUTES.messages.page;
  }

  const params = new URLSearchParams();
  params.set("conversationId", conversationId);

  return `${ROUTES.messages.page}?${params.toString()}`;
};

export const getFilesRoute = (projectId?: string, folderId?: string): string => {
  if (!projectId && !folderId) {
    return ROUTES.files.page;
  }

  const params = new URLSearchParams();

  if (projectId) {
    params.set("projectId", projectId);
  }

  if (folderId) {
    params.set("folderId", folderId);
  }

  return `${ROUTES.files.page}?${params.toString()}`;
};
