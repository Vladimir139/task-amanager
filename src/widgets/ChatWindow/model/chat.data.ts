import type { ChatMessage } from "@/entities/chatMessage";

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    author: "Killan James",
    avatar: "/images/users/killan.jpg",
    time: "10:12 AM",
    text: ["Hi, Are you still Web Designer.", "Would love to see some Design 😁"],
  },
  {
    id: 2,
    author: "Claudia Maudi",
    avatar: "/images/users/claudia.jpg",
    time: "10:30 AM",
    text: [
      "Hey, happy to hear from you. Yes, I will be back in a couple of days.",
      "Here are some designs I took earlier today.",
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
    text: ["Great 🔥 That’s a nice design idea. 😍👏"],
    isOwn: true,
  },
];
