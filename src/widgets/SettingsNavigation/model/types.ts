export const settingsTabs = [
  "My details",
  "Profile",
  "Password",
  "Team",
  "Plan",
  "Billing",
  "Email",
  "Notifications",
] as const;

export type SettingsTab = (typeof settingsTabs)[number];
