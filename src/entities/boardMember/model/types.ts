export interface BoardMember {
  id: string | number;
  initials: string;
  avatarUrl?: string;
  isOnline?: boolean;
  name?: string;
  role?: string;
}

export interface BoardMemberAvatarProps {
  member: BoardMember;
  size?: "small" | "medium";
  showStatus?: boolean;
  className?: string;
}
