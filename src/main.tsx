import "normalize.css";
import "./shared/lib/styles/index.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppLayout } from "@/shared/layouts";

import { HomePage } from "./views";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppLayout>
      <HomePage />
    </AppLayout>
  </StrictMode>,
);
