import { Typography } from "@mui/material";
import { type FC } from "react";

import { ChatInformationSidebar } from "@/widgets/ChatInformationSidebar";
import { ChatWindow } from "@/widgets/ChatWindow";
import { ConversationsSidebar } from "@/widgets/ConversationsSidebar";

import { useMessagesWorkspace } from "../model/useMessagesWorkspace";
import styles from "./MessagesWorkspace.module.scss";

export const MessagesWorkspace: FC = () => {
  const {
    activeConversationId,
    chatMembers,
    chatMessages,
    conversationAvatar,
    conversationName,
    conversationSubtitle,
    conversations,
    isLoading,
    isSendingMessage,
    newMessage,
    onlineCount,
    setActiveConversationId,
    setNewMessage,
    sharedFiles,
    submitMessage,
  } = useMessagesWorkspace();

  if (!conversations.length && isLoading) {
    return <Typography>Loading conversations...</Typography>;
  }

  return (
    <div className={styles.page}>
      <ConversationsSidebar
        activeConversationId={activeConversationId}
        conversations={conversations}
        isLoading={isLoading}
        onConversationSelect={setActiveConversationId}
      />

      <ChatWindow
        avatar={conversationAvatar}
        title={conversationName}
        members={chatMembers}
        membersCount={chatMembers.length}
        onlineCount={onlineCount}
        messages={chatMessages}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onMessageSubmit={() => {
          void submitMessage();
        }}
        isSubmitting={isSendingMessage}
        isLoading={isLoading}
      />

      <ChatInformationSidebar
        members={chatMembers}
        profileAvatar={conversationAvatar}
        profileName={conversationName}
        profileSubtitle={conversationSubtitle}
        sharedFiles={sharedFiles}
      />
    </div>
  );
};
