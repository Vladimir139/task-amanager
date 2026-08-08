export interface MessageAttachment {
  id: string | number;
  image: string;
}

export interface ChatMessage {
  id: string | number;
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
