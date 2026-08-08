import type { UserSchema } from "@/entities/user";
import type { AuthSchema } from "@/features/auth/model/types/authSchema";
import type { baseApi } from "@/shared/config/query";

export interface StateSchema {
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
  auth: AuthSchema;
  user: UserSchema;
}
