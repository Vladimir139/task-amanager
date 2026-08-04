import { Avatar, Box, Button, Typography } from "@mui/material";
import type { FC } from "react";

import styles from "./SettingsProfileHeader.module.scss";

interface SettingsProfileHeaderProps {
  firstName: string;
  lastName: string;
  avatar: string;
  onCancel: () => void;
  onSave: () => void;
}

export const SettingsProfileHeader: FC<SettingsProfileHeaderProps> = ({
  firstName,
  lastName,
  avatar,
  onCancel,
  onSave,
}) => {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <section className={styles.profileHeader}>
      <Box component="img" src="/images/settings-cover.jpg" alt="" className={styles.cover} />

      <Box className={styles.profileInformation}>
        <Box className={styles.userBlock}>
          <Avatar src={avatar} alt={fullName} className={styles.avatar} />

          <Typography component="h1">Settings</Typography>
        </Box>

        <Box className={styles.headerActions}>
          <Button variant="outlined" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            className={styles.saveButton}
            onClick={onSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </section>
  );
};
