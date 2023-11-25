import { FolderModel, FolderModelWithoutId } from "../models/FolderModel";
import {
  createFolderAsync,
  getFolderAsync,
  getFolderChildrenAsync,
  setCurrentFolder,
} from "../utils/redux/foldersRedux/foldersSlice";
import { store } from "../utils/redux/store";

class FoldersService {
  createFolder(folder: FolderModelWithoutId) {
    return store.dispatch(createFolderAsync(folder));
  }

  getFolderChildren(folder: FolderModel) {
    const { folders } = store.getState().folders;
    const cachedFolder = folders[folder.id];
    if (cachedFolder) return store.dispatch(setCurrentFolder(cachedFolder));
    store.dispatch(getFolderChildrenAsync(folder));
  }
  getFolder(folderId: string) {
    const { folders } = store.getState().folders;
    const cachedFolder = folders[folderId];
    if (cachedFolder) return store.dispatch(setCurrentFolder(cachedFolder));
    store.dispatch(getFolderAsync(folderId));
  }
}

export const foldersService = new FoldersService();
