import { useSearchParams } from "react-router-dom";

export const useSelectedTaskId = (): string | null => {
  const [searchParams] = useSearchParams();

  return searchParams.get("taskId");
};
