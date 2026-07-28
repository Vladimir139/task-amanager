import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import { HomePage } from "./views";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <HomePage />
    </App>
  </StrictMode>,
);
