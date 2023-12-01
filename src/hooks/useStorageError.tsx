import { StorageError } from "firebase/storage";
import { toastService } from "../services/toastService";
import { userService } from "../services/userService";
import { resetFolderStateOnLogout } from "../utils/redux/foldersRedux/foldersSlice";
import { resetAuthStateOnLogout } from "../utils/redux/userRedux/userSlice";
import { useDispatch } from "react-redux";

const useStorageError = () => {
  const dispatch = useDispatch();

  const errorExtructor = (error: StorageError) => {
    const { code } = error;
    switch (code) {
      case "storage/unknown": {
        return "Unknow Error has accured";
      }

      case "storage/object-not-found": {
        return "File was Not found!";
      }

      case "storage/unauthenticated": {
        return "Permission Expired, Please Login again.";
      }

      case "storage/unauthorized": {
        return "UnAuthorized!";
      }

      case "storage/retry-limit-exceeded": {
        return "Action faild, Please try again.";
      }

      default:
        return "Unknow Error has accured";
    }
  };

  return (error: StorageError) => {
    const errMessage = errorExtructor(error);
    toastService.error(errMessage);
    if (error.code === "storage/unauthenticated") {
      userService.logout();
      dispatch(resetAuthStateOnLogout());
      dispatch(resetFolderStateOnLogout());
    }
  };
};

export default useStorageError;
