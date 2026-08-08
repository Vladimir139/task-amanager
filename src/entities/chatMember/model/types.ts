export interface ChatMember {
  id: string | number;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface ChatMemberItemProps {
  member: ChatMember;
}
