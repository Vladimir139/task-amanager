import { FormControlLabel, Switch, Typography } from "@mui/material";
import type { ChangeEventHandler, FC } from "react";

import type { UserNotificationField, UserNotificationSettings } from "@/entities/user";

import styles from "./NotificationSettingsForm.module.scss";

const notificationOptions: Array<{
  description: string;
  field: UserNotificationField;
  label: string;
}> = [
  {
    description: "Send important updates by email.",
    field: "emailEnabled",
    label: "Email notifications",
  },
  {
    description: "Allow browser or device push notifications.",
    field: "pushEnabled",
    label: "Push notifications",
  },
  {
    description: "Play sound when a new message arrives.",
    field: "messageSoundEnabled",
    label: "Message sounds",
  },
  {
    description: "Receive task assignment alerts.",
    field: "taskAssignedEnabled",
    label: "Task assigned alerts",
  },
  {
    description: "Receive message alerts from chats and boards.",
    field: "messageReceivedEnabled",
    label: "New message alerts",
  },
  {
    description: "Receive product and marketing updates.",
    field: "marketingEnabled",
    label: "Marketing updates",
  },
];

interface NotificationSettingsFormProps {
  notificationSettings: UserNotificationSettings;
  onFieldChange: (field: UserNotificationField) => ChangeEventHandler<HTMLInputElement>;
}

export const NotificationSettingsForm: FC<NotificationSettingsFormProps> = ({
  notificationSettings,
  onFieldChange,
}) => {
  return (
    <section className={styles.formSection}>
      {notificationOptions.map((option) => (
        <div key={option.field} className={styles.settingRow}>
          <div>
            <Typography component="h2" className={styles.settingTitle}>
              {option.label}
            </Typography>

            <Typography className={styles.settingDescription}>{option.description}</Typography>
          </div>

          <FormControlLabel
            className={styles.settingSwitch}
            control={
              <Switch
                checked={notificationSettings[option.field]}
                onChange={onFieldChange(option.field)}
              />
            }
            label=""
          />
        </div>
      ))}
    </section>
  );
};
