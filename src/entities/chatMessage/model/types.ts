export interface MessageAttachment {
  id: string | number;
  information?: string;
  isImage: boolean;
  mimeType?: string;
  name: string;
  previewUrl: string;
}

export interface ChatAudioMessage {
  duration?: string;
  mimeType?: string;
  src: string;
  waveform?: number[];
}

export interface ChatMessage {
  canDelete?: boolean;
  canEdit?: boolean;
  id: string | number;
  author: string;
  avatar: string;
  isUnread?: boolean;
  time: string;
  text?: string[];
  isOwn?: boolean;
  isEdited?: boolean;
  isEditing?: boolean;
  editDraft?: string;
  attachments?: MessageAttachment[];
  audio?: ChatAudioMessage;
  onDelete?: () => void;
  onEditCancel?: () => void;
  onEditChange?: (value: string) => void;
  onEditStart?: () => void;
  onEditSubmit?: () => void;
}

export interface ChatMessageItemProps {
  message: ChatMessage;
}
