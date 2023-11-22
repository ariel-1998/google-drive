import { createAsyncThunk } from "@reduxjs/toolkit";
import { FolderModel, FolderModelWithoutId } from "../../../models/FolderModel";
import { dbCollectionRefs } from "../../firebaseConfig";
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { store } from "../store";

class FoldersThunks {
  createFolderAsync = createAsyncThunk(
    "files/createFolderAsync",
    async (folder: FolderModelWithoutId) => {
      const newDoc: FolderModelWithoutId = {
        ...folder,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(dbCollectionRefs.folders, newDoc);
      return { ...newDoc, id: docRef.id };
    }
  );

  getFolderChildrenAsync = createAsyncThunk(
    "files/getFolderChildrenAsync",
    async (folder: FolderModel) => {
      const userId = store.getState().user.user?.uid;
      if (!userId) throw new Error();

      //check if folder is cached before requesting with an api call
      const { folders, currentFolder } = store.getState().folders;
      const cachedFolder = folders[folder.id];
      if (cachedFolder && currentFolder) return cachedFolder;
      //if not exist then we query the folder children
      const q = query(
        dbCollectionRefs.folders,
        where("userId", "==", userId),
        where("parentId", "==", folder.id || "null"),
        orderBy("createdAt")
      );
      const querySnapshot = await getDocs(q);
      return {
        ...folder,
        children: querySnapshot.docs.map((doc) => ({
          ...(doc.data() as FolderModel),
          id: doc.id,
        })),
      };
    }
  );
}

export const foldersThunks = new FoldersThunks();
