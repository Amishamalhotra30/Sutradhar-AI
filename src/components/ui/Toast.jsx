import { toast } from "react-hot-toast";

/**
 * Toast Component
 *
 * Displays success notification.
 */

export const showToast = () => {
  toast.success("Action completed successfully!");
};