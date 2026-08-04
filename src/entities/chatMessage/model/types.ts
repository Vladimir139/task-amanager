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

export interface ChatMessageItemProps {
  message: ChatMessage;
}
