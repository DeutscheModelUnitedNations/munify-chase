
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.14.0
 * Query Engine version: e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
 */
Prisma.prismaVersion = {
  client: "5.14.0",
  engine: "e9771e62de70f79a5e1c604a2d7c8e2a0a874b48"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id'
};

exports.Prisma.ConferenceCreationTokenScalarFieldEnum = {
  token: 'token'
};

exports.Prisma.ConferenceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  start: 'start',
  end: 'end',
  pressWebsite: 'pressWebsite',
  feedbackWebsite: 'feedbackWebsite'
};

exports.Prisma.ConferenceMemberScalarFieldEnum = {
  id: 'id',
  conferenceId: 'conferenceId',
  userId: 'userId',
  role: 'role'
};

exports.Prisma.CommitteeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  abbreviation: 'abbreviation',
  category: 'category',
  conferenceId: 'conferenceId',
  parentId: 'parentId',
  whiteboardContent: 'whiteboardContent',
  status: 'status',
  stateOfDebate: 'stateOfDebate',
  statusHeadline: 'statusHeadline',
  statusUntil: 'statusUntil',
  allowDelegationsToAddThemselvesToSpeakersList: 'allowDelegationsToAddThemselvesToSpeakersList'
};

exports.Prisma.CommitteeMemberScalarFieldEnum = {
  id: 'id',
  committeeId: 'committeeId',
  userId: 'userId',
  delegationId: 'delegationId',
  presence: 'presence'
};

exports.Prisma.AgendaItemScalarFieldEnum = {
  id: 'id',
  committeeId: 'committeeId',
  title: 'title',
  description: 'description',
  isActive: 'isActive'
};

exports.Prisma.SpeakersListScalarFieldEnum = {
  id: 'id',
  agendaItemId: 'agendaItemId',
  type: 'type',
  speakingTime: 'speakingTime',
  timeLeft: 'timeLeft',
  startTimestamp: 'startTimestamp',
  isClosed: 'isClosed'
};

exports.Prisma.SpeakerOnListScalarFieldEnum = {
  id: 'id',
  speakersListId: 'speakersListId',
  committeeMemberId: 'committeeMemberId',
  position: 'position'
};

exports.Prisma.DelegationScalarFieldEnum = {
  id: 'id',
  conferenceId: 'conferenceId',
  nationId: 'nationId'
};

exports.Prisma.NationScalarFieldEnum = {
  id: 'id',
  alpha3Code: 'alpha3Code',
  variant: 'variant'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  subject: 'subject',
  category: 'category',
  message: 'message',
  committeeId: 'committeeId',
  authorId: 'authorId',
  timestamp: 'timestamp',
  status: 'status',
  forwarded: 'forwarded',
  metaEmail: 'metaEmail',
  metaDelegation: 'metaDelegation',
  metaCommittee: 'metaCommittee',
  metaAgendaItem: 'metaAgendaItem'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.ConferenceRole = exports.$Enums.ConferenceRole = {
  ADMIN: 'ADMIN',
  SECRETARIAT: 'SECRETARIAT',
  CHAIR: 'CHAIR',
  COMMITTEE_ADVISOR: 'COMMITTEE_ADVISOR',
  NON_STATE_ACTOR: 'NON_STATE_ACTOR',
  PRESS_CORPS: 'PRESS_CORPS',
  GUEST: 'GUEST',
  PARTICIPANT_CARE: 'PARTICIPANT_CARE',
  MISCELLANEOUS_TEAM: 'MISCELLANEOUS_TEAM'
};

exports.CommitteeCategory = exports.$Enums.CommitteeCategory = {
  COMMITTEE: 'COMMITTEE',
  CRISIS: 'CRISIS',
  ICJ: 'ICJ'
};

exports.CommitteeStatus = exports.$Enums.CommitteeStatus = {
  FORMAL: 'FORMAL',
  INFORMAL: 'INFORMAL',
  PAUSE: 'PAUSE',
  SUSPENSION: 'SUSPENSION',
  CLOSED: 'CLOSED'
};

exports.Presence = exports.$Enums.Presence = {
  PRESENT: 'PRESENT',
  EXCUSED: 'EXCUSED',
  ABSENT: 'ABSENT'
};

exports.SpeakersListCategory = exports.$Enums.SpeakersListCategory = {
  SPEAKERS_LIST: 'SPEAKERS_LIST',
  COMMENT_LIST: 'COMMENT_LIST',
  MODERATED_CAUCUS: 'MODERATED_CAUCUS'
};

exports.NationVariant = exports.$Enums.NationVariant = {
  NATION: 'NATION',
  NON_STATE_ACTOR: 'NON_STATE_ACTOR',
  SPECIAL_PERSON: 'SPECIAL_PERSON'
};

exports.MessageCategory = exports.$Enums.MessageCategory = {
  TO_CHAIR: 'TO_CHAIR',
  GUEST_SPEAKER: 'GUEST_SPEAKER',
  FACT_CHECK: 'FACT_CHECK',
  INFORMATION: 'INFORMATION',
  GENERAL_SECRETARY: 'GENERAL_SECRETARY',
  OTHER: 'OTHER'
};

exports.MessageStatus = exports.$Enums.MessageStatus = {
  UNREAD: 'UNREAD',
  PRIORITY: 'PRIORITY',
  ASSIGNED: 'ASSIGNED',
  ARCHIVED: 'ARCHIVED'
};

exports.Prisma.ModelName = {
  User: 'User',
  ConferenceCreationToken: 'ConferenceCreationToken',
  Conference: 'Conference',
  ConferenceMember: 'ConferenceMember',
  Committee: 'Committee',
  CommitteeMember: 'CommitteeMember',
  AgendaItem: 'AgendaItem',
  SpeakersList: 'SpeakersList',
  SpeakerOnList: 'SpeakerOnList',
  Delegation: 'Delegation',
  Nation: 'Nation',
  Message: 'Message'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
