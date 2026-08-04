import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import type { FC } from "react";

import type { TableHeaderButtonProps } from "@/widgets/RecentFiles/lib/ui/TableHeaderButton/TableHeaderButton.types.ts";
import styles from "@/widgets/RecentFiles/ui/RecentFiles.module.scss";

export const TableHeaderButton: FC<TableHeaderButtonProps> = ({
  field,
  label,
  activeField,
  direction,
  onSort,
}) => {
  const isActive = activeField === field;
  const SortIcon = isActive && direction === "desc" ? ArrowDownward : ArrowUpward;

  return (
    <button
      type="button"
      className={isActive ? styles.activeSort : undefined}
      onClick={() => {
        onSort(field);
      }}
    >
      {label}
      <SortIcon />
    </button>
  );
};
