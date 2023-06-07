import React from "react";
import WidgetTemplate from "./widgettemplate";
import { Button } from "primereact/button";
import { faGavel, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionsWidget() {
  return (
    <>
      <WidgetTemplate cardTitle="Anfrage senden">
        <div className="flex-1 flex gap-2">
          <Button
            label="Vorsitz"
            className="flex-1"
            icon={<FontAwesomeIcon icon={faGavel} />}
            severity="warning"
          />
          <Button
            label="Wiss. Dienst"
            className="flex-1"
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
            severity="help"
          />
        </div>
      </WidgetTemplate>
    </>
  );
}
