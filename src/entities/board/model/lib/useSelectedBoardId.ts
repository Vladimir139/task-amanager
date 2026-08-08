import { useSearchParams } from "react-router-dom";

export const useSelectedBoardId = (): string | null => {
  const [searchParams] = useSearchParams();

  return searchParams.get("boardId");
};
