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

///////////// TRY TO MAKE THE STATE OBJECT FOLDER CHILDREN AN OBJECT INSTEAD OF AN ARRAY
// const initialState = {
//   // ...
//   folders: {
//     // other folders...
//     [folder.id]: {
//       ...folder,
//       children: folder.children.reduce((acc, child) => {
//         acc[child.id] = child;
//         return acc;
//       }, {}),
//     },
//   },}

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
    //getFolderChildren
    builder.addCase(renameFolderAsync.pending, (state) => {
      handleStateStatus(state, "pending", "renameFolder");
    });
    builder.addCase(renameFolderAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "renameFolder", action.error);
    });
    builder.addCase(renameFolderAsync.fulfilled, (state, action) => {
      const folder = action.payload;
      handleStateStatus(state, "fulfilled", "renameFolder");
      //need to implement binary search
      if (state.currentFolder) {
        state.currentFolder.children = state.currentFolder?.children.map(
          (child) => {
            if (child.id === folder.id) return folder;
            return child;
          }
        );
      }
      state.folders[folder.parentId!].children = state.folders[
        folder.parentId!
      ].children.map((child) => {
        if (child.id === folder.id) return folder;
        return child;
      });
      return state;
    });
  },
});

export const {
  createFolderAsync,
  getFolderChildrenAsync,
  getFolderAsync,
  renameFolderAsync,
} = foldersThunks;
export const {
  setCurrentFolder,
  resetFolderActionState,
  setPath,
  resetFolderStateOnLogout,
  setContextFolder,
} = foldersSlice.actions;
export default foldersSlice.reducer;

export type FolderMethods = "addFolder" | "getFolderChildren" | "renameFolder";

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
