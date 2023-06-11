import React, { useEffect, useContext } from "react";
import WidgetTemplate from "./widget_template";
import { ToastContext } from "@components/messages/toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faCirclePause } from "@fortawesome/free-solid-svg-icons";

export default function TimerWidget({
  headline,
  until,
  category,
}: {
  headline: string;
  until: Date | null;
  category: "formal" | "informal" | "pause" | "suspension"; // TODO replace with typescript enum
}) {
  const { showToast } = useContext(ToastContext);

  const showTimerToast = () => {
    const message = {
      summary: "Zeit abgelaufen",
      detail: "Rückkehr zur formellen Sitzung",
      severity: "info" as "info",
      sticky: true,
    };
    showToast(message);
  };

  const timeStamp = until?.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const styles = () => {
    switch (category) {
      case "formal":
        return "";
      case "informal":
        return "bg-red-500 text-white";
      case "pause":
        return "bg-secondary text-white";
      case "suspension":
        return "bg-gray-700 text-white";
    }
  };

  return (
    <>
      <WidgetTemplate cardTitle="" styles={styles()}>
        <div className="flex flex-col justify-center items-center">
          <div className="my-4">
            {category === "formal" && (
              <FontAwesomeIcon icon={faGavel} size="3x" />
            )}
            {category === "informal" && (
              <FontAwesomeIcon icon={faComments} size="3x" />
            )}
            {category === "pause" && (
              <FontAwesomeIcon icon={faCoffee} size="3x" />
            )}
            {category === "suspension" && (
              <FontAwesomeIcon icon={faCirclePause} size="3x" />
            )}
          </div>
          <div className="text-2xl font-bold">{headline}</div>
          {category !== "suspension" && (
            <div className="text-md">Bis {timeStamp} Uhr</div>
          )}
          {category !== "suspension" && category !== "formal" && (
            <div className="text-4xl font-bold my-2 tabular-nums">
              <Timer until={until} showTimerToast={showTimerToast} />
            </div>
          )}
        </div>
      </WidgetTemplate>
    </>
  );
}

function Timer({
  until,
  showTimerToast,
}: { until: Date | null; showTimerToast: () => void }) {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  useEffect(() => {
    if (until) {
      const interval = setInterval(() => {
        const diff = until.getTime() - Date.now();
        if (diff > 0) {
          setTimeLeft(diff);
        } else {
          setTimeLeft(null);
          showTimerToast();
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [until]);

  if (timeLeft === null) {
    return <span>00:00</span>;
  }

  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span>
      {hours > 0 && hours.toString().padStart(2, "0")} {hours > 0 && ":"}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}
