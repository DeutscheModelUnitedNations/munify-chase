import { $Enums } from "../../backend/prisma/generated/client";
import { TranslationFunctions } from "./i18n-types";

export const conferenceRoleTranslation = (
  LL: TranslationFunctions,
  role: $Enums.ConferenceRole,
) => {
  switch (role) {
    case $Enums.ConferenceRole.ADMIN:
      return LL.roles.ADMIN();
    case $Enums.ConferenceRole.SECRETARIAT:
      return LL.roles.SECRETARIAT();
    case $Enums.ConferenceRole.CHAIR:
      return LL.roles.CHAIR();
    case $Enums.ConferenceRole.COMMITTEE_ADVISOR:
      return LL.roles.COMMITTEE_ADVISOR();
    case $Enums.ConferenceRole.PARTICIPANT_CARE:
      return LL.roles.PARTICIPANT_CARE();
    case $Enums.ConferenceRole.MISCELLANEOUS_TEAM:
      return LL.roles.MISCELLANEOUS_TEAM();
    case $Enums.ConferenceRole.PRESS_CORPS:
      return LL.roles.PRESS_CORPS();
    case $Enums.ConferenceRole.NON_STATE_ACTOR:
      return LL.roles.NON_STATE_ACTOR();
    case $Enums.ConferenceRole.GUEST:
      return LL.roles.GUEST();
    default:
      return LL.roles.UNKNOWN();
  }
};
