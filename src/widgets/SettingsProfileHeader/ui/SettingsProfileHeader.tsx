import { Avatar, Box, Button, Typography } from "@mui/material";
import type { FC } from "react";

import styles from "./SettingsProfileHeader.module.scss";

interface SettingsProfileHeaderProps {
  avatar: string;
  firstName: string;
  isSaving?: boolean;
  isSaveDisabled?: boolean;
  lastName: string;
  onCancel: () => void;
  onSave: () => void;
}

export const SettingsProfileHeader: FC<SettingsProfileHeaderProps> = ({
  firstName,
  lastName,
  avatar,
  onCancel,
  onSave,
  isSaving = false,
  isSaveDisabled = false,
}) => {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <section className={styles.profileHeader}>
      <Box component="img" src="/images/settings-back.png" alt="" className={styles.cover} />

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
            disabled={isSaving || isSaveDisabled}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </section>
  );
};
