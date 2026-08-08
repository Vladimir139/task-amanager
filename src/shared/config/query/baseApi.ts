import { createApi } from "@reduxjs/toolkit/query/react";

import { apiTags } from "./apiTags";
import { baseQueryWithReauth } from "./baseQuery";

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: "api",
  tagTypes: apiTags,
});
