import { FolderModel, FolderModelWithoutId } from "../models/FolderModel";
import {
  addToPath,
  createFolderAsync,
  getFolderChildrenAsync,
} from "../utils/redux/filesRedux/foldersSlice";
import { store } from "../utils/redux/store";

class FoldersService {
  createFolder(folder: FolderModelWithoutId) {
    return store.dispatch(createFolderAsync(folder));
  }

  getFolderChildren(folder: FolderModel) {
    store.dispatch(addToPath(folder));
    store.dispatch(getFolderChildrenAsync(folder));
  }
}

export const foldersService = new FoldersService();
