import { useSearchParams } from "react-router-dom";

export const useSelectedProjectId = (): string | null => {
  const [searchParams] = useSearchParams();

  return searchParams.get("projectId");
};
