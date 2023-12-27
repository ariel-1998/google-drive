import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { foldersThunks } from "./foldersThunks";
import { FolderModel, Path } from "../../../models/FolderModel";
import { Status, Action, initialAction } from "../userRedux/userSlice";
import { FileDisplayOptions } from "../../../context/FilesProvider";

export type FolderActions = Record<FolderMethods, Action>;

type FolderDisplayed = {
  folder: FolderModel;
  option: FileDisplayOptions;
} | null;

type FolderStateType = {
  folders: Record<string, FolderModel>;
  actions: FolderActions;
  currentFolder: FolderModel | null;
  contextFolder: FolderDisplayed;
  path: Path[];
};

export const ROOT_FOLDER: FolderModel = {
  id: "",
  name: "Root",
  parentId: null,
  children: [],
  path: [],
  userId: null,
};

const initialState = {
  currentFolder: null,
  folders: {},
  actions: {
    addFolder: { ...initialAction },
    getFolderChildren: { ...initialAction },
    renameFolder: { ...initialAction },
    deleteFolder: { ...initialAction },
  },
  path: [],
  contextFolder: null,
} as FolderStateType;

const foldersSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setCurrentFolder(state, action: PayloadAction<FolderModel>) {
      state.currentFolder = action.payload;
    },
    setPath(state, action: PayloadAction<Path[]>) {
      state.path = action.payload;
    },

    resetFolderActionState(state, action: PayloadAction<FolderMethods>) {
      const method = action.payload;
      state.actions[method] = { ...initialAction };
      return state;
    },
    setContextFolder(state, action: PayloadAction<FolderDisplayed>) {
      const context = action.payload;
      state.contextFolder = context;
    },
    resetFolderStateOnLogout() {
      return initialState;
    },
  },
  extraReducers(builder) {
    //addFolder
    builder.addCase(createFolderAsync.pending, (state) => {
      handleStateStatus(state, "pending", "addFolder");
    });
    builder.addCase(createFolderAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "addFolder", action.error);
    });
    builder.addCase(createFolderAsync.fulfilled, (state, action) => {
      handleStateStatus(state, "fulfilled", "addFolder");
      const { payload } = action;
      console.log(payload);
      state.folders[payload.id] = payload;
      state.folders[payload.parentId!].children.push(payload);
      state.currentFolder?.children?.push(payload);
    });
    //getFolderChildren
    builder.addCase(getFolderChildrenAsync.pending, (state) => {
      handleStateStatus(state, "pending", "getFolderChildren");
    });
    builder.addCase(getFolderChildrenAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "getFolderChildren", action.error);
    });
    builder.addCase(getFolderChildrenAsync.fulfilled, (state, action) => {
      const { payload } = action;
      handleStateStatus(state, "fulfilled", "getFolderChildren");
      state.folders[payload.id] = payload;
      state.currentFolder = payload;
    });
    //renameFolder
    builder.addCase(renameFolderAsync.pending, (state) => {
      handleStateStatus(state, "pending", "renameFolder");
    });
    builder.addCase(renameFolderAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "renameFolder", action.error);
    });
    builder.addCase(renameFolderAsync.fulfilled, (state, action) => {
      const folder = action.payload;
      handleStateStatus(state, "fulfilled", "renameFolder");

      const index = state.folders[folder.parentId!].children.findIndex(
        (child) => child.id === folder.id
      );
      if (index === -1) return;
      state.folders[folder.parentId!].children[index] = folder;

      if (state.currentFolder?.children[index].id === folder.id) {
        state.currentFolder.children[index] = folder;
      }
      return state;
    });

    //deleteFolder
    builder.addCase(deleteFolderAsync.pending, (state) => {
      handleStateStatus(state, "pending", "deleteFolder");
    });
    builder.addCase(deleteFolderAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "deleteFolder", action.error);
    });
    builder.addCase(deleteFolderAsync.fulfilled, (state, action) => {
      handleStateStatus(state, "fulfilled", "deleteFolder");
      const { deletedFolders, contextFolder } = action.payload;

      //delete all deleted folders including the contextFolder
      deletedFolders.forEach((folder) => {
        if (state.folders[folder.id]) {
          delete state.folders[folder.id];
        }
      });

      //remove the contextFolder from its parent
      state.folders[contextFolder.parentId!].children = state.folders[
        contextFolder.parentId!
      ].children.filter((child) => child.id !== contextFolder.id);

      //remove the contextFolder from its parent if its parent is the parent of contextFolder
      if (state.currentFolder?.id === contextFolder.parentId) {
        state.currentFolder.children = state.currentFolder.children.filter(
          (child) => child.id !== contextFolder.id
        );
      }
      return state;
    });
  },
});

export const {
  createFolderAsync,
  getFolderChildrenAsync,
  getFolderAsync,
  renameFolderAsync,
  deleteFolderAsync,
} = foldersThunks;

export const {
  setCurrentFolder,
  resetFolderActionState,
  setPath,
  resetFolderStateOnLogout,
  setContextFolder,
} = foldersSlice.actions;
export default foldersSlice.reducer;

export type FolderMethods =
  | "addFolder"
  | "getFolderChildren"
  | "renameFolder"
  | "deleteFolder";

function handleStateStatus(
  state: FolderStateType,
  status: Status,
  method: FolderMethods,
  error?: SerializedError
) {
  switch (status) {
    case "pending": {
      state.actions[method].isLoading = true;
      state.actions[method].isError = false;
      state.actions[method].error = null;
      break;
    }
    case "rejected": {
      state.actions[method].isLoading = false;
      state.actions[method].isError = true;
      state.actions[method].error = error || {
        message: "Unknown Error has accured.",
      };
      break;
    }
    case "fulfilled": {
      state.actions[method].error = null;
      state.actions[method].isSuccessful = true;
      state.actions[method].isLoading = false;
      state.actions[method].isError = false;
      break;
    }
    default: {
      state.actions[method] = { ...initialAction };
    }
  }
}
