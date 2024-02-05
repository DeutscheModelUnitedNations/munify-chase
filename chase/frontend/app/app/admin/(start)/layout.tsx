"use client";
import { ToastProvider } from "@/contexts/toast";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex justify-center items-center h-screen bg-primary">
        <div className="flex-1 flex flex-col justify-center items-center m-10">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
