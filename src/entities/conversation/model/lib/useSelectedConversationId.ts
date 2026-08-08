import { useSearchParams } from "react-router-dom";

export const useSelectedConversationId = (): string | null => {
  const [searchParams] = useSearchParams();

  return searchParams.get("conversationId");
};
