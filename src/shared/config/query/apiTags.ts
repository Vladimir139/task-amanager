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
  "ProjectInvitations",
  "ProjectMembers",
  "ProjectStats",
  "Projects",
  "Storage",
  "Tasks",
  "Users",
] as const;

export type ApiTag = (typeof apiTags)[number];
