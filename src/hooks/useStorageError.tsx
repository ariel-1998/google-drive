import { StorageError } from "firebase/storage";
import { toastService } from "../services/toastService";
import { useNavigate } from "react-router-dom";

const useStorageError = () => {
  const navigate = useNavigate();
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
    if (error.code === "storage/unauthenticated") navigate("/logout");
  };
};

export default useStorageError;
