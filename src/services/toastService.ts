import { toast } from "react-toastify";

class ToastService {
  error(errorMsg: string) {
    toast.error(errorMsg);
  }

  info(msg: string) {
    toast.info(msg);
  }

  success(msg: string) {
    toast.success(msg);
  }
}

export const toastService = new ToastService();
