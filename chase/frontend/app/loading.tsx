"use client";
import React, { Suspense } from "react";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

export default function Loading() {
    return (
        <div className="flex flex-col justify-center align-center">
            <h1>Chase</h1>
            <p>Loading...</p>
        </div>
    );
}
