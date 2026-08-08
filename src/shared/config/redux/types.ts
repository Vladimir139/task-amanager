import type { NavigateOptions, To } from "react-router-dom";

export interface ExtraArgument {
  navigate?: (to: To | number, options?: NavigateOptions) => Promise<void> | void;
}
