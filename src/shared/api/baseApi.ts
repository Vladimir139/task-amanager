import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: "api",
  tagTypes: [
    "CurrentUser",
    "Users",
    "Dashboard",
    "Projects",
    "ProjectStats",
    "Board",
    "Conversations",
    "ConversationMessages",
    "ConversationFiles",
    "Folders",
    "Files",
    "Storage",
    "Activity",
    "Tasks",
  ],
});
