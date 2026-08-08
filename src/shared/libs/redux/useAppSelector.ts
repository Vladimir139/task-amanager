import { useSelector } from "react-redux";

import type { RootState } from "@/app/providers/store";

export const useAppSelector = useSelector.withTypes<RootState>();
