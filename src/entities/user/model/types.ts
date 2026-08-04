export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
}

export type UserProfileField = "firstName" | "lastName" | "email" | "role";
