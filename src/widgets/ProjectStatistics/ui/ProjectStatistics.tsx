import { Box } from "@mui/material";
import type { FC } from "react";

import { ProjectStatisticCard } from "@/entities/projectStatistic";
import { projectStatistics } from "@/widgets";

import styles from "./ProjectStatistics.module.scss";

export const ProjectStatistics: FC = () => {
  return (
    <Box className={styles.statistics}>
      {projectStatistics.map((statistic) => (
        <ProjectStatisticCard key={statistic.id} statistic={statistic} />
      ))}
    </Box>
  );
};
