import { Box, TextField, Typography } from "@mui/material";
import type { ChangeEventHandler, FC } from "react";

import type { UserPasswordField, UserPasswordForm } from "@/entities/user";

import styles from "./PasswordSettingsForm.module.scss";

interface PasswordSettingsFormProps {
  passwordForm: UserPasswordForm;
  onFieldChange: (field: UserPasswordField) => ChangeEventHandler<HTMLInputElement>;
}

export const PasswordSettingsForm: FC<PasswordSettingsFormProps> = ({
  passwordForm,
  onFieldChange,
}) => {
  return (
    <section className={styles.formSection}>
      <Box className={styles.field}>
        <Typography component="label" htmlFor="current-password">
          Current password
        </Typography>

        <TextField
          id="current-password"
          type="password"
          fullWidth
          value={passwordForm.currentPassword}
          onChange={onFieldChange("currentPassword")}
          autoComplete="current-password"
        />
      </Box>

      <Box className={styles.sectionDivider} />

      <Box className={styles.field}>
        <Typography component="label" htmlFor="new-password">
          New password
        </Typography>

        <TextField
          id="new-password"
          type="password"
          fullWidth
          value={passwordForm.newPassword}
          onChange={onFieldChange("newPassword")}
          autoComplete="new-password"
          helperText="At least 8 characters"
        />
      </Box>

      <Box className={styles.sectionDivider} />

      <Box className={styles.field}>
        <Typography component="label" htmlFor="confirm-password">
          Confirm new password
        </Typography>

        <TextField
          id="confirm-password"
          type="password"
          fullWidth
          value={passwordForm.confirmPassword}
          onChange={onFieldChange("confirmPassword")}
          autoComplete="new-password"
        />
      </Box>
    </section>
  );
};
