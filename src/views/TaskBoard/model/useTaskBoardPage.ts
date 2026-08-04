import { useState } from "react";

import {
  boardColumns,
  boardMembers,
  boardMessages,
  taskBoardEmoji,
  taskBoardExtraMembersCount,
  taskBoardMembersCount,
  taskBoardTitle,
} from "./taskBoard.data.ts";

interface UseTaskBoardPageResult {
  boardColumns: typeof boardColumns;
  boardMembers: typeof boardMembers;
  boardMessages: typeof boardMessages;
  message: string;
  setMessage: (value: string) => void;
  taskBoardEmoji: string;
  taskBoardExtraMembersCount: number;
  taskBoardMembersCount: number;
  taskBoardTitle: string;
}

export const useTaskBoardPage = (): UseTaskBoardPageResult => {
  const [message, setMessage] = useState("");

  return {
    boardColumns,
    boardMembers,
    boardMessages,
    message,
    setMessage,
    taskBoardEmoji,
    taskBoardExtraMembersCount,
    taskBoardMembersCount,
    taskBoardTitle,
  };
};
