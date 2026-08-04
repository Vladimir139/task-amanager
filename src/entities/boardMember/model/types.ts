export interface BoardMember {
  id: number;
  initials: string;
  isOnline?: boolean;
}

export interface BoardMemberAvatarProps {
  member: BoardMember;
  size?: "small" | "medium";
  showStatus?: boolean;
  className?: string;
}
