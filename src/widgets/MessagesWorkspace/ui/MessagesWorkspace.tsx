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
    handleAttachImages,
    handleUploadAudio,
    hasConversations,
    isError,
    isLoading,
    isMutating,
    newMessage,
    onlineCount,
    statusMessage,
    statusTone,
    selectConversation,
    typingText,
    setNewMessage,
    sharedFiles,
    submitMessage,
  } = useMessagesWorkspace();

  if (isLoading && !hasConversations) {
    return <Typography>Loading conversations...</Typography>;
  }

  if (isError && !hasConversations) {
    return <Typography>Unable to load conversations.</Typography>;
  }

  if (!hasConversations) {
    return <Typography>No conversations yet.</Typography>;
  }

  return (
    <div className={styles.page}>
      <ConversationsSidebar
        activeConversationId={activeConversationId}
        conversations={conversations}
        isError={isError}
        isLoading={isLoading}
        onConversationSelect={selectConversation}
      />

      <ChatWindow
        avatar={conversationAvatar}
        composerStatusMessage={statusMessage}
        composerStatusTone={statusTone}
        title={conversationName}
        members={chatMembers}
        membersCount={chatMembers.length}
        onlineCount={onlineCount}
        messages={chatMessages}
        newMessage={newMessage}
        onAttachImages={handleAttachImages}
        onMessageChange={setNewMessage}
        onMessageSubmit={() => {
          void submitMessage();
        }}
        onUploadAudio={handleUploadAudio}
        isSubmitting={isMutating}
        isLoading={isLoading}
        typingText={typingText}
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
