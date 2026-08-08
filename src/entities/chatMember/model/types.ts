export interface ChatMember {
  id: string | number;
  name: string;
  avatar: string;
}

export interface ChatMemberItemProps {
  member: ChatMember;
}
