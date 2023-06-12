import React from "react";

export default function HeaderTemplate({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className=" h-32 bg-gray-300 flex justify-between items-center p-4">
            {children}
        </div>
        </>
    );
    }