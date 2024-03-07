import React, { useState, useContext } from "react";
import WidgetTemplate from "@components/widget_template";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faExclamationTriangle,
  faGavel,
  faInfoCircle,
  faPaperPlane,
  faPodium,
  faQuestionCircle,
  faUserTie,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  CommitteeIdContext,
  CommitteeDataContext,
  AgendaItemContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { MyDelegationContext, useUserIdent } from "@/contexts/user_ident";
import { useBackend } from "@/contexts/backend";
import { useToast } from "@/contexts/toast";
import { $Enums } from "../../../backend/prisma/generated/client";
import {
  ActionsOverlayChairMessage,
  ActionsOverlayResearchService,
} from "./actions_overlay";

interface DropdownOptions {
  label: string;
  value: $Enums.MessageCategory;
  icon: IconProp;
}

/**
 * This Component is used in the Actions Widget on the Dashboard.
 * The buttons of the widget open a dialog with a simple form that allows the user to contact the chair or the research team.
 */

export default function ActionsWidget() {
  const { LL } = useI18nContext();
  const { backend } = useBackend();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);
  const committeeData = useContext(CommitteeDataContext);
  const myDelegationData = useContext(MyDelegationContext);
  const agendaItem = useContext(AgendaItemContext);
  const { userIdent } = useUserIdent();
  const { showToast } = useToast();

  const [displayChairDialog, setDisplayChairDialog] = useState(false);
  const [displayResearchDialog, setDisplayResearchDialog] = useState(false);

  return (
    <>
      <ActionsOverlayChairMessage
        showOverlay={displayChairDialog}
        setShowOverlay={setDisplayChairDialog}
      />
      <ActionsOverlayResearchService
        showOverlay={displayResearchDialog}
        setShowOverlay={setDisplayResearchDialog}
      />
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.ACTIONS()}
      >
        <div className="flex-1 flex gap-2">
          <Button
            label={LL.participants.dashboard.actionsWidget.CHAIR_BUTTON()}
            className="flex-1"
            icon={<FontAwesomeIcon icon={faGavel as IconProp} />}
            severity="warning"
            onClick={() => setDisplayChairDialog(true)}
          />
          <Button
            label={LL.participants.dashboard.actionsWidget.RESEARCH_SERVICE_BUTTON()}
            className="flex-1"
            icon={<FontAwesomeIcon icon={faPaperPlane as IconProp} />}
            severity="help"
            onClick={() => setDisplayResearchDialog(true)}
          />
        </div>
      </WidgetTemplate>
    </>
  );
}
