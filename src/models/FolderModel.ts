import { FieldValue } from "firebase/firestore";
import { FileModel } from "./FileModel";

export type FolderModel = {
  id: string;
  createdAt?: FieldValue;
  name: string;
  children: FolderModel[];
  parentId: string | null;
  userId: string | null;
  path: Path[];
};

export type Path = {
  name: string;
  id: string;
};

export type FolderModelWithoutId = Omit<FolderModel, "id">;
