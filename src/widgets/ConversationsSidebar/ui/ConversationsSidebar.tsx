import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";

import type { Conversation } from "@/entities/conversation";
import { ConversationItem } from "@/entities/conversation";

import { conversations } from "../model/conversations.data";
import styles from "./ConversationsSidebar.module.scss";

interface ConversationsSidebarProps {
  activeConversationId: number;
  onConversationSelect: (conversationId: number) => void;
}

export const ConversationsSidebar: FC<ConversationsSidebarProps> = ({
  activeConversationId,
  onConversationSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  const pinnedConversations = filteredConversations.slice(0, 3);
  const otherConversations = filteredConversations.slice(3);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleConversationClick = (conversation: Conversation) => {
    onConversationSelect(conversation.id);
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

      <Box className={styles.conversationList}>
        {pinnedConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversationId === conversation.id}
            onClick={handleConversationClick}
          />
        ))}

        {otherConversations.length > 0 && (
          <Box className={styles.conversationDivider}>
            <Typography>All Messages</Typography>
          </Box>
        )}

        {otherConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversationId === conversation.id}
            onClick={handleConversationClick}
          />
        ))}
      </Box>
    </aside>
  );
};
