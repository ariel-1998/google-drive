import { FolderModel, FolderModelWithoutId } from "../models/FolderModel";
import {
  createFolderAsync,
  getFolderAsync,
  getFolderChildrenAsync,
} from "../utils/redux/filesRedux/foldersSlice";
import { store } from "../utils/redux/store";

class FoldersService {
  createFolder(folder: FolderModelWithoutId) {
    return store.dispatch(createFolderAsync(folder));
  }

  getFolderChildren(folder: FolderModel) {
    store.dispatch(getFolderChildrenAsync(folder));
  }
  getFolder(folderId: string) {
    store.dispatch(getFolderAsync(folderId));
  }
}

export const foldersService = new FoldersService();
