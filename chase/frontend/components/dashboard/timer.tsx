import React, { useEffect, useContext } from "react";
import WidgetTemplate from "@components/widget_template";
import { ToastContext } from "@/contexts/messages/toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faComments, faCoffee, faCirclePause } from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { AnimatePresence, motion } from "framer-motion";

interface TimerWidgetProps {
  headline: string;
  until: Date | null;
  category: "formal" | "informal" | "pause" | "suspension"; // TODO: use enum
}

/**
 * This Component is used in the Dashboard. It shows the current timer status –
 * e.g. for informal sessions, breaks, suspensions, etc.
 * With this widget, participants can see the end time of the current session as well as a countdown.
 */

export default function TimerWidget({
  headline,
  until,
  category,
}: TimerWidgetProps) {
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);

  const showTimerToast = () => {
    const message = {
      summary: LL.participants.dashboard.timerWidget.TOAST_HEADLINE(),
      detail: LL.participants.dashboard.timerWidget.TOAST_MESSAGE(),
      severity: "info" as "info",
      sticky: true,
    };
    showToast(message);
  };

  const timeStamp = until?.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getClassNames = () => {
    switch (category) {
      case "formal":
        return "";
      case "informal":
        return "bg-red-500 dark:bg-red-800 text-white dark:text-primary-950";
      case "pause":
        return "bg-secondary dark:bg-secondary-300 text-white dark:text-secondary-100";
      case "suspension":
        return "bg-primary-300 dark:bg-primary-700 text-primary-300 dark:text-primary-200";
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <WidgetTemplate cardTitle="" additionalClassNames={getClassNames()}>
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
                <div className="text-md">
                  {LL.participants.dashboard.timerWidget.UNTIL_1()} {timeStamp}{" "}
                  {LL.participants.dashboard.timerWidget.UNTIL_2()}
                </div>
              )}
              {category !== "suspension" && category !== "formal" && (
                <div className="text-4xl font-bold my-2 tabular-nums">
                  <Timer until={until} showTimerToast={showTimerToast} />
                </div>
              )}
            </div>
          </WidgetTemplate>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function Timer({
  until,
  showTimerToast,
}: {
  until: Date | null;
  showTimerToast: () => void;
}) {
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
