import type { RecentFilesSortField, SortDirection } from "@/widgets/RecentFiles/model";

export interface TableHeaderButtonProps {
  field: RecentFilesSortField;
  label: string;
  activeField: RecentFilesSortField;
  direction: SortDirection;
  onSort: (field: RecentFilesSortField) => void;
}
