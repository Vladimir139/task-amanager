import { Box, MenuItem, TextField, Typography } from "@mui/material";
import type { ChangeEventHandler, FC } from "react";

import type { UserProfile, UserProfileField } from "@/entities/user";

import styles from "./ProfilePreferencesForm.module.scss";

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Russian", value: "ru" },
] as const;

interface ProfilePreferencesFormProps {
  profile: UserProfile;
  onFieldChange: (field: UserProfileField) => ChangeEventHandler<HTMLInputElement>;
}

export const ProfilePreferencesForm: FC<ProfilePreferencesFormProps> = ({
  profile,
  onFieldChange,
}) => {
  return (
    <section className={styles.formSection}>
      <Box className={styles.field}>
        <Typography component="label" htmlFor="timezone">
          Timezone
        </Typography>

        <TextField
          id="timezone"
          fullWidth
          value={profile.timezone}
          onChange={onFieldChange("timezone")}
          placeholder="Europe/Moscow"
        />
      </Box>

      <Box className={styles.sectionDivider} />

      <Box className={styles.field}>
        <Typography component="label" htmlFor="locale">
          Locale
        </Typography>

        <TextField
          id="locale"
          select
          fullWidth
          value={profile.locale}
          onChange={onFieldChange("locale")}
        >
          {localeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </section>
  );
};
