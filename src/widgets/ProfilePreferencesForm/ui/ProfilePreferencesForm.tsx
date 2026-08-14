import { Box, MenuItem, TextField, Typography } from "@mui/material";
import type { ChangeEventHandler, FC } from "react";

import type { UserProfile, UserProfileField } from "@/entities/user";

import styles from "./ProfilePreferencesForm.module.scss";

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Russian", value: "ru" },
] as const;

const timezoneOptions = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Warsaw",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Almaty",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
] as const;

interface ProfilePreferencesFormProps {
  profile: UserProfile;
  onFieldChange: (field: UserProfileField) => ChangeEventHandler<HTMLInputElement>;
}

export const ProfilePreferencesForm: FC<ProfilePreferencesFormProps> = ({
  profile,
  onFieldChange,
}) => {
  const timezoneValues = profile.timezone
    ? Array.from(new Set([profile.timezone, ...timezoneOptions]))
    : timezoneOptions;

  return (
    <section className={styles.formSection}>
      <Box className={styles.field}>
        <Typography component="label" htmlFor="timezone">
          Timezone
        </Typography>

        <TextField
          id="timezone"
          select
          fullWidth
          value={profile.timezone}
          onChange={onFieldChange("timezone")}
        >
          <MenuItem value="" disabled>
            Select timezone
          </MenuItem>
          {timezoneValues.map((timezone) => (
            <MenuItem key={timezone} value={timezone}>
              {timezone}
            </MenuItem>
          ))}
        </TextField>
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
