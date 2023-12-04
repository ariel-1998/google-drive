import { SerializedError } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { toastService } from "../services/toastService";
import { userService } from "../services/userService";
import { resetAuthStateOnLogout } from "../utils/redux/userRedux/userSlice";
import { resetFolderStateOnLogout } from "../utils/redux/foldersRedux/foldersSlice";
import { useDispatch } from "react-redux";

type UseFirestoreErrorProps = SerializedError | null;

const useFirestoreError: React.FC<UseFirestoreErrorProps> = (error) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!error || !error.message) return;
    const { code, message } = error;
    const { shouldReLogin, errorMsg } = firebaseErrorExtructor({
      code,
      message,
    });
    toastService.error(errorMsg);
    if (shouldReLogin) {
      userService.logout();
      dispatch(resetAuthStateOnLogout());
      dispatch(resetFolderStateOnLogout());
    }
  }, [error]);
  return null;
};

export default useFirestoreError;

type FirebaseErrorExtructorReturnType = {
  errorMsg: string;
  shouldReLogin: boolean;
};

type FirebaseErrorExtructorProps = {
  message: string;
  code?: string;
};

function firebaseErrorExtructor({
  code,
  message,
}: FirebaseErrorExtructorProps): FirebaseErrorExtructorReturnType {
  let errorMessage = "Error: ";

  switch (code) {
    case "auth/internal-error":
    case "auth/invalid-argument":
    case "auth/invalid-id-token":
    case "auth/invalid-password": {
      errorMessage = message;
      break;
    }

    case "auth/email-already-exists": {
      errorMessage += "Email already exist.";
      break;
    }

    case "auth/invalid-display-name": {
      errorMessage += "Invalid Name";
      break;
    }

    case "auth/invalid-email-verified":
    case "auth/invalid-email": {
      errorMessage += "Invalid Email";
      break;
    }

    case "auth/id-token-expired":
    case "auth/session-cookie-expired": {
      errorMessage += "Permission Expired, Please Login again.";
      break;
    }

    case "auth/invalid-login-credentials": {
      errorMessage += "Incorrect credentials.";
      break;
    }

    case "permission-denied": {
      errorMessage += "UnAuthorized!";
      break;
    }

    case "not-found": {
      errorMessage += "NOT FOUND.";
      break;
    }

    case "unknown": {
      errorMessage += "Unknown error has accured.";
      break;
    }

    case "unauthenticated": {
      errorMessage += "Permission Expired, Please Login again.";
      break;
    }

    default:
      errorMessage = message;
  }
  const authPermissionErrors = [
    "auth/id-token-expired",
    "auth/invalid-id-token",
    "auth/session-cookie-expired",
    "unauthenticated",
  ];

  let shouldReLogin = false;
  if (code) {
    shouldReLogin = authPermissionErrors.includes(code);
  }
  return {
    errorMsg: errorMessage,
    shouldReLogin,
  };
}
