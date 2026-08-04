import type { FC } from "react";

import { type SettingsTab, settingsTabs } from "../model/types";
import styles from "./SettingsNavigation.module.scss";

interface SettingsNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsNavigation: FC<SettingsNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.tabs} aria-label="Settings sections">
      {settingsTabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            className={isActive ? styles.activeTab : undefined}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              onTabChange(tab);
            }}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
};
