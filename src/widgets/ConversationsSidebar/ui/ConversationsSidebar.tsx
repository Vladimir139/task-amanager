import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";

import type { Conversation } from "@/entities/conversation";
import { ConversationItem } from "@/entities/conversation";

import styles from "./ConversationsSidebar.module.scss";

interface ConversationsSidebarProps {
  activeConversationId: string | null;
  conversations: Conversation[];
  isError?: boolean;
  isLoading?: boolean;
  onConversationSelect: (conversationId: string) => void;
}

export const ConversationsSidebar: FC<ConversationsSidebarProps> = ({
  activeConversationId,
  conversations,
  isError = false,
  isLoading = false,
  onConversationSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(normalizedSearch) ||
        conversation.preview.toLowerCase().includes(normalizedSearch),
    );
  }, [conversations, search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleConversationClick = (conversation: Conversation) => {
    onConversationSelect(String(conversation.id));
  };

  return (
    <aside className={styles.conversationsSidebar}>
      <Typography component="h1">Messages</Typography>

      <TextField
        fullWidth
        value={search}
        onChange={handleSearchChange}
        placeholder="Search..."
        className={styles.searchField}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
          htmlInput: {
            "aria-label": "Search conversations",
          },
        }}
      />

      {isLoading && <Typography>Loading conversations...</Typography>}
      {isError && !isLoading && <Typography>Unable to refresh conversations.</Typography>}
      {!isLoading && !isError && filteredConversations.length === 0 && (
        <Typography>
          {conversations.length === 0
            ? "No conversations yet."
            : "No conversations match your search."}
        </Typography>
      )}

      <Box className={styles.conversationList}>
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversationId === String(conversation.id)}
            onClick={handleConversationClick}
          />
        ))}
      </Box>
    </aside>
  );
};
