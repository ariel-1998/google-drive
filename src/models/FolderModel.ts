import { FieldValue } from "firebase/firestore";
import { FileModel } from "./FileModel";

export type FolderModel = {
  id: string;
  createdAt?: FieldValue;
  name: string;
  children: FolderModel[] | FileModel[];
  parentId: string | null;
  userId?: string;
};
export type FolderModelWithoutId = Omit<FolderModel, "id">;
