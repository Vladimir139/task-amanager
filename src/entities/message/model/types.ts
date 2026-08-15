export interface Message {
  id: string | number;
  name: string;
  message: string;
  avatar: string;
  color: string;
  onOpen?: () => void;
  unreadCount?: number;
}

export interface MessageItemProps {
  message: Message;
}
