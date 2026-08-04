import type { ChatMember } from "@/entities/chatMember";
import type { SharedFile } from "@/entities/sharedFile";

export const sharedFiles: SharedFile[] = [
  {
    id: 1,
    name: "Very important file.figma",
    information: "7.5 MB · 3.22.22, 11:15 AM",
    type: "figma",
  },
  {
    id: 2,
    name: "Some file.sketch",
    information: "7.5 MB · 3.22.22, 11:15 AM",
    type: "sketch",
  },
  {
    id: 3,
    name: "List of something.xd",
    information: "7.5 MB · 3.22.22, 11:15 AM",
    type: "xd",
  },
  {
    id: 4,
    name: "Very important file.svg",
    information: "7.5 MB · 3.22.22, 11:15 AM",
    type: "svg",
  },
];

export const chatMembers: ChatMember[] = [
  {
    id: 1,
    name: "Novita",
    avatar: "/images/users/novita.jpg",
  },
  {
    id: 2,
    name: "Milie Nose",
    avatar: "/images/users/milie.jpg",
  },
  {
    id: 3,
    name: "Ikhsan SD",
    avatar: "/images/users/ikhsan.jpg",
  },
  {
    id: 4,
    name: "Aditya",
    avatar: "/images/users/aditya.jpg",
  },
];
