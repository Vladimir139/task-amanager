export const taskPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

export const taskWorkflowStateOptions = [
  { label: "Open", value: "open" },
  { label: "Done", value: "done" },
  { label: "Archived", value: "archived" },
] as const;

export const taskCategoryOptions = [
  { label: "Design", value: "design" },
  { label: "Research", value: "research" },
  { label: "Planning", value: "planning" },
  { label: "Content", value: "content" },
  { label: "Development", value: "development" },
  { label: "Other", value: "other" },
] as const;

export const taskMovePlacementOptions = [
  { label: "Top of column", value: "top" },
  { label: "Bottom of column", value: "bottom" },
] as const;
