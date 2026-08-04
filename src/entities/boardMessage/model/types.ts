import type { BoardMember } from "@/entities/boardMember";

export interface BoardAudioMessage {
  duration: string;
  waveform: {
    id: string;
    height: number;
  }[];
}

export interface BoardMessage {
  id: number;
  author: string;
  avatar: BoardMember;
  text?: string;
  time: string;
  isOwn?: boolean;
  audio?: BoardAudioMessage;
}

export interface BoardMessageItemProps {
  message: BoardMessage;
}
