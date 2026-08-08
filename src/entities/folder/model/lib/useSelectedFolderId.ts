import { useSearchParams } from "react-router-dom";

export const useSelectedFolderId = (): string | null => {
  const [searchParams] = useSearchParams();

  return searchParams.get("folderId");
};
