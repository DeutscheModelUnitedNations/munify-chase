"use client";
import React, { createContext, useContext, useRef } from "react";
import { Toast, ToastMessage } from "primereact/toast";

export const ToastContext = createContext({} as ToastContextType);
export const useToast = () => useContext(ToastContext);

/**
 * This Component provides a context for the Toast Component from PrimeReact.
 * It is used to show messages to the user, for example when a document was successfully created.
 */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useRef<Toast>();

  const showToast = (message: ToastMessage) => {
    toast.current?.show(message);
  };

  const clearToast = () => {
    toast.current?.clear();
  };

  return (
    <ToastContext.Provider value={{ showToast, clearToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export interface ToastContextType {
  showToast: (message: ToastMessage) => void;
  clearToast: () => void;
}
