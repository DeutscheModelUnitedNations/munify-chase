import React, { useEffect, useContext } from "react";
import WidgetTemplate from "@components/widget_template";
import { ToastContext } from "@/contexts/toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faComments,
  faCoffee,
  faCirclePause,
  faQuestion,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { AnimatePresence, motion } from "framer-motion";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import en from "@/i18n/en";
import { Skeleton } from "primereact/skeleton";

type Category =
  | "FORMAL"
  | "INFORMAL"
  | "PAUSE"
  | "SUSPENSION"
  | "CLOSED"
  | undefined;

interface TimerWidgetProps {
  headline: string | null | undefined;
  until: string | null | undefined;
  category: Category;
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
      severity: "info" as const,
      sticky: true,
    };
    showToast(message);
  };

  const timeStamp = () => {
    if (until) {
      try {
        return new Date(until).toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  const getClassNames = () => {
    switch (category) {
      case "FORMAL":
        return "";
      case "INFORMAL":
        return "bg-red-500 dark:bg-red-800 text-white dark:text-primary-950";
      case "PAUSE":
        return "bg-secondary dark:bg-secondary-300 text-white dark:text-secondary-100";
      case "SUSPENSION":
        return "bg-primary-300 dark:bg-primary-700 text-primary-300 dark:text-primary-200";
    }
  };

  const getIcon: () => IconProp = () => {
    switch (category) {
      case "FORMAL":
        return faGavel as IconProp;
      case "INFORMAL":
        return faComments as IconProp;
      case "PAUSE":
        return faCoffee as IconProp;
      case "SUSPENSION":
        return faCirclePause as IconProp;
      default:
        return faQuestion as IconProp;
    }
  };

  const getHeadline: () => string = () => {
    if (headline) return headline;
    switch (category) {
      case "FORMAL":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.FORMAL();
      case "INFORMAL":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.INFORMAL();
      case "PAUSE":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.PAUSE();
      case "SUSPENSION":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.SUSPENSION();
      default:
        return "";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        {category ? (
          category !== "CLOSED" && (
            <WidgetTemplate cardTitle="" additionalClassNames={getClassNames()}>
              <div className="flex flex-col justify-center items-center">
                <div className="my-4">
                  <FontAwesomeIcon icon={getIcon()} size="3x" />
                </div>
                <div className="text-2xl font-bold">{getHeadline()}</div>
                {until && (
                  <div className="text-md">
                    {LL.participants.dashboard.timerWidget.UNTIL_1()}{" "}
                    {timeStamp()}{" "}
                    {LL.participants.dashboard.timerWidget.UNTIL_2()}
                  </div>
                )}
                {(category === "INFORMAL" || category === "PAUSE") && until && (
                  <div className="text-4xl font-bold my-2 tabular-nums">
                    <Timer until={until} showTimerToast={showTimerToast} />
                  </div>
                )}
              </div>
            </WidgetTemplate>
          )
        ) : (
          <Skeleton width="100%" height="10rem" />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function Timer({
  until,
  showTimerToast,
}: {
  until: string | null | undefined;
  showTimerToast: () => void;
}) {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  useEffect(() => {
    if (until) {
      const interval = setInterval(() => {
        const diff = new Date(until).getTime() - Date.now();
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
