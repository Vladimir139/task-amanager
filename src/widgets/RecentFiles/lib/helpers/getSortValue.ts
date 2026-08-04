import type { RecentFile } from "@/entities/file";
import type { RecentFilesSortField } from "@/widgets/RecentFiles/model";

export const getSortValue = (file: RecentFile, field: RecentFilesSortField): string | number => {
  switch (field) {
    case "name":
      return file.name.toLowerCase();

    case "size":
      return Number.parseFloat(file.size);

    case "lastModified":
      return new Date(file.lastModified).getTime();

    case "members":
      return file.members.length;
  }
};
