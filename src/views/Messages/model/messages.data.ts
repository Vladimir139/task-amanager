import type { ChatMessage, Conversation, SharedFile } from "./messages.types.ts";

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Killan James",
    preview: "Typing...",
    time: "4:30 PM",
    avatar: "/images/users/killan.jpg",
    unread: 2,
    isOnline: true,
    isTyping: true,
  },
  {
    id: 2,
    name: "Design Team",
    preview: "Hello! Everyone",
    time: "9:36 AM",
    avatar: "/images/users/design-team.jpg",
    isRead: true,
  },
  {
    id: 3,
    name: "Ahmed Medi",
    preview: "Wow really Cool 🔥",
    time: "1:15 AM",
    avatar: "/images/users/ahmed.jpg",
  },
  {
    id: 4,
    name: "Claudia Maudi",
    preview: "Typing...",
    time: "4:30 PM",
    avatar: "/images/users/claudia.jpg",
    isTyping: true,
  },
  {
    id: 5,
    name: "Novita",
    preview: "yah, nice design",
    time: "4:30 PM",
    avatar: "/images/users/novita.jpg",
    unread: 2,
    isOnline: true,
  },
  {
    id: 6,
    name: "Milie Nose",
    preview: "Awesome 🔥",
    time: "8:20 PM",
    avatar: "/images/users/milie.jpg",
    unread: 1,
    isOnline: true,
  },
  {
    id: 7,
    name: "Ikhsan SD",
    preview: "Voice message",
    time: "yesterday",
    avatar: "/images/users/ikhsan.jpg",
    isVoice: true,
  },
  {
    id: 8,
    name: "Aditya",
    preview: "publish now",
    time: "yesterday",
    avatar: "/images/users/aditya.jpg",
    isRead: true,
    isOnline: true,
  },
  {
    id: 9,
    name: "Ahmed Medi",
    preview: "Wow really Cool 🔥",
    time: "1:15 AM",
    avatar: "/images/users/ahmed.jpg",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    author: "Killan James",
    avatar: "/images/users/killan.jpg",
    time: "10:12 AM",
    text: ["Hi, Are you still Web Designer.", "would love to see some Design 😁"],
  },
  {
    id: 2,
    author: "Claudia Maudi",
    avatar: "/images/users/claudia.jpg",
    time: "10:30 AM",
    text: [
      "Hey, happy to hear from you. Yes, I will be back in a couple for days.",
      "Here are some Design i took earlier today.",
    ],
    attachments: [
      {
        id: 1,
        image: "/images/messages/design-preview-1.jpg",
      },
      {
        id: 2,
        image: "/images/messages/design-preview-2.jpg",
      },
    ],
  },
  {
    id: 3,
    author: "Dristin Watson",
    avatar: "/images/users/dristin.jpg",
    time: "10:30 AM",
    text: ["Great 🔥 That’s a nice design Idea. 😍👏"],
    isOwn: true,
  },
];

export const sharedFiles: SharedFile[] = [
  {
    id: 1,
    name: "Very important file.figma",
    information: "7.5 MB 3.22.22, 11:15 AM",
    type: "figma",
  },
  {
    id: 2,
    name: "Some file. scratch",
    information: "7.5 MB 3.22.22, 11:15 AM",
    type: "sketch",
  },
  {
    id: 3,
    name: "List of someting. xd",
    information: "7.5 MB 3.22.22, 11:15 AM",
    type: "xd",
  },
  {
    id: 4,
    name: "Very important fil.svg",
    information: "7.5 MB 3.22.22, 11:15 AM",
    type: "svg",
  },
];

export const chatMembers = [
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
