export interface Conversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isRead?: boolean;
  isVoice?: boolean;
}

export interface MessageAttachment {
  id: number;
  image: string;
}

export interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text?: string[];
  isOwn?: boolean;
  attachments?: MessageAttachment[];
}

export interface SharedFile {
  id: number;
  name: string;
  information: string;
  type: "figma" | "sketch" | "xd" | "svg";
}
