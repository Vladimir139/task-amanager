export interface Message {
  id: number;
  name: string;
  message: string;
  avatar: string;
  color: string;
}

export interface MessageItemProps {
  message: Message;
}
