import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { foldersThunks } from "./foldersThunks";
import { FolderModel, Path } from "../../../models/FolderModel";
import { Status, Action } from "../userRedux/userSlice";

type FolderStateType = {
  folders: Record<string, FolderModel>;
  actions: Record<Method, Action>;
  currentFolder: FolderModel | null;
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
    addFolder: { status: "idle", error: null },
    getFolderChildren: { status: "idle", error: null },
  },
  path: [],
} as FolderStateType;

const foldersSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setCurrentFolder(state, action: PayloadAction<FolderModel>) {
      state.currentFolder = action.payload;
    },
    resetAddFolderStatus(state) {
      state.actions.addFolder.status = "idle";
      state.actions.addFolder.error = null;
    },
    setPath(state, action: PayloadAction<Path[]>) {
      state.path = action.payload;
    },
  },
  extraReducers(builder) {
    //addFolder
    builder.addCase(createFolderAsync.pending, (state) => {
      handleStateStatus(state, "pending", "addFolder");
    });
    builder.addCase(createFolderAsync.rejected, (state, action) => {
      handleStateStatus(state, "rejected", "addFolder", action.error.message);
    });
    builder.addCase(createFolderAsync.fulfilled, (state, action) => {
      handleStateStatus(state, "fulfilled", "addFolder");
      const { payload } = action;
      state.folders[payload.id] = payload;
      state.currentFolder?.children?.push(payload);
    });
    //getFolderChildren
    builder.addCase(getFolderChildrenAsync.pending, (state) => {
      handleStateStatus(state, "pending", "getFolderChildren");
    });
    builder.addCase(getFolderChildrenAsync.rejected, (state, action) => {
      handleStateStatus(
        state,
        "rejected",
        "getFolderChildren",
        action.error.message
      );
    });
    builder.addCase(getFolderChildrenAsync.fulfilled, (state, action) => {
      console.log("payload");
      console.log("fulfilled");
      const { payload } = action;
      handleStateStatus(state, "fulfilled", "getFolderChildren");
      state.folders[payload.id] = payload;
      state.currentFolder = payload;
    });
  },
});

export const { createFolderAsync, getFolderChildrenAsync, getFolderAsync } =
  foldersThunks;
export const { setCurrentFolder, resetAddFolderStatus, setPath } =
  foldersSlice.actions;
export default foldersSlice.reducer;

type Method = "addFolder" | "getFolderChildren";

function handleStateStatus(
  state: FolderStateType,
  status: Status,
  method: Method,
  error?: string
) {
  switch (status) {
    case "pending": {
      state.actions[method].status = "pending";
      state.actions[method].error = null;
      break;
    }
    case "rejected": {
      state.actions[method].status = "rejected";
      state.actions[method].error = error || "Unknown Error has accured.";
      break;
    }
    case "fulfilled": {
      state.actions[method].status = "fulfilled";
      state.actions[method].error = null;
      break;
    }
    default: {
      state.actions[method].status = "idle";
      state.actions[method].error = null;
    }
  }
}
