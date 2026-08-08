export const apiTags = [
  "Activity",
  "Board",
  "ConversationFiles",
  "ConversationMessages",
  "Conversations",
  "CurrentUser",
  "Dashboard",
  "Files",
  "Folders",
  "ProjectStats",
  "Projects",
  "Storage",
  "Tasks",
  "Users",
] as const;

export type ApiTag = (typeof apiTags)[number];
