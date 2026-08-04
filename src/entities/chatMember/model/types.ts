export interface ChatMember {
  id: number;
  name: string;
  avatar: string;
}

export interface ChatMemberItemProps {
  member: ChatMember;
}
