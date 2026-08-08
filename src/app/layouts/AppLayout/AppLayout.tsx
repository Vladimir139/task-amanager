import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header, SidebarNavigation } from "@/widgets";

import styles from "./AppLayout.module.scss";

export const AppLayout: FC = () => {
  return (
    <div className={styles.app}>
      <SidebarNavigation />

      <div className={styles.workspace}>
        <Header />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
