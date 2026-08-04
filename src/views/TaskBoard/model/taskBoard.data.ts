import type { BoardMessage } from "@/entities/boardMessage";
import type { BoardColumn } from "@/entities/boardTask";

const commonDescription = "Create content for peceland App";

const angela = {
  id: 1,
  initials: "AN",
  isOnline: true,
};

const chris = {
  id: 2,
  initials: "CH",
  isOnline: true,
};

const jason = {
  id: 3,
  initials: "JM",
  isOnline: true,
};

const amanda = {
  id: 4,
  initials: "AM",
  isOnline: true,
};

const ricky = {
  id: 5,
  initials: "RK",
  isOnline: true,
};

const dina = {
  id: 6,
  initials: "DS",
  isOnline: true,
};

const maria = {
  id: 7,
  initials: "MK",
  isOnline: true,
};

const viktor = {
  id: 8,
  initials: "VL",
  isOnline: true,
};

const aria = {
  id: 9,
  initials: "AR",
  isOnline: true,
};

const kim = {
  id: 10,
  initials: "KS",
  isOnline: true,
};

export const boardMembers = [angela, chris, jason, amanda, ricky, dina, maria, viktor, aria, kim];
export const taskBoardTitle = "Task - Artyfact";
export const taskBoardEmoji = "🔥";
export const taskBoardExtraMembersCount = 6;
export const taskBoardMembersCount = 25;

const taskBoardWaveform = [
  10, 20, 16, 27, 19, 31, 24, 15, 27, 20, 12, 18, 26, 11, 20, 14, 9, 18,
].map((height, index) => ({
  id: `wave-${index + 1}`,
  height,
}));

export const boardColumns: BoardColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      {
        id: 1,
        title: "Create styleguide foundation",
        description: commonDescription,
        category: "Design",
        date: "Aug 20, 2021",
        image: "/images/tasks/task-blue.jpg",
        completed: 0,
        total: 8,
        members: [angela, chris, jason],
      },
      {
        id: 2,
        title: "Copywriting Content",
        description: commonDescription,
        category: "Research",
        date: "Aug 20, 2021",
        completed: 0,
        total: 8,
        members: [angela, chris],
      },
      {
        id: 3,
        title: "Update requiment list",
        description: commonDescription,
        category: "Planning",
        date: "Sep 20, 2021",
        comments: 4,
        files: 11,
        members: [],
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 4,
        title: "auditing information architecture",
        description: commonDescription,
        category: "Research",
        date: "Aug 20, 2021",
        comments: 4,
        files: 11,
        members: [],
      },
      {
        id: 5,
        title: "Update support documentation",
        description: commonDescription,
        category: "Content",
        date: "Aug 16, 2021",
        image: "/images/tasks/task-colorful.jpg",
        completed: 0,
        total: 8,
        members: [angela, chris, jason],
      },
      {
        id: 6,
        title: "Qualitative research planning",
        description: commonDescription,
        category: "Research",
        date: "Aug 20, 2021",
        completed: 0,
        total: 8,
        members: [angela, chris],
      },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    tasks: [
      {
        id: 7,
        title: "Listing deliverables checklist",
        description: commonDescription,
        category: "Planning",
        date: "Sep 20, 2021",
        comments: 4,
        files: 11,
        members: [],
      },
      {
        id: 8,
        title: "Qualitative research planning",
        description: commonDescription,
        category: "Research",
        date: "Aug 20, 2021",
        completed: 0,
        total: 8,
        members: [angela, chris],
      },
      {
        id: 9,
        title: "Copywriting Content",
        description: commonDescription,
        category: "Design",
        date: "Aug 20, 2021",
        image: "/images/tasks/task-orange.jpg",
        completed: 0,
        total: 8,
        members: [angela, chris, jason],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: 10,
        title: "Design System",
        description: commonDescription,
        category: "Content",
        date: "Aug 16, 2021",
        image: "/images/tasks/task-waves.jpg",
        completed: 0,
        total: 8,
        members: [angela, chris],
      },
      {
        id: 11,
        title: "High fedality UI Desktop",
        description: commonDescription,
        category: "Design",
        date: "Aug 20, 2021",
        completed: 0,
        total: 8,
        members: [angela, chris],
      },
      {
        id: 12,
        title: "Listing deliverables checklist",
        description: commonDescription,
        category: "Content",
        date: "Sep 20, 2021",
        comments: 4,
        files: 11,
        members: [],
      },
    ],
  },
];

export const boardMessages: BoardMessage[] = [
  {
    id: 1,
    author: "Chris",
    avatar: chris,
    text: "Hello! 👋",
    time: "08:00 am",
  },
  {
    id: 2,
    author: "Me",
    avatar: angela,
    text: "Hi, Everyone 👋",
    time: "08:01 am",
    isOwn: true,
  },
  {
    id: 3,
    author: "Jason",
    avatar: jason,
    text: "How are you, What did you do everyone",
    time: "08:03 am",
  },
  {
    id: 4,
    author: "Chris",
    avatar: chris,
    text: "Good ✌",
    time: "08:05 am",
  },
  {
    id: 5,
    author: "Jason",
    avatar: jason,
    time: "08:08 am",
    audio: {
      duration: "1:25",
      waveform: taskBoardWaveform,
    },
  },
];
