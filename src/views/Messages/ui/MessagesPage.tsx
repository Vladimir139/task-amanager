import {
  Add,
  Check,
  ExpandMore,
  ImageOutlined,
  LocationOn,
  MicNone,
  MoreVert,
  Search,
  SendOutlined,
  SentimentSatisfiedAlt,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { type FC, useMemo, useState } from "react";

import { chatMembers, chatMessages, conversations, sharedFiles } from "../model/messages.data.ts";
import type { ChatMessage, Conversation, SharedFile } from "../model/messages.types.ts";
import styles from "./MessagesPage.module.scss";

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.conversation} ${isActive ? styles.activeConversation : ""}`}
      onClick={onClick}
    >
      <Box className={styles.conversationAvatar}>
        <Avatar src={conversation.avatar} alt={conversation.name} />

        {conversation.isOnline && <span />}
      </Box>

      <Box className={styles.conversationContent}>
        <Box className={styles.conversationHeader}>
          <Typography>{conversation.name}</Typography>
          <Typography>{conversation.time}</Typography>
        </Box>

        <Box className={styles.conversationPreview}>
          <Typography className={conversation.isTyping ? styles.typing : ""}>
            {conversation.isVoice && <MicNone />}
            {conversation.preview}
          </Typography>

          {conversation.unread && <span className={styles.unreadBadge}>{conversation.unread}</span>}

          {conversation.isRead && (
            <Box className={styles.readStatus}>
              <Check />
              <Check />
            </Box>
          )}
        </Box>
      </Box>
    </button>
  );
}

function MessageItem({ message }: { message: ChatMessage }) {
  return (
    <Box className={`${styles.message} ${message.isOwn ? styles.ownMessage : ""}`}>
      {!message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}

      <Box className={styles.messageContent}>
        <Box className={styles.messageInformation}>
          <Typography>{message.author}</Typography>
          <Typography>{message.time}</Typography>
        </Box>

        <Box className={styles.messageBubbles}>
          {message.text?.map((text) => (
            <Box className={styles.messageBubble} key={text}>
              <Typography>{text}</Typography>

              <IconButton aria-label="Message actions">
                <MoreVert />
              </IconButton>
            </Box>
          ))}
        </Box>

        {message.attachments && (
          <Box className={styles.messageAttachments}>
            {message.attachments.map((attachment) => (
              <Box component="img" key={attachment.id} src={attachment.image} alt="" />
            ))}
          </Box>
        )}
      </Box>

      {message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}
    </Box>
  );
}

const fileIcons: Record<SharedFile["type"], React.ReactNode> = {
  figma: <span>Fg</span>,
  sketch: <span>◆</span>,
  xd: <span>Xd</span>,
  svg: <span>SVG</span>,
};

export const MessagesPage: FC = () => {
  const [activeConversationId, setActiveConversationId] = useState(2);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  const handleSubmit = () => {
    const normalizedMessage = newMessage.trim();

    if (!normalizedMessage) {
      return;
    }

    console.log("Send message:", normalizedMessage);
    setNewMessage("");
  };

  return (
    <div className={styles.page}>
      <aside className={styles.conversationsSidebar}>
        <Typography component="h1">Messages</Typography>

        <TextField
          fullWidth
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
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
          }}
        />

        <Box className={styles.conversationList}>
          {filteredConversations.slice(0, 3).map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => {
                setActiveConversationId(conversation.id);
              }}
            />
          ))}

          <Box className={styles.conversationDivider}>
            <Typography>All Message</Typography>
          </Box>

          {filteredConversations.slice(3).map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => {
                setActiveConversationId(conversation.id);
              }}
            />
          ))}
        </Box>
      </aside>

      <section className={styles.chat}>
        <header className={styles.chatHeader}>
          <Box className={styles.teamInformation}>
            <Avatar src="/images/users/design-team.jpg" alt="Design Team" />

            <Box>
              <Typography component="h2">Design Team</Typography>
              <Typography>60 member, 10 online</Typography>
            </Box>
          </Box>

          <Box className={styles.teamMembers}>
            <AvatarGroup max={3}>
              {chatMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} src={member.avatar} alt={member.name} />
              ))}
            </AvatarGroup>

            <IconButton className={styles.addMemberButton}>
              <Add />
            </IconButton>
          </Box>
        </header>

        <Box className={styles.messages}>
          {chatMessages.slice(0, 1).map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          <Box className={styles.dateDivider}>
            <span />
            <Typography>Today, March 24</Typography>
            <span />
          </Box>

          {chatMessages.slice(1).map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </Box>

        <Box className={styles.messageComposer}>
          <MicNone />

          <TextField
            fullWidth
            value={newMessage}
            onChange={(event) => {
              setNewMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Add a comment..."
          />

          <IconButton>
            <ImageOutlined />
          </IconButton>

          <IconButton>
            <SentimentSatisfiedAlt />
          </IconButton>

          <IconButton onClick={handleSubmit}>
            <SendOutlined />
          </IconButton>

          <IconButton>
            <LocationOn />
          </IconButton>
        </Box>
      </section>

      <aside className={styles.informationSidebar}>
        <Box className={styles.profile}>
          <Avatar src="/images/users/ahmed.jpg" alt="Killan James" />

          <Typography component="h2">Killan James</Typography>
          <Typography>@killan james</Typography>
        </Box>

        <section className={styles.sidebarSection}>
          <Box className={styles.sidebarSectionHeader}>
            <Typography component="h3">Attachments</Typography>

            <IconButton>
              <ExpandMore />
            </IconButton>
          </Box>

          <Box className={styles.files}>
            {sharedFiles.map((file) => (
              <Box className={styles.file} key={file.id}>
                <Box className={`${styles.fileIcon} ${styles[`${file.type}File`]}`}>
                  {fileIcons[file.type]}
                </Box>

                <Box>
                  <Typography>{file.name}</Typography>
                  <Typography>{file.information}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <button type="button" className={styles.viewAllButton}>
            View all
          </button>
        </section>

        <section className={styles.sidebarSection}>
          <Box className={styles.sidebarSectionHeader}>
            <Typography component="h3">Members</Typography>

            <IconButton>
              <ExpandMore />
            </IconButton>
          </Box>

          <button type="button" className={styles.addMember}>
            <span>
              <Add />
            </span>
            Add Member
          </button>

          <Box className={styles.members}>
            {chatMembers.map((member) => (
              <Box className={styles.member} key={member.id}>
                <Avatar src={member.avatar} alt={member.name} />
                <Typography>{member.name}</Typography>
              </Box>
            ))}
          </Box>
        </section>
      </aside>
    </div>
  );
};
