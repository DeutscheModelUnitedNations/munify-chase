import { writable } from "svelte/store";

export interface AlertDialogData {
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
  onClose?: () => void;
  onConfirm?: () => void;
}

export const alertDialogStore = writable<AlertDialogData | null>(null);

export function alertDialog({
  title,
  description = "",
  cancelText = "Cancel",
  confirmText = "OK",
  confirmColor = "primary",
}: AlertDialogData): Promise<boolean> {
  return new Promise((resolve) => {
    alertDialogStore.set({
      title,
      description,
      cancelText,
      confirmText,
      confirmColor,
      onClose: () => {
        alertDialogStore.set(null);
        resolve(false);
      },
      onConfirm: () => {
        alertDialogStore.set(null);
        resolve(true);
      },
    });
  });
}
