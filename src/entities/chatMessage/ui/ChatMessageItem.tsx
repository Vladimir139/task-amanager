import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMessageItemProps } from "../model/types";
import styles from "./ChatMessageItem.module.scss";

export const ChatMessageItem: FC<ChatMessageItemProps> = ({ message }) => {
  return (
    <Box className={`${styles.message} ${message.isOwn ? styles.ownMessage : ""}`}>
      {!message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}

      <Box className={styles.messageContent}>
        <Box className={styles.messageInformation}>
          <Typography>{message.author}</Typography>
          <Typography>{message.time}</Typography>
          {message.isEdited && <Typography>Edited</Typography>}
        </Box>

        {message.isEditing ? (
          <Box className={styles.editForm}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={message.editDraft ?? ""}
              onChange={(event) => {
                message.onEditChange?.(event.target.value);
              }}
            />

            <Box className={styles.actionRow}>
              <Button
                variant="contained"
                size="small"
                onClick={message.onEditSubmit}
                disabled={!message.editDraft?.trim()}
              >
                Save
              </Button>
              <Button variant="text" size="small" onClick={message.onEditCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {!!message.text?.length && (
              <Box className={styles.messageBubbles}>
                {message.text.map((text, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Box className={styles.messageBubble} key={`${message.id}-${index}`}>
                    <Typography>{text}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {(message.canEdit ?? message.canDelete) && (
              <Box className={styles.actionRow}>
                {message.canEdit && (
                  <Button variant="text" size="small" onClick={message.onEditStart}>
                    Edit
                  </Button>
                )}
                {message.canDelete && (
                  <Button variant="text" size="small" color="error" onClick={message.onDelete}>
                    Delete
                  </Button>
                )}
              </Box>
            )}
          </>
        )}

        {!!message.attachments?.length && (
          <Box className={styles.messageBubbles}>
            <Box className={styles.messageAttachments}>
              {message.attachments.map((attachment) => (
                <Box
                  component="img"
                  key={attachment.id}
                  src={attachment.image}
                  alt={`Attachment from ${message.author}`}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}
    </Box>
  );
};
