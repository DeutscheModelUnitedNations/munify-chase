import { m } from "$lib/paraglide/messages";

export function promiseToastStrings(
  targetName: string,
  action?: "create" | "delete" | "update" | "add",
) {
  switch (action) {
    case "create":
      return {
        loading: m.toastCreateLoading({ targetName }),
        success: m.toastCreateSuccess({ targetName }),
        error: m.toastCreateError({ targetName }),
      };
    case "delete":
      return {
        loading: m.toastDeleteLoading({ targetName }),
        success: m.toastDeleteSuccess({ targetName }),
        error: m.toastDeleteError({ targetName }),
      };
    case "update":
      return {
        loading: m.toastUpdateLoading({ targetName }),
        success: m.toastUpdateSuccess({ targetName }),
        error: m.toastUpdateError({ targetName }),
      };
    case "add":
      return {
        loading: m.toastAddLoading({ targetName }),
        success: m.toastAddSuccess({ targetName }),
        error: m.toastAddError({ targetName }),
      };
    default:
      return {
        loading: m.toastLoading({ targetName }),
        success: m.toastSuccess({ targetName }),
        error: m.toastError({ targetName }),
      };
  }
}
