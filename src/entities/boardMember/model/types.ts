export interface BoardMember {
  id: string | number;
  initials: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface BoardMemberAvatarProps {
  member: BoardMember;
  size?: "small" | "medium";
  showStatus?: boolean;
  className?: string;
}
