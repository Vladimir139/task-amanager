import type { FC } from "react";

import styles from "./MiniChart.module.scss";
import type { MiniChartProps } from "./MiniChart.types";

export const MiniChart: FC<MiniChartProps> = ({ color = "purple" }) => {
  return (
    <svg
      className={`${styles.miniChart} ${styles[color]}`}
      viewBox="0 0 130 60"
      role="img"
      aria-label="Statistic chart"
    >
      <defs>
        <linearGradient id={`mini-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        className={styles.miniChartArea}
        d="M2 48 C15 35, 22 37, 30 48 C40 59, 49 55, 58 32 C65 14, 76 14, 86 27 C96 39, 107 15, 119 8 C124 5, 127 9, 130 14 L130 60 L2 60 Z"
        fill={`url(#mini-gradient-${color})`}
      />

      <path
        className={styles.miniChartLine}
        d="M2 48 C15 35, 22 37, 30 48 C40 59, 49 55, 58 32 C65 14, 76 14, 86 27 C96 39, 107 15, 119 8 C124 5, 127 9, 130 14"
      />
    </svg>
  );
};
