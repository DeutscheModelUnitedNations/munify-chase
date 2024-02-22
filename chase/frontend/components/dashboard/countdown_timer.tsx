import { StatusTimer } from "@/contexts/status_timer";
import { useContext, useEffect, useState } from "react";

export default function Timer() {
  const { displayTime } = useContext(StatusTimer);

  return (
    <span className="tabular-nums">{displayTime ? displayTime : "00:00"}</span>
  );
}
