export interface Message {
  id: string | number;
  name: string;
  message: string;
  avatar: string;
  color: string;
}

export interface MessageItemProps {
  message: Message;
}
