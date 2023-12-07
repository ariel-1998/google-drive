import { FieldValue, Timestamp } from "firebase/firestore";
import { Path } from "./FolderModel";

export type FileModel = {
  id?: string;
  name: string;
  parentId: string;
  userId?: string;
  url: string;
  path: { id: string }[];
  uploadedAt: FieldValue | Timestamp | Date;
};
