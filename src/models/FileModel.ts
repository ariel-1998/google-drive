import { FieldValue } from "firebase/firestore";

export type FileModel = {
  id?: string;
  name: string;
  parentId: string;
  userId?: string;
  url: string;
  uploadedAt: FieldValue | Date;
};
