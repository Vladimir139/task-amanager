export const formatDateLabel = (value?: string | null): string => {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatTimeLabel = (value?: string | null): string => {
  if (!value) {
    return "No time";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export const formatDateTimeLabel = (value?: string | null): string => {
  if (!value) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
};

export const formatConversationTime = (value?: string | null): string => {
  if (!value) {
    return "Now";
  }

  const date = new Date(value);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (sameDay) {
    return formatTimeLabel(value);
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return formatDateLabel(value);
};

export const formatBytes = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const fractionDigits = value >= 10 ? 0 : 1;

  return `${value.toFixed(fractionDigits)} ${units[exponent]}`;
};

export const getInitials = (...parts: Array<string | null | undefined>): string => {
  const normalized = parts
    .flatMap((part) => (part ? part.split(" ") : []))
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");

  return normalized.join("") || "NA";
};

export const normalizeCategoryLabel = (
  category?: string | null,
): "Design" | "Research" | "Planning" | "Content" | "Development" | "Other" => {
  if (category == null) {
    return "Other";
  }

  switch (category) {
    case "design":
      return "Design";
    case "research":
      return "Research";
    case "planning":
      return "Planning";
    case "content":
      return "Content";
    case "development":
      return "Development";
    default:
      return "Other";
  }
};
