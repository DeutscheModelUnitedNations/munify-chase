import { clientCreator } from "$api/rumble";
import { building, dev } from "$app/environment";

import "./agendaItem";
import "./committee";
import "./committeeMember";
import "./conference";
import "./conferenceMember";
import "./conferenceUser";
import "./representation";
import "./speakerOnList";
import "./speakersList";
import "./time";
import "./user";
import "./import";
import "./presenceChangedTimestamp";

if (dev || building) {
  clientCreator({
    outputPath: "src/lib/api/rumbleClient",
    apiUrl: "/api/graphql",
    useExternalUrqlClient: "../customClient",
  });
}
