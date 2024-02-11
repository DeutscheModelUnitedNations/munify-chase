import { useEffect, useState } from "react";

export default function Timer ({
  until,
  showTimerToast,
}: {
  until: Date | null | undefined;
  showTimerToast?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (until) {
      const interval = setInterval(() => {
        const diff = until.getTime() - Date.now();
        if (diff > 0) {
          setTimeLeft(diff);
        } else {
          setTimeLeft(0);
          showTimerToast && showTimerToast();
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [until]);

  if (timeLeft === 0) {
    return <span>00:00</span>;
  }

  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="tabular-nums">
      {hours > 0 && hours.toString().padStart(2, "0")}{hours > 0 && ":"}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}