import type { BoardMember } from "@/entities/boardMember";

export interface BoardAudioMessage {
  duration: string;
  waveform: {
    id: string;
    height: number;
  }[];
}

export interface BoardMessage {
  canDelete?: boolean;
  canEdit?: boolean;
  id: string | number;
  author: string;
  avatar: BoardMember;
  editDraft?: string;
  isEdited?: boolean;
  isEditing?: boolean;
  time: string;
  isOwn?: boolean;
  isRead?: boolean;
  onDelete?: () => void;
  onEditCancel?: () => void;
  onEditChange?: (value: string) => void;
  onEditStart?: () => void;
  onEditSubmit?: () => void;
  onToggleRead?: () => void;
  readActionLabel?: string;
  sequence?: number;
  text?: string;
  audio?: BoardAudioMessage;
}

export interface BoardMessageItemProps {
  message: BoardMessage;
}
