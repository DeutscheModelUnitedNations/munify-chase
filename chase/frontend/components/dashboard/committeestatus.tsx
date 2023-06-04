import React from "react";
import WidgetTemplate from "./widgettemplate";

export default function CommitteeStatusWidget() {
  return (
    <>
      <WidgetTemplate cardTitle="Stand der Debatte">
        Hier wird dann einmal eine Übersicht stehen, die auf den aktuellen
        Verfahrensstand hinweist. Das ist sehr wichtig, denn dann kann jeder,
        der mal zu spät kommt oder so direkt sehen, wo sich das Committee gerade
        im Verfahren befindet.
      </WidgetTemplate>
    </>
  );
}
