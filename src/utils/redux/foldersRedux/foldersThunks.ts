import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FolderModel,
  FolderModelWithoutId,
  Path,
} from "../../../models/FolderModel";
import { auth, db, dbCollectionRefs } from "../../firebaseConfig";
import {
  DocumentData,
  QuerySnapshot,
  WriteBatch,
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { store } from "../store";

class FoldersThunks {
  private async queryFoldersBasedOnPath(path: Path, userId: string) {
    const q = query(
      dbCollectionRefs.folders,
      where("path", "array-contains", path),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  private async getFolderChildren(folder: FolderModel) {
    const userId = auth.currentUser?.uid;

    const q = query(
      dbCollectionRefs.folders,
      where("userId", "==", userId),
      where("parentId", "==", folder.id),
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
      return await this.getFolderChildren(folder);
    }
  );

  getFolderAsync = createAsyncThunk(
    "files/getFolderChildrenAsync",
    async (folderId: string) => {
      const docRef = dbCollectionRefs.folersDocRef(folderId);
      const querySnapshot = await getDoc(docRef);
      if (!querySnapshot.exists()) throw new Error("Not Found.");
      const data = querySnapshot.data() as FolderModel;
      const folder = { ...data, id: querySnapshot.id };
      return await this.getFolderChildren(folder);
    }
  );

  renameFolderAsync = createAsyncThunk(
    "files/renameFolderAsync",
    async ({ folder, newName }: { folder: FolderModel; newName: string }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in!");
      const { id, name } = folder;

      const folderRef = dbCollectionRefs.folersDocRef(id);
      const rename: Partial<FolderModel> = { name: newName };
      await updateDoc(folderRef, rename);
      {
        /**
      update all childrenFolders to have the new name it there path so when going
      to a page with url so the first path that displaed will be with the correct names
    */
      }
      const pathToSearch: Path = { id, name };

      const querySnapshot = await this.queryFoldersBasedOnPath(
        pathToSearch,
        user.uid
      );

      if (!querySnapshot.empty) {
        let batch = writeBatch(db);
        let docCounter = 0;

        for (const doc of querySnapshot.docs) {
          let docNewPath = (doc.data() as FolderModel).path;

          docNewPath = docNewPath.map((path) => {
            if (path.id !== id) return path;
            return { ...path, name: newName };
          });

          batch.update(doc.ref, { path: docNewPath });

          docCounter++;

          if (docCounter === 499) {
            docCounter = 0;
            await batch.commit();
            batch = writeBatch(db);
          }
        }
        //check if last round was less than 500 then commit batch
        if (docCounter > 0) {
          await batch.commit();
        }
      }

      return { ...folder, name: newName };
    }
  );

  // deleteFolderAsync = createAsyncThunk(
  //   "files/deleteFolderAsync",
  //   async (folder: FolderModel) => {
  //     //delete everything from folders where folder.path includes folder.id and userId == user.uid
  //     const user = auth.currentUser;
  //     if (!user) throw new Error("User not logged in!");
  //     // const path: Path = {id: folder.id}
  //     const { id, name } = folder;
  //     const pathToSearch: Path = { id, name };

  //     const querySnapshot = await this.queryFoldersBasedOnPath(
  //       pathToSearch,
  //       user.uid
  //     );
  //     const foldersDeleted: Record<string, string> = {};
  //     //delete all folder Children
  //     if (!querySnapshot.empty) {
  //       let batch = writeBatch(db);
  //       let docCounter = 0;

  //       for (const doc of querySnapshot.docs) {
  //         //store all the folders that ar deleted in an object to delete thei file children
  //         if (!foldersDeleted[doc.id]) foldersDeleted[doc.id] = doc.id;
  //         batch.delete(doc.ref);

  //         docCounter++;

  //         if (docCounter === 499) {
  //           docCounter = 0;
  //           await batch.commit();
  //           batch = writeBatch(db);
  //         }
  //       }
  //       //check if last round was less than 500 then commit batch
  //       if (docCounter > 0) {
  //         await batch.commit();
  //       }
  //     }

  //     //adn delete all from files (should also) store path in files and do the same as folders
  //   }
  // );
}

export const foldersThunks = new FoldersThunks();
