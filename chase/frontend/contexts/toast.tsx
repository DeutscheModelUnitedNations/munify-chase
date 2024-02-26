"use client";
import React, { createContext, useContext, useRef } from "react";
import { Toast, ToastMessage } from "primereact/toast";
import { useI18nContext } from "@/i18n/i18n-react";

export const ToastContext = createContext({} as ToastContextType);
export const useToast = () => useContext(ToastContext);

/**
 * This Component provides a context for the Toast Component from PrimeReact.
 * It is used to show messages to the user, for example when a document was successfully created.
 */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useRef<Toast>(null);
  const { LL } = useI18nContext();

  const showToast = (message: ToastMessage) => {
    toast.current?.show(message);
  };

  const clearToast = () => {
    toast.current?.clear();
  };

  const toastError = (error: Error) => {
    console.error("Generic Error: ", error);
    showToast({
      severity: "error",
      summary: LL.admin.onboarding.error.title(),
      detail: LL.admin.onboarding.error.generic(),
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, clearToast, toastError }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export interface ToastContextType {
  showToast: (message: ToastMessage) => void;
  clearToast: () => void;
  toastError: (error: Error) => void;
}
