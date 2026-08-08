export interface Conversation {
  id: string | number;
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

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (conversation: Conversation) => void;
}
