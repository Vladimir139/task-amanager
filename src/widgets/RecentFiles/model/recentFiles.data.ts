import type { RecentFile } from "@/entities/file";

export const recentFiles: RecentFile[] = [
  {
    id: 1,
    name: "Proposal.docx",
    size: "2.9 MB",
    lastModified: "Feb 25, 2022",
    type: "document",
    members: ["KJ", "CM", "AM", "NW", "AD"],
  },
  {
    id: 2,
    name: "Background.jpg",
    size: "3.5 MB",
    lastModified: "Feb 24, 2022",
    type: "image",
    members: ["KJ", "CM", "AM"],
  },
  {
    id: 3,
    name: "Apex website.fig",
    size: "23.5 MB",
    lastModified: "Feb 22, 2022",
    type: "figma",
    members: ["KJ", "CM", "AM", "NW", "AD"],
  },
  {
    id: 4,
    name: "Illustration.ai",
    size: "7.2 MB",
    lastModified: "Feb 20, 2022",
    type: "illustrator",
    members: ["AM", "NW", "AD"],
  },
];
