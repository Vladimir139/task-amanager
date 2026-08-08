export interface ChatMember {
  canRemove?: boolean;
  id: string | number;
  name: string;
  avatar: string;
  isOnline?: boolean;
  isCurrentUser?: boolean;
  onRemove?: () => void;
  role?: string;
  subtitle?: string;
}

export interface ChatMemberItemProps {
  member: ChatMember;
}
