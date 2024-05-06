import { useBackend } from "@/contexts/backend";
import { ConferenceIdContext } from "@/contexts/committee_data";
import { useBackendCall } from "@/hooks/useBackendCall";
import { useI18nContext } from "@/i18n/i18n-react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCommentExclamation,
  faNewspaper,
} from "@fortawesome/pro-solid-svg-icons";
import { useContext } from "react";
import NavButton from "./button";

export default function ExternalLinks() {
  const { backend } = useBackend();
  const conferenceId = useContext(ConferenceIdContext);
  const { LL } = useI18nContext();

  const [conferenceData] = useBackendCall(() => {
    //TODO
    // biome-ignore lint/style/noNonNullAssertion:
    return backend.conference({ conferenceId: conferenceId! }).get();
  }, false);

  return (
    <>
      {conferenceData?.pressWebsite && (
        <NavButton
          icon={faNewspaper as IconProp}
          newWindow
          link={conferenceData?.pressWebsite ?? "/"}
          title={LL.navbar.NEWS()}
        />
      )}
      {conferenceData?.feedbackWebsite && (
        <NavButton
          icon={faCommentExclamation as IconProp}
          newWindow
          link={conferenceData?.feedbackWebsite ?? "/"}
          title={LL.navbar.BUG_REPORT()}
        />
      )}
    </>
  );
}
