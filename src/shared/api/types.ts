export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface AuthPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  sessionId?: string;
}

export interface AuthResponse {
  user: AuthPayload;
  accessToken: string;
  refreshToken: string;
}

export interface NotificationSettingsRecord {
  emailEnabled: boolean;
  pushEnabled: boolean;
  messageSoundEnabled: boolean;
  marketingEnabled: boolean;
  taskAssignedEnabled: boolean;
  messageReceivedEnabled: boolean;
}

export interface UserRecord {
  _id: string;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  roleTitle: string;
  avatarFileId?: string | null;
  avatarUrl?: string | null;
  accountStatus?: string;
  presenceStatus?: string;
  lastSeenAt?: string | null;
  lastActiveAt?: string | null;
  timezone?: string | null;
  locale?: string | null;
  notificationSettings?: NotificationSettingsRecord;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummaryResponse {
  taskCompleted: number;
  newTask: number;
  projectDone: number;
}

export interface DashboardTaskAnalyticsItem {
  _id: {
    label: string;
    workflowState: string;
  };
  count: number;
}

export interface TaskRecord {
  _id: string;
  projectId: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  shortCode?: string | null;
  priority: string;
  workflowState: string;
  category: string;
  position: number;
  reporterId: string;
  assigneeIds: string[];
  watcherIds: string[];
  coverFileId?: string | null;
  emoji?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  completedAt?: string | null;
  commentCount: number;
  attachmentCount: number;
  checklistTotal: number;
  checklistCompleted: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageAudioRecord {
  fileId?: string | null;
  durationMs?: number | null;
  waveform?: number[];
  mimeType?: string | null;
  transcript?: string | null;
}

export interface MessageRecord {
  _id: string;
  conversationId: string;
  authorId: string;
  sequence: number;
  kind: string;
  text?: string | null;
  replyToMessageId?: string | null;
  fileIds: string[];
  audio?: MessageAudioRecord | null;
  isEdited?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRecord {
  _id: string;
  title: string;
  description: string;
  status: string;
  color: string;
  ownerId: string;
  defaultBoardId?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
  progressPercent: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMemberRecord {
  _id: string;
  projectId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt?: string;
  invitedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectListResponse {
  items: ProjectRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectStatsResponse {
  total: number;
  progress: number;
  completed: number;
  overdue: number;
}

export interface BoardRecord {
  _id: string;
  projectId: string;
  title: string;
  emoji?: string | null;
  description?: string | null;
  isDefault?: boolean;
  createdBy?: string;
  memberIds?: string[];
  columnCount?: number;
  taskCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardColumnRecord {
  _id: string;
  boardId: string;
  systemKey?: string | null;
  title: string;
  color?: string | null;
  position: number;
  kind: "custom" | "system";
  isLocked?: boolean;
  taskLimit?: number | null;
  createdBy?: string;
  archivedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationRecord {
  _id: string;
  type: string;
  title?: string | null;
  avatarUrl?: string | null;
  createdBy: string;
  boardId?: string | null;
  projectId?: string | null;
  memberCount: number;
  messageCount: number;
  lastMessageId?: string | null;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  lastSequence: number;
  preview?: string | null;
  unreadCount?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  typingUserIds?: string[];
  members?: UserRecord[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationDetailsResponse {
  conversation: ConversationRecord;
  members: Array<{
    _id: string;
    conversationId: string;
    userId: string;
    role: string;
    lastReadSequence: number;
  }>;
  users: UserRecord[];
}

export interface BoardViewResponse {
  project: {
    id: string;
  };
  board: BoardRecord;
  columns: BoardColumnRecord[];
  tasksByColumn: Record<string, TaskRecord[]>;
  members: Array<UserRecord & { memberRole?: string; isOnline?: boolean }>;
  chatPreview: {
    conversationId: string;
    memberCount: number;
    messages: MessageRecord[];
  } | null;
}

export interface FolderRecord {
  _id: string;
  ownerId: string;
  projectId?: string | null;
  parentId?: string | null;
  name: string;
  color: string;
  memberIds?: string[];
  fileCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileRecord {
  _id: string;
  ownerId: string;
  uploadedBy: string;
  projectId?: string | null;
  folderId?: string | null;
  conversationId?: string | null;
  messageId?: string | null;
  originalName: string;
  storageKey: string;
  bucket: string;
  mimeType: string;
  extension?: string | null;
  size: number;
  kind: string;
  previewUrl?: string | null;
  downloadUrl?: string | null;
  durationMs?: number | null;
  waveform?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StorageSummaryRecord {
  _id: string;
  totalSize: number;
  totalCount: number;
}

export interface ActivityRecord {
  _id: {
    day: string;
    kind: string;
  };
  value: number;
}
