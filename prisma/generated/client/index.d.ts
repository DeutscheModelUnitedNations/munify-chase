
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * A user in the system
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ConferenceCreationToken
 * Consumeable token which grants the creation of a conference
 */
export type ConferenceCreationToken = $Result.DefaultSelection<Prisma.$ConferenceCreationTokenPayload>
/**
 * Model Conference
 * A conference in the system
 */
export type Conference = $Result.DefaultSelection<Prisma.$ConferencePayload>
/**
 * Model ConferenceMember
 * A users membership in a conference, providing them with a role in the conference
 */
export type ConferenceMember = $Result.DefaultSelection<Prisma.$ConferenceMemberPayload>
/**
 * Model Committee
 * A committee in a conference
 */
export type Committee = $Result.DefaultSelection<Prisma.$CommitteePayload>
/**
 * Model CommitteeMember
 * A users membership in a committee, providing them with a role in the committee
 */
export type CommitteeMember = $Result.DefaultSelection<Prisma.$CommitteeMemberPayload>
/**
 * Model AgendaItem
 * An agenda item in a committee. This is a topic of discussion in a committee.
 */
export type AgendaItem = $Result.DefaultSelection<Prisma.$AgendaItemPayload>
/**
 * Model SpeakersList
 * A speakers list in a committee
 */
export type SpeakersList = $Result.DefaultSelection<Prisma.$SpeakersListPayload>
/**
 * Model SpeakerOnList
 * A speaker on a speakers list, storing their position in the list
 */
export type SpeakerOnList = $Result.DefaultSelection<Prisma.$SpeakerOnListPayload>
/**
 * Model Delegation
 * 
 */
export type Delegation = $Result.DefaultSelection<Prisma.$DelegationPayload>
/**
 * Model Nation
 * A nation in the system. E.g. Germany
 */
export type Nation = $Result.DefaultSelection<Prisma.$NationPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ConferenceRole: {
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

export type ConferenceRole = (typeof ConferenceRole)[keyof typeof ConferenceRole]


export const CommitteeCategory: {
  COMMITTEE: 'COMMITTEE',
  CRISIS: 'CRISIS',
  ICJ: 'ICJ'
};

export type CommitteeCategory = (typeof CommitteeCategory)[keyof typeof CommitteeCategory]


export const CommitteeStatus: {
  FORMAL: 'FORMAL',
  INFORMAL: 'INFORMAL',
  PAUSE: 'PAUSE',
  SUSPENSION: 'SUSPENSION',
  CLOSED: 'CLOSED'
};

export type CommitteeStatus = (typeof CommitteeStatus)[keyof typeof CommitteeStatus]


export const Presence: {
  PRESENT: 'PRESENT',
  EXCUSED: 'EXCUSED',
  ABSENT: 'ABSENT'
};

export type Presence = (typeof Presence)[keyof typeof Presence]


export const SpeakersListCategory: {
  SPEAKERS_LIST: 'SPEAKERS_LIST',
  COMMENT_LIST: 'COMMENT_LIST',
  MODERATED_CAUCUS: 'MODERATED_CAUCUS'
};

export type SpeakersListCategory = (typeof SpeakersListCategory)[keyof typeof SpeakersListCategory]


export const NationVariant: {
  NATION: 'NATION',
  NON_STATE_ACTOR: 'NON_STATE_ACTOR',
  SPECIAL_PERSON: 'SPECIAL_PERSON'
};

export type NationVariant = (typeof NationVariant)[keyof typeof NationVariant]


export const MessageCategory: {
  TO_CHAIR: 'TO_CHAIR',
  GUEST_SPEAKER: 'GUEST_SPEAKER',
  FACT_CHECK: 'FACT_CHECK',
  INFORMATION: 'INFORMATION',
  GENERAL_SECRETARY: 'GENERAL_SECRETARY',
  OTHER: 'OTHER'
};

export type MessageCategory = (typeof MessageCategory)[keyof typeof MessageCategory]


export const MessageStatus: {
  UNREAD: 'UNREAD',
  PRIORITY: 'PRIORITY',
  ASSIGNED: 'ASSIGNED',
  ARCHIVED: 'ARCHIVED'
};

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]

}

export type ConferenceRole = $Enums.ConferenceRole

export const ConferenceRole: typeof $Enums.ConferenceRole

export type CommitteeCategory = $Enums.CommitteeCategory

export const CommitteeCategory: typeof $Enums.CommitteeCategory

export type CommitteeStatus = $Enums.CommitteeStatus

export const CommitteeStatus: typeof $Enums.CommitteeStatus

export type Presence = $Enums.Presence

export const Presence: typeof $Enums.Presence

export type SpeakersListCategory = $Enums.SpeakersListCategory

export const SpeakersListCategory: typeof $Enums.SpeakersListCategory

export type NationVariant = $Enums.NationVariant

export const NationVariant: typeof $Enums.NationVariant

export type MessageCategory = $Enums.MessageCategory

export const MessageCategory: typeof $Enums.MessageCategory

export type MessageStatus = $Enums.MessageStatus

export const MessageStatus: typeof $Enums.MessageStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.conferenceCreationToken`: Exposes CRUD operations for the **ConferenceCreationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConferenceCreationTokens
    * const conferenceCreationTokens = await prisma.conferenceCreationToken.findMany()
    * ```
    */
  get conferenceCreationToken(): Prisma.ConferenceCreationTokenDelegate<ExtArgs>;

  /**
   * `prisma.conference`: Exposes CRUD operations for the **Conference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conferences
    * const conferences = await prisma.conference.findMany()
    * ```
    */
  get conference(): Prisma.ConferenceDelegate<ExtArgs>;

  /**
   * `prisma.conferenceMember`: Exposes CRUD operations for the **ConferenceMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConferenceMembers
    * const conferenceMembers = await prisma.conferenceMember.findMany()
    * ```
    */
  get conferenceMember(): Prisma.ConferenceMemberDelegate<ExtArgs>;

  /**
   * `prisma.committee`: Exposes CRUD operations for the **Committee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Committees
    * const committees = await prisma.committee.findMany()
    * ```
    */
  get committee(): Prisma.CommitteeDelegate<ExtArgs>;

  /**
   * `prisma.committeeMember`: Exposes CRUD operations for the **CommitteeMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommitteeMembers
    * const committeeMembers = await prisma.committeeMember.findMany()
    * ```
    */
  get committeeMember(): Prisma.CommitteeMemberDelegate<ExtArgs>;

  /**
   * `prisma.agendaItem`: Exposes CRUD operations for the **AgendaItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgendaItems
    * const agendaItems = await prisma.agendaItem.findMany()
    * ```
    */
  get agendaItem(): Prisma.AgendaItemDelegate<ExtArgs>;

  /**
   * `prisma.speakersList`: Exposes CRUD operations for the **SpeakersList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpeakersLists
    * const speakersLists = await prisma.speakersList.findMany()
    * ```
    */
  get speakersList(): Prisma.SpeakersListDelegate<ExtArgs>;

  /**
   * `prisma.speakerOnList`: Exposes CRUD operations for the **SpeakerOnList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpeakerOnLists
    * const speakerOnLists = await prisma.speakerOnList.findMany()
    * ```
    */
  get speakerOnList(): Prisma.SpeakerOnListDelegate<ExtArgs>;

  /**
   * `prisma.delegation`: Exposes CRUD operations for the **Delegation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Delegations
    * const delegations = await prisma.delegation.findMany()
    * ```
    */
  get delegation(): Prisma.DelegationDelegate<ExtArgs>;

  /**
   * `prisma.nation`: Exposes CRUD operations for the **Nation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Nations
    * const nations = await prisma.nation.findMany()
    * ```
    */
  get nation(): Prisma.NationDelegate<ExtArgs>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.14.0
   * Query Engine version: e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'user' | 'conferenceCreationToken' | 'conference' | 'conferenceMember' | 'committee' | 'committeeMember' | 'agendaItem' | 'speakersList' | 'speakerOnList' | 'delegation' | 'nation' | 'message'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ConferenceCreationToken: {
        payload: Prisma.$ConferenceCreationTokenPayload<ExtArgs>
        fields: Prisma.ConferenceCreationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConferenceCreationTokenFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConferenceCreationTokenFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          findFirst: {
            args: Prisma.ConferenceCreationTokenFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConferenceCreationTokenFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          findMany: {
            args: Prisma.ConferenceCreationTokenFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>[]
          }
          create: {
            args: Prisma.ConferenceCreationTokenCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          createMany: {
            args: Prisma.ConferenceCreationTokenCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConferenceCreationTokenCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>[]
          }
          delete: {
            args: Prisma.ConferenceCreationTokenDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          update: {
            args: Prisma.ConferenceCreationTokenUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          deleteMany: {
            args: Prisma.ConferenceCreationTokenDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ConferenceCreationTokenUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ConferenceCreationTokenUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreationTokenPayload>
          }
          aggregate: {
            args: Prisma.ConferenceCreationTokenAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateConferenceCreationToken>
          }
          groupBy: {
            args: Prisma.ConferenceCreationTokenGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceCreationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConferenceCreationTokenCountArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceCreationTokenCountAggregateOutputType> | number
          }
        }
      }
      Conference: {
        payload: Prisma.$ConferencePayload<ExtArgs>
        fields: Prisma.ConferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConferenceFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConferenceFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          findFirst: {
            args: Prisma.ConferenceFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConferenceFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          findMany: {
            args: Prisma.ConferenceFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>[]
          }
          create: {
            args: Prisma.ConferenceCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          createMany: {
            args: Prisma.ConferenceCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConferenceCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>[]
          }
          delete: {
            args: Prisma.ConferenceDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          update: {
            args: Prisma.ConferenceUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          deleteMany: {
            args: Prisma.ConferenceDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ConferenceUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ConferenceUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferencePayload>
          }
          aggregate: {
            args: Prisma.ConferenceAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateConference>
          }
          groupBy: {
            args: Prisma.ConferenceGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConferenceCountArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceCountAggregateOutputType> | number
          }
        }
      }
      ConferenceMember: {
        payload: Prisma.$ConferenceMemberPayload<ExtArgs>
        fields: Prisma.ConferenceMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConferenceMemberFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConferenceMemberFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          findFirst: {
            args: Prisma.ConferenceMemberFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConferenceMemberFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          findMany: {
            args: Prisma.ConferenceMemberFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>[]
          }
          create: {
            args: Prisma.ConferenceMemberCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          createMany: {
            args: Prisma.ConferenceMemberCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConferenceMemberCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>[]
          }
          delete: {
            args: Prisma.ConferenceMemberDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          update: {
            args: Prisma.ConferenceMemberUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          deleteMany: {
            args: Prisma.ConferenceMemberDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ConferenceMemberUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ConferenceMemberUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceMemberPayload>
          }
          aggregate: {
            args: Prisma.ConferenceMemberAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateConferenceMember>
          }
          groupBy: {
            args: Prisma.ConferenceMemberGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConferenceMemberCountArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceMemberCountAggregateOutputType> | number
          }
        }
      }
      Committee: {
        payload: Prisma.$CommitteePayload<ExtArgs>
        fields: Prisma.CommitteeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommitteeFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommitteeFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          findFirst: {
            args: Prisma.CommitteeFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommitteeFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          findMany: {
            args: Prisma.CommitteeFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>[]
          }
          create: {
            args: Prisma.CommitteeCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          createMany: {
            args: Prisma.CommitteeCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommitteeCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>[]
          }
          delete: {
            args: Prisma.CommitteeDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          update: {
            args: Prisma.CommitteeUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          deleteMany: {
            args: Prisma.CommitteeDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CommitteeUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CommitteeUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteePayload>
          }
          aggregate: {
            args: Prisma.CommitteeAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCommittee>
          }
          groupBy: {
            args: Prisma.CommitteeGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CommitteeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommitteeCountArgs<ExtArgs>,
            result: $Utils.Optional<CommitteeCountAggregateOutputType> | number
          }
        }
      }
      CommitteeMember: {
        payload: Prisma.$CommitteeMemberPayload<ExtArgs>
        fields: Prisma.CommitteeMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommitteeMemberFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommitteeMemberFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          findFirst: {
            args: Prisma.CommitteeMemberFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommitteeMemberFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          findMany: {
            args: Prisma.CommitteeMemberFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>[]
          }
          create: {
            args: Prisma.CommitteeMemberCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          createMany: {
            args: Prisma.CommitteeMemberCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommitteeMemberCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>[]
          }
          delete: {
            args: Prisma.CommitteeMemberDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          update: {
            args: Prisma.CommitteeMemberUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          deleteMany: {
            args: Prisma.CommitteeMemberDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CommitteeMemberUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CommitteeMemberUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CommitteeMemberPayload>
          }
          aggregate: {
            args: Prisma.CommitteeMemberAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCommitteeMember>
          }
          groupBy: {
            args: Prisma.CommitteeMemberGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CommitteeMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommitteeMemberCountArgs<ExtArgs>,
            result: $Utils.Optional<CommitteeMemberCountAggregateOutputType> | number
          }
        }
      }
      AgendaItem: {
        payload: Prisma.$AgendaItemPayload<ExtArgs>
        fields: Prisma.AgendaItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgendaItemFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgendaItemFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          findFirst: {
            args: Prisma.AgendaItemFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgendaItemFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          findMany: {
            args: Prisma.AgendaItemFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>[]
          }
          create: {
            args: Prisma.AgendaItemCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          createMany: {
            args: Prisma.AgendaItemCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgendaItemCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>[]
          }
          delete: {
            args: Prisma.AgendaItemDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          update: {
            args: Prisma.AgendaItemUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          deleteMany: {
            args: Prisma.AgendaItemDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AgendaItemUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AgendaItemUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AgendaItemPayload>
          }
          aggregate: {
            args: Prisma.AgendaItemAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAgendaItem>
          }
          groupBy: {
            args: Prisma.AgendaItemGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AgendaItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgendaItemCountArgs<ExtArgs>,
            result: $Utils.Optional<AgendaItemCountAggregateOutputType> | number
          }
        }
      }
      SpeakersList: {
        payload: Prisma.$SpeakersListPayload<ExtArgs>
        fields: Prisma.SpeakersListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpeakersListFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpeakersListFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          findFirst: {
            args: Prisma.SpeakersListFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpeakersListFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          findMany: {
            args: Prisma.SpeakersListFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>[]
          }
          create: {
            args: Prisma.SpeakersListCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          createMany: {
            args: Prisma.SpeakersListCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpeakersListCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>[]
          }
          delete: {
            args: Prisma.SpeakersListDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          update: {
            args: Prisma.SpeakersListUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          deleteMany: {
            args: Prisma.SpeakersListDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SpeakersListUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SpeakersListUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakersListPayload>
          }
          aggregate: {
            args: Prisma.SpeakersListAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSpeakersList>
          }
          groupBy: {
            args: Prisma.SpeakersListGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SpeakersListGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpeakersListCountArgs<ExtArgs>,
            result: $Utils.Optional<SpeakersListCountAggregateOutputType> | number
          }
        }
      }
      SpeakerOnList: {
        payload: Prisma.$SpeakerOnListPayload<ExtArgs>
        fields: Prisma.SpeakerOnListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpeakerOnListFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpeakerOnListFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          findFirst: {
            args: Prisma.SpeakerOnListFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpeakerOnListFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          findMany: {
            args: Prisma.SpeakerOnListFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>[]
          }
          create: {
            args: Prisma.SpeakerOnListCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          createMany: {
            args: Prisma.SpeakerOnListCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpeakerOnListCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>[]
          }
          delete: {
            args: Prisma.SpeakerOnListDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          update: {
            args: Prisma.SpeakerOnListUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          deleteMany: {
            args: Prisma.SpeakerOnListDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SpeakerOnListUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SpeakerOnListUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SpeakerOnListPayload>
          }
          aggregate: {
            args: Prisma.SpeakerOnListAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSpeakerOnList>
          }
          groupBy: {
            args: Prisma.SpeakerOnListGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SpeakerOnListGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpeakerOnListCountArgs<ExtArgs>,
            result: $Utils.Optional<SpeakerOnListCountAggregateOutputType> | number
          }
        }
      }
      Delegation: {
        payload: Prisma.$DelegationPayload<ExtArgs>
        fields: Prisma.DelegationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DelegationFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DelegationFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          findFirst: {
            args: Prisma.DelegationFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DelegationFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          findMany: {
            args: Prisma.DelegationFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>[]
          }
          create: {
            args: Prisma.DelegationCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          createMany: {
            args: Prisma.DelegationCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DelegationCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>[]
          }
          delete: {
            args: Prisma.DelegationDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          update: {
            args: Prisma.DelegationUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          deleteMany: {
            args: Prisma.DelegationDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DelegationUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DelegationUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DelegationPayload>
          }
          aggregate: {
            args: Prisma.DelegationAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDelegation>
          }
          groupBy: {
            args: Prisma.DelegationGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DelegationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DelegationCountArgs<ExtArgs>,
            result: $Utils.Optional<DelegationCountAggregateOutputType> | number
          }
        }
      }
      Nation: {
        payload: Prisma.$NationPayload<ExtArgs>
        fields: Prisma.NationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NationFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NationFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          findFirst: {
            args: Prisma.NationFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NationFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          findMany: {
            args: Prisma.NationFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>[]
          }
          create: {
            args: Prisma.NationCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          createMany: {
            args: Prisma.NationCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NationCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>[]
          }
          delete: {
            args: Prisma.NationDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          update: {
            args: Prisma.NationUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          deleteMany: {
            args: Prisma.NationDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.NationUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.NationUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$NationPayload>
          }
          aggregate: {
            args: Prisma.NationAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateNation>
          }
          groupBy: {
            args: Prisma.NationGroupByArgs<ExtArgs>,
            result: $Utils.Optional<NationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NationCountArgs<ExtArgs>,
            result: $Utils.Optional<NationCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>,
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    conferenceMemberships: number
    committeeMemberships: number
    messages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conferenceMemberships?: boolean | UserCountOutputTypeCountConferenceMembershipsArgs
    committeeMemberships?: boolean | UserCountOutputTypeCountCommitteeMembershipsArgs
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountConferenceMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConferenceMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommitteeMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type ConferenceCountOutputType
   */

  export type ConferenceCountOutputType = {
    delegations: number
    members: number
    committees: number
  }

  export type ConferenceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delegations?: boolean | ConferenceCountOutputTypeCountDelegationsArgs
    members?: boolean | ConferenceCountOutputTypeCountMembersArgs
    committees?: boolean | ConferenceCountOutputTypeCountCommitteesArgs
  }

  // Custom InputTypes
  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCountOutputType
     */
    select?: ConferenceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeCountDelegationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DelegationWhereInput
  }

  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConferenceMemberWhereInput
  }

  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeCountCommitteesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeWhereInput
  }


  /**
   * Count Type CommitteeCountOutputType
   */

  export type CommitteeCountOutputType = {
    members: number
    subCommittees: number
    messages: number
    agendaItems: number
  }

  export type CommitteeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | CommitteeCountOutputTypeCountMembersArgs
    subCommittees?: boolean | CommitteeCountOutputTypeCountSubCommitteesArgs
    messages?: boolean | CommitteeCountOutputTypeCountMessagesArgs
    agendaItems?: boolean | CommitteeCountOutputTypeCountAgendaItemsArgs
  }

  // Custom InputTypes
  /**
   * CommitteeCountOutputType without action
   */
  export type CommitteeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeCountOutputType
     */
    select?: CommitteeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommitteeCountOutputType without action
   */
  export type CommitteeCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeMemberWhereInput
  }

  /**
   * CommitteeCountOutputType without action
   */
  export type CommitteeCountOutputTypeCountSubCommitteesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeWhereInput
  }

  /**
   * CommitteeCountOutputType without action
   */
  export type CommitteeCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * CommitteeCountOutputType without action
   */
  export type CommitteeCountOutputTypeCountAgendaItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendaItemWhereInput
  }


  /**
   * Count Type CommitteeMemberCountOutputType
   */

  export type CommitteeMemberCountOutputType = {
    speakerLists: number
  }

  export type CommitteeMemberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    speakerLists?: boolean | CommitteeMemberCountOutputTypeCountSpeakerListsArgs
  }

  // Custom InputTypes
  /**
   * CommitteeMemberCountOutputType without action
   */
  export type CommitteeMemberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMemberCountOutputType
     */
    select?: CommitteeMemberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommitteeMemberCountOutputType without action
   */
  export type CommitteeMemberCountOutputTypeCountSpeakerListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakerOnListWhereInput
  }


  /**
   * Count Type AgendaItemCountOutputType
   */

  export type AgendaItemCountOutputType = {
    speakerLists: number
  }

  export type AgendaItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    speakerLists?: boolean | AgendaItemCountOutputTypeCountSpeakerListsArgs
  }

  // Custom InputTypes
  /**
   * AgendaItemCountOutputType without action
   */
  export type AgendaItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItemCountOutputType
     */
    select?: AgendaItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgendaItemCountOutputType without action
   */
  export type AgendaItemCountOutputTypeCountSpeakerListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakersListWhereInput
  }


  /**
   * Count Type SpeakersListCountOutputType
   */

  export type SpeakersListCountOutputType = {
    speakers: number
  }

  export type SpeakersListCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    speakers?: boolean | SpeakersListCountOutputTypeCountSpeakersArgs
  }

  // Custom InputTypes
  /**
   * SpeakersListCountOutputType without action
   */
  export type SpeakersListCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersListCountOutputType
     */
    select?: SpeakersListCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpeakersListCountOutputType without action
   */
  export type SpeakersListCountOutputTypeCountSpeakersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakerOnListWhereInput
  }


  /**
   * Count Type DelegationCountOutputType
   */

  export type DelegationCountOutputType = {
    members: number
  }

  export type DelegationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | DelegationCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * DelegationCountOutputType without action
   */
  export type DelegationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DelegationCountOutputType
     */
    select?: DelegationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DelegationCountOutputType without action
   */
  export type DelegationCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeMemberWhereInput
  }


  /**
   * Count Type NationCountOutputType
   */

  export type NationCountOutputType = {
    delegations: number
  }

  export type NationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delegations?: boolean | NationCountOutputTypeCountDelegationsArgs
  }

  // Custom InputTypes
  /**
   * NationCountOutputType without action
   */
  export type NationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NationCountOutputType
     */
    select?: NationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NationCountOutputType without action
   */
  export type NationCountOutputTypeCountDelegationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DelegationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conferenceMemberships?: boolean | User$conferenceMembershipsArgs<ExtArgs>
    committeeMemberships?: boolean | User$committeeMembershipsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
  }


  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conferenceMemberships?: boolean | User$conferenceMembershipsArgs<ExtArgs>
    committeeMemberships?: boolean | User$committeeMembershipsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      conferenceMemberships: Prisma.$ConferenceMemberPayload<ExtArgs>[]
      committeeMemberships: Prisma.$CommitteeMemberPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }


  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends UserCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    conferenceMemberships<T extends User$conferenceMembershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$conferenceMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findMany'> | Null>;

    committeeMemberships<T extends User$committeeMembershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$committeeMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findMany'> | Null>;

    messages<T extends User$messagesArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.conferenceMemberships
   */
  export type User$conferenceMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    where?: ConferenceMemberWhereInput
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    cursor?: ConferenceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConferenceMemberScalarFieldEnum | ConferenceMemberScalarFieldEnum[]
  }

  /**
   * User.committeeMemberships
   */
  export type User$committeeMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    where?: CommitteeMemberWhereInput
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    cursor?: CommitteeMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * User.messages
   */
  export type User$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ConferenceCreationToken
   */

  export type AggregateConferenceCreationToken = {
    _count: ConferenceCreationTokenCountAggregateOutputType | null
    _min: ConferenceCreationTokenMinAggregateOutputType | null
    _max: ConferenceCreationTokenMaxAggregateOutputType | null
  }

  export type ConferenceCreationTokenMinAggregateOutputType = {
    token: string | null
  }

  export type ConferenceCreationTokenMaxAggregateOutputType = {
    token: string | null
  }

  export type ConferenceCreationTokenCountAggregateOutputType = {
    token: number
    _all: number
  }


  export type ConferenceCreationTokenMinAggregateInputType = {
    token?: true
  }

  export type ConferenceCreationTokenMaxAggregateInputType = {
    token?: true
  }

  export type ConferenceCreationTokenCountAggregateInputType = {
    token?: true
    _all?: true
  }

  export type ConferenceCreationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceCreationToken to aggregate.
     */
    where?: ConferenceCreationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreationTokens to fetch.
     */
    orderBy?: ConferenceCreationTokenOrderByWithRelationInput | ConferenceCreationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConferenceCreationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConferenceCreationTokens
    **/
    _count?: true | ConferenceCreationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConferenceCreationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConferenceCreationTokenMaxAggregateInputType
  }

  export type GetConferenceCreationTokenAggregateType<T extends ConferenceCreationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateConferenceCreationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConferenceCreationToken[P]>
      : GetScalarType<T[P], AggregateConferenceCreationToken[P]>
  }




  export type ConferenceCreationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConferenceCreationTokenWhereInput
    orderBy?: ConferenceCreationTokenOrderByWithAggregationInput | ConferenceCreationTokenOrderByWithAggregationInput[]
    by: ConferenceCreationTokenScalarFieldEnum[] | ConferenceCreationTokenScalarFieldEnum
    having?: ConferenceCreationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConferenceCreationTokenCountAggregateInputType | true
    _min?: ConferenceCreationTokenMinAggregateInputType
    _max?: ConferenceCreationTokenMaxAggregateInputType
  }

  export type ConferenceCreationTokenGroupByOutputType = {
    token: string
    _count: ConferenceCreationTokenCountAggregateOutputType | null
    _min: ConferenceCreationTokenMinAggregateOutputType | null
    _max: ConferenceCreationTokenMaxAggregateOutputType | null
  }

  type GetConferenceCreationTokenGroupByPayload<T extends ConferenceCreationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConferenceCreationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConferenceCreationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConferenceCreationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], ConferenceCreationTokenGroupByOutputType[P]>
        }
      >
    >


  export type ConferenceCreationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
  }, ExtArgs["result"]["conferenceCreationToken"]>

  export type ConferenceCreationTokenSelectScalar = {
    token?: boolean
  }



  export type $ConferenceCreationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConferenceCreationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      token: string
    }, ExtArgs["result"]["conferenceCreationToken"]>
    composites: {}
  }


  type ConferenceCreationTokenGetPayload<S extends boolean | null | undefined | ConferenceCreationTokenDefaultArgs> = $Result.GetResult<Prisma.$ConferenceCreationTokenPayload, S>

  type ConferenceCreationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConferenceCreationTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConferenceCreationTokenCountAggregateInputType | true
    }

  export interface ConferenceCreationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConferenceCreationToken'], meta: { name: 'ConferenceCreationToken' } }
    /**
     * Find zero or one ConferenceCreationToken that matches the filter.
     * @param {ConferenceCreationTokenFindUniqueArgs} args - Arguments to find a ConferenceCreationToken
     * @example
     * // Get one ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ConferenceCreationTokenFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenFindUniqueArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one ConferenceCreationToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConferenceCreationTokenFindUniqueOrThrowArgs} args - Arguments to find a ConferenceCreationToken
     * @example
     * // Get one ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ConferenceCreationTokenFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first ConferenceCreationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenFindFirstArgs} args - Arguments to find a ConferenceCreationToken
     * @example
     * // Get one ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ConferenceCreationTokenFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenFindFirstArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first ConferenceCreationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenFindFirstOrThrowArgs} args - Arguments to find a ConferenceCreationToken
     * @example
     * // Get one ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ConferenceCreationTokenFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more ConferenceCreationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConferenceCreationTokens
     * const conferenceCreationTokens = await prisma.conferenceCreationToken.findMany()
     * 
     * // Get first 10 ConferenceCreationTokens
     * const conferenceCreationTokens = await prisma.conferenceCreationToken.findMany({ take: 10 })
     * 
     * // Only select the `token`
     * const conferenceCreationTokenWithTokenOnly = await prisma.conferenceCreationToken.findMany({ select: { token: true } })
     * 
    **/
    findMany<T extends ConferenceCreationTokenFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a ConferenceCreationToken.
     * @param {ConferenceCreationTokenCreateArgs} args - Arguments to create a ConferenceCreationToken.
     * @example
     * // Create one ConferenceCreationToken
     * const ConferenceCreationToken = await prisma.conferenceCreationToken.create({
     *   data: {
     *     // ... data to create a ConferenceCreationToken
     *   }
     * })
     * 
    **/
    create<T extends ConferenceCreationTokenCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenCreateArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many ConferenceCreationTokens.
     * @param {ConferenceCreationTokenCreateManyArgs} args - Arguments to create many ConferenceCreationTokens.
     * @example
     * // Create many ConferenceCreationTokens
     * const conferenceCreationToken = await prisma.conferenceCreationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends ConferenceCreationTokenCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConferenceCreationTokens and returns the data saved in the database.
     * @param {ConferenceCreationTokenCreateManyAndReturnArgs} args - Arguments to create many ConferenceCreationTokens.
     * @example
     * // Create many ConferenceCreationTokens
     * const conferenceCreationToken = await prisma.conferenceCreationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConferenceCreationTokens and only return the `token`
     * const conferenceCreationTokenWithTokenOnly = await prisma.conferenceCreationToken.createManyAndReturn({ 
     *   select: { token: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends ConferenceCreationTokenCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a ConferenceCreationToken.
     * @param {ConferenceCreationTokenDeleteArgs} args - Arguments to delete one ConferenceCreationToken.
     * @example
     * // Delete one ConferenceCreationToken
     * const ConferenceCreationToken = await prisma.conferenceCreationToken.delete({
     *   where: {
     *     // ... filter to delete one ConferenceCreationToken
     *   }
     * })
     * 
    **/
    delete<T extends ConferenceCreationTokenDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenDeleteArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one ConferenceCreationToken.
     * @param {ConferenceCreationTokenUpdateArgs} args - Arguments to update one ConferenceCreationToken.
     * @example
     * // Update one ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ConferenceCreationTokenUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenUpdateArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more ConferenceCreationTokens.
     * @param {ConferenceCreationTokenDeleteManyArgs} args - Arguments to filter ConferenceCreationTokens to delete.
     * @example
     * // Delete a few ConferenceCreationTokens
     * const { count } = await prisma.conferenceCreationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ConferenceCreationTokenDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreationTokenDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConferenceCreationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConferenceCreationTokens
     * const conferenceCreationToken = await prisma.conferenceCreationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ConferenceCreationTokenUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConferenceCreationToken.
     * @param {ConferenceCreationTokenUpsertArgs} args - Arguments to update or create a ConferenceCreationToken.
     * @example
     * // Update or create a ConferenceCreationToken
     * const conferenceCreationToken = await prisma.conferenceCreationToken.upsert({
     *   create: {
     *     // ... data to create a ConferenceCreationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConferenceCreationToken we want to update
     *   }
     * })
    **/
    upsert<T extends ConferenceCreationTokenUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreationTokenUpsertArgs<ExtArgs>>
    ): Prisma__ConferenceCreationTokenClient<$Result.GetResult<Prisma.$ConferenceCreationTokenPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of ConferenceCreationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenCountArgs} args - Arguments to filter ConferenceCreationTokens to count.
     * @example
     * // Count the number of ConferenceCreationTokens
     * const count = await prisma.conferenceCreationToken.count({
     *   where: {
     *     // ... the filter for the ConferenceCreationTokens we want to count
     *   }
     * })
    **/
    count<T extends ConferenceCreationTokenCountArgs>(
      args?: Subset<T, ConferenceCreationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConferenceCreationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConferenceCreationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConferenceCreationTokenAggregateArgs>(args: Subset<T, ConferenceCreationTokenAggregateArgs>): Prisma.PrismaPromise<GetConferenceCreationTokenAggregateType<T>>

    /**
     * Group by ConferenceCreationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConferenceCreationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConferenceCreationTokenGroupByArgs['orderBy'] }
        : { orderBy?: ConferenceCreationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConferenceCreationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConferenceCreationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConferenceCreationToken model
   */
  readonly fields: ConferenceCreationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConferenceCreationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConferenceCreationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the ConferenceCreationToken model
   */ 
  interface ConferenceCreationTokenFieldRefs {
    readonly token: FieldRef<"ConferenceCreationToken", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ConferenceCreationToken findUnique
   */
  export type ConferenceCreationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreationToken to fetch.
     */
    where: ConferenceCreationTokenWhereUniqueInput
  }

  /**
   * ConferenceCreationToken findUniqueOrThrow
   */
  export type ConferenceCreationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreationToken to fetch.
     */
    where: ConferenceCreationTokenWhereUniqueInput
  }

  /**
   * ConferenceCreationToken findFirst
   */
  export type ConferenceCreationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreationToken to fetch.
     */
    where?: ConferenceCreationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreationTokens to fetch.
     */
    orderBy?: ConferenceCreationTokenOrderByWithRelationInput | ConferenceCreationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceCreationTokens.
     */
    cursor?: ConferenceCreationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceCreationTokens.
     */
    distinct?: ConferenceCreationTokenScalarFieldEnum | ConferenceCreationTokenScalarFieldEnum[]
  }

  /**
   * ConferenceCreationToken findFirstOrThrow
   */
  export type ConferenceCreationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreationToken to fetch.
     */
    where?: ConferenceCreationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreationTokens to fetch.
     */
    orderBy?: ConferenceCreationTokenOrderByWithRelationInput | ConferenceCreationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceCreationTokens.
     */
    cursor?: ConferenceCreationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceCreationTokens.
     */
    distinct?: ConferenceCreationTokenScalarFieldEnum | ConferenceCreationTokenScalarFieldEnum[]
  }

  /**
   * ConferenceCreationToken findMany
   */
  export type ConferenceCreationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreationTokens to fetch.
     */
    where?: ConferenceCreationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreationTokens to fetch.
     */
    orderBy?: ConferenceCreationTokenOrderByWithRelationInput | ConferenceCreationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConferenceCreationTokens.
     */
    cursor?: ConferenceCreationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreationTokens.
     */
    skip?: number
    distinct?: ConferenceCreationTokenScalarFieldEnum | ConferenceCreationTokenScalarFieldEnum[]
  }

  /**
   * ConferenceCreationToken create
   */
  export type ConferenceCreationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a ConferenceCreationToken.
     */
    data: XOR<ConferenceCreationTokenCreateInput, ConferenceCreationTokenUncheckedCreateInput>
  }

  /**
   * ConferenceCreationToken createMany
   */
  export type ConferenceCreationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConferenceCreationTokens.
     */
    data: ConferenceCreationTokenCreateManyInput | ConferenceCreationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConferenceCreationToken createManyAndReturn
   */
  export type ConferenceCreationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * The data used to create many ConferenceCreationTokens.
     */
    data: ConferenceCreationTokenCreateManyInput | ConferenceCreationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConferenceCreationToken update
   */
  export type ConferenceCreationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a ConferenceCreationToken.
     */
    data: XOR<ConferenceCreationTokenUpdateInput, ConferenceCreationTokenUncheckedUpdateInput>
    /**
     * Choose, which ConferenceCreationToken to update.
     */
    where: ConferenceCreationTokenWhereUniqueInput
  }

  /**
   * ConferenceCreationToken updateMany
   */
  export type ConferenceCreationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConferenceCreationTokens.
     */
    data: XOR<ConferenceCreationTokenUpdateManyMutationInput, ConferenceCreationTokenUncheckedUpdateManyInput>
    /**
     * Filter which ConferenceCreationTokens to update
     */
    where?: ConferenceCreationTokenWhereInput
  }

  /**
   * ConferenceCreationToken upsert
   */
  export type ConferenceCreationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the ConferenceCreationToken to update in case it exists.
     */
    where: ConferenceCreationTokenWhereUniqueInput
    /**
     * In case the ConferenceCreationToken found by the `where` argument doesn't exist, create a new ConferenceCreationToken with this data.
     */
    create: XOR<ConferenceCreationTokenCreateInput, ConferenceCreationTokenUncheckedCreateInput>
    /**
     * In case the ConferenceCreationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConferenceCreationTokenUpdateInput, ConferenceCreationTokenUncheckedUpdateInput>
  }

  /**
   * ConferenceCreationToken delete
   */
  export type ConferenceCreationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
    /**
     * Filter which ConferenceCreationToken to delete.
     */
    where: ConferenceCreationTokenWhereUniqueInput
  }

  /**
   * ConferenceCreationToken deleteMany
   */
  export type ConferenceCreationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceCreationTokens to delete
     */
    where?: ConferenceCreationTokenWhereInput
  }

  /**
   * ConferenceCreationToken without action
   */
  export type ConferenceCreationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreationToken
     */
    select?: ConferenceCreationTokenSelect<ExtArgs> | null
  }


  /**
   * Model Conference
   */

  export type AggregateConference = {
    _count: ConferenceCountAggregateOutputType | null
    _min: ConferenceMinAggregateOutputType | null
    _max: ConferenceMaxAggregateOutputType | null
  }

  export type ConferenceMinAggregateOutputType = {
    id: string | null
    name: string | null
    start: Date | null
    end: Date | null
    pressWebsite: string | null
    feedbackWebsite: string | null
  }

  export type ConferenceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    start: Date | null
    end: Date | null
    pressWebsite: string | null
    feedbackWebsite: string | null
  }

  export type ConferenceCountAggregateOutputType = {
    id: number
    name: number
    start: number
    end: number
    pressWebsite: number
    feedbackWebsite: number
    _all: number
  }


  export type ConferenceMinAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
    pressWebsite?: true
    feedbackWebsite?: true
  }

  export type ConferenceMaxAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
    pressWebsite?: true
    feedbackWebsite?: true
  }

  export type ConferenceCountAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
    pressWebsite?: true
    feedbackWebsite?: true
    _all?: true
  }

  export type ConferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conference to aggregate.
     */
    where?: ConferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conferences to fetch.
     */
    orderBy?: ConferenceOrderByWithRelationInput | ConferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conferences
    **/
    _count?: true | ConferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConferenceMaxAggregateInputType
  }

  export type GetConferenceAggregateType<T extends ConferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateConference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConference[P]>
      : GetScalarType<T[P], AggregateConference[P]>
  }




  export type ConferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConferenceWhereInput
    orderBy?: ConferenceOrderByWithAggregationInput | ConferenceOrderByWithAggregationInput[]
    by: ConferenceScalarFieldEnum[] | ConferenceScalarFieldEnum
    having?: ConferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConferenceCountAggregateInputType | true
    _min?: ConferenceMinAggregateInputType
    _max?: ConferenceMaxAggregateInputType
  }

  export type ConferenceGroupByOutputType = {
    id: string
    name: string
    start: Date | null
    end: Date | null
    pressWebsite: string | null
    feedbackWebsite: string | null
    _count: ConferenceCountAggregateOutputType | null
    _min: ConferenceMinAggregateOutputType | null
    _max: ConferenceMaxAggregateOutputType | null
  }

  type GetConferenceGroupByPayload<T extends ConferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConferenceGroupByOutputType[P]>
            : GetScalarType<T[P], ConferenceGroupByOutputType[P]>
        }
      >
    >


  export type ConferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    start?: boolean
    end?: boolean
    pressWebsite?: boolean
    feedbackWebsite?: boolean
    delegations?: boolean | Conference$delegationsArgs<ExtArgs>
    members?: boolean | Conference$membersArgs<ExtArgs>
    committees?: boolean | Conference$committeesArgs<ExtArgs>
    _count?: boolean | ConferenceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conference"]>

  export type ConferenceSelectScalar = {
    id?: boolean
    name?: boolean
    start?: boolean
    end?: boolean
    pressWebsite?: boolean
    feedbackWebsite?: boolean
  }


  export type ConferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delegations?: boolean | Conference$delegationsArgs<ExtArgs>
    members?: boolean | Conference$membersArgs<ExtArgs>
    committees?: boolean | Conference$committeesArgs<ExtArgs>
    _count?: boolean | ConferenceCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $ConferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conference"
    objects: {
      delegations: Prisma.$DelegationPayload<ExtArgs>[]
      members: Prisma.$ConferenceMemberPayload<ExtArgs>[]
      committees: Prisma.$CommitteePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      start: Date | null
      end: Date | null
      pressWebsite: string | null
      feedbackWebsite: string | null
    }, ExtArgs["result"]["conference"]>
    composites: {}
  }


  type ConferenceGetPayload<S extends boolean | null | undefined | ConferenceDefaultArgs> = $Result.GetResult<Prisma.$ConferencePayload, S>

  type ConferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConferenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConferenceCountAggregateInputType | true
    }

  export interface ConferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conference'], meta: { name: 'Conference' } }
    /**
     * Find zero or one Conference that matches the filter.
     * @param {ConferenceFindUniqueArgs} args - Arguments to find a Conference
     * @example
     * // Get one Conference
     * const conference = await prisma.conference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ConferenceFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceFindUniqueArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Conference that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConferenceFindUniqueOrThrowArgs} args - Arguments to find a Conference
     * @example
     * // Get one Conference
     * const conference = await prisma.conference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ConferenceFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Conference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceFindFirstArgs} args - Arguments to find a Conference
     * @example
     * // Get one Conference
     * const conference = await prisma.conference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ConferenceFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceFindFirstArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Conference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceFindFirstOrThrowArgs} args - Arguments to find a Conference
     * @example
     * // Get one Conference
     * const conference = await prisma.conference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ConferenceFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Conferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conferences
     * const conferences = await prisma.conference.findMany()
     * 
     * // Get first 10 Conferences
     * const conferences = await prisma.conference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conferenceWithIdOnly = await prisma.conference.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ConferenceFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Conference.
     * @param {ConferenceCreateArgs} args - Arguments to create a Conference.
     * @example
     * // Create one Conference
     * const Conference = await prisma.conference.create({
     *   data: {
     *     // ... data to create a Conference
     *   }
     * })
     * 
    **/
    create<T extends ConferenceCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Conferences.
     * @param {ConferenceCreateManyArgs} args - Arguments to create many Conferences.
     * @example
     * // Create many Conferences
     * const conference = await prisma.conference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends ConferenceCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conferences and returns the data saved in the database.
     * @param {ConferenceCreateManyAndReturnArgs} args - Arguments to create many Conferences.
     * @example
     * // Create many Conferences
     * const conference = await prisma.conference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conferences and only return the `id`
     * const conferenceWithIdOnly = await prisma.conference.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends ConferenceCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Conference.
     * @param {ConferenceDeleteArgs} args - Arguments to delete one Conference.
     * @example
     * // Delete one Conference
     * const Conference = await prisma.conference.delete({
     *   where: {
     *     // ... filter to delete one Conference
     *   }
     * })
     * 
    **/
    delete<T extends ConferenceDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceDeleteArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Conference.
     * @param {ConferenceUpdateArgs} args - Arguments to update one Conference.
     * @example
     * // Update one Conference
     * const conference = await prisma.conference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ConferenceUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceUpdateArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Conferences.
     * @param {ConferenceDeleteManyArgs} args - Arguments to filter Conferences to delete.
     * @example
     * // Delete a few Conferences
     * const { count } = await prisma.conference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ConferenceDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conferences
     * const conference = await prisma.conference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ConferenceUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Conference.
     * @param {ConferenceUpsertArgs} args - Arguments to update or create a Conference.
     * @example
     * // Update or create a Conference
     * const conference = await prisma.conference.upsert({
     *   create: {
     *     // ... data to create a Conference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conference we want to update
     *   }
     * })
    **/
    upsert<T extends ConferenceUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceUpsertArgs<ExtArgs>>
    ): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Conferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCountArgs} args - Arguments to filter Conferences to count.
     * @example
     * // Count the number of Conferences
     * const count = await prisma.conference.count({
     *   where: {
     *     // ... the filter for the Conferences we want to count
     *   }
     * })
    **/
    count<T extends ConferenceCountArgs>(
      args?: Subset<T, ConferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConferenceAggregateArgs>(args: Subset<T, ConferenceAggregateArgs>): Prisma.PrismaPromise<GetConferenceAggregateType<T>>

    /**
     * Group by Conference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConferenceGroupByArgs['orderBy'] }
        : { orderBy?: ConferenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conference model
   */
  readonly fields: ConferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    delegations<T extends Conference$delegationsArgs<ExtArgs> = {}>(args?: Subset<T, Conference$delegationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findMany'> | Null>;

    members<T extends Conference$membersArgs<ExtArgs> = {}>(args?: Subset<T, Conference$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findMany'> | Null>;

    committees<T extends Conference$committeesArgs<ExtArgs> = {}>(args?: Subset<T, Conference$committeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Conference model
   */ 
  interface ConferenceFieldRefs {
    readonly id: FieldRef<"Conference", 'String'>
    readonly name: FieldRef<"Conference", 'String'>
    readonly start: FieldRef<"Conference", 'DateTime'>
    readonly end: FieldRef<"Conference", 'DateTime'>
    readonly pressWebsite: FieldRef<"Conference", 'String'>
    readonly feedbackWebsite: FieldRef<"Conference", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Conference findUnique
   */
  export type ConferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter, which Conference to fetch.
     */
    where: ConferenceWhereUniqueInput
  }

  /**
   * Conference findUniqueOrThrow
   */
  export type ConferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter, which Conference to fetch.
     */
    where: ConferenceWhereUniqueInput
  }

  /**
   * Conference findFirst
   */
  export type ConferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter, which Conference to fetch.
     */
    where?: ConferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conferences to fetch.
     */
    orderBy?: ConferenceOrderByWithRelationInput | ConferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conferences.
     */
    cursor?: ConferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conferences.
     */
    distinct?: ConferenceScalarFieldEnum | ConferenceScalarFieldEnum[]
  }

  /**
   * Conference findFirstOrThrow
   */
  export type ConferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter, which Conference to fetch.
     */
    where?: ConferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conferences to fetch.
     */
    orderBy?: ConferenceOrderByWithRelationInput | ConferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conferences.
     */
    cursor?: ConferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conferences.
     */
    distinct?: ConferenceScalarFieldEnum | ConferenceScalarFieldEnum[]
  }

  /**
   * Conference findMany
   */
  export type ConferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter, which Conferences to fetch.
     */
    where?: ConferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conferences to fetch.
     */
    orderBy?: ConferenceOrderByWithRelationInput | ConferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conferences.
     */
    cursor?: ConferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conferences.
     */
    skip?: number
    distinct?: ConferenceScalarFieldEnum | ConferenceScalarFieldEnum[]
  }

  /**
   * Conference create
   */
  export type ConferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a Conference.
     */
    data: XOR<ConferenceCreateInput, ConferenceUncheckedCreateInput>
  }

  /**
   * Conference createMany
   */
  export type ConferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conferences.
     */
    data: ConferenceCreateManyInput | ConferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conference createManyAndReturn
   */
  export type ConferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * The data used to create many Conferences.
     */
    data: ConferenceCreateManyInput | ConferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conference update
   */
  export type ConferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a Conference.
     */
    data: XOR<ConferenceUpdateInput, ConferenceUncheckedUpdateInput>
    /**
     * Choose, which Conference to update.
     */
    where: ConferenceWhereUniqueInput
  }

  /**
   * Conference updateMany
   */
  export type ConferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conferences.
     */
    data: XOR<ConferenceUpdateManyMutationInput, ConferenceUncheckedUpdateManyInput>
    /**
     * Filter which Conferences to update
     */
    where?: ConferenceWhereInput
  }

  /**
   * Conference upsert
   */
  export type ConferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the Conference to update in case it exists.
     */
    where: ConferenceWhereUniqueInput
    /**
     * In case the Conference found by the `where` argument doesn't exist, create a new Conference with this data.
     */
    create: XOR<ConferenceCreateInput, ConferenceUncheckedCreateInput>
    /**
     * In case the Conference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConferenceUpdateInput, ConferenceUncheckedUpdateInput>
  }

  /**
   * Conference delete
   */
  export type ConferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
    /**
     * Filter which Conference to delete.
     */
    where: ConferenceWhereUniqueInput
  }

  /**
   * Conference deleteMany
   */
  export type ConferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conferences to delete
     */
    where?: ConferenceWhereInput
  }

  /**
   * Conference.delegations
   */
  export type Conference$delegationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    where?: DelegationWhereInput
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    cursor?: DelegationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DelegationScalarFieldEnum | DelegationScalarFieldEnum[]
  }

  /**
   * Conference.members
   */
  export type Conference$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    where?: ConferenceMemberWhereInput
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    cursor?: ConferenceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConferenceMemberScalarFieldEnum | ConferenceMemberScalarFieldEnum[]
  }

  /**
   * Conference.committees
   */
  export type Conference$committeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    where?: CommitteeWhereInput
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    cursor?: CommitteeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommitteeScalarFieldEnum | CommitteeScalarFieldEnum[]
  }

  /**
   * Conference without action
   */
  export type ConferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceInclude<ExtArgs> | null
  }


  /**
   * Model ConferenceMember
   */

  export type AggregateConferenceMember = {
    _count: ConferenceMemberCountAggregateOutputType | null
    _min: ConferenceMemberMinAggregateOutputType | null
    _max: ConferenceMemberMaxAggregateOutputType | null
  }

  export type ConferenceMemberMinAggregateOutputType = {
    id: string | null
    conferenceId: string | null
    userId: string | null
    role: $Enums.ConferenceRole | null
  }

  export type ConferenceMemberMaxAggregateOutputType = {
    id: string | null
    conferenceId: string | null
    userId: string | null
    role: $Enums.ConferenceRole | null
  }

  export type ConferenceMemberCountAggregateOutputType = {
    id: number
    conferenceId: number
    userId: number
    role: number
    _all: number
  }


  export type ConferenceMemberMinAggregateInputType = {
    id?: true
    conferenceId?: true
    userId?: true
    role?: true
  }

  export type ConferenceMemberMaxAggregateInputType = {
    id?: true
    conferenceId?: true
    userId?: true
    role?: true
  }

  export type ConferenceMemberCountAggregateInputType = {
    id?: true
    conferenceId?: true
    userId?: true
    role?: true
    _all?: true
  }

  export type ConferenceMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceMember to aggregate.
     */
    where?: ConferenceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceMembers to fetch.
     */
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConferenceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConferenceMembers
    **/
    _count?: true | ConferenceMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConferenceMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConferenceMemberMaxAggregateInputType
  }

  export type GetConferenceMemberAggregateType<T extends ConferenceMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateConferenceMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConferenceMember[P]>
      : GetScalarType<T[P], AggregateConferenceMember[P]>
  }




  export type ConferenceMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConferenceMemberWhereInput
    orderBy?: ConferenceMemberOrderByWithAggregationInput | ConferenceMemberOrderByWithAggregationInput[]
    by: ConferenceMemberScalarFieldEnum[] | ConferenceMemberScalarFieldEnum
    having?: ConferenceMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConferenceMemberCountAggregateInputType | true
    _min?: ConferenceMemberMinAggregateInputType
    _max?: ConferenceMemberMaxAggregateInputType
  }

  export type ConferenceMemberGroupByOutputType = {
    id: string
    conferenceId: string
    userId: string | null
    role: $Enums.ConferenceRole
    _count: ConferenceMemberCountAggregateOutputType | null
    _min: ConferenceMemberMinAggregateOutputType | null
    _max: ConferenceMemberMaxAggregateOutputType | null
  }

  type GetConferenceMemberGroupByPayload<T extends ConferenceMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConferenceMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConferenceMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConferenceMemberGroupByOutputType[P]>
            : GetScalarType<T[P], ConferenceMemberGroupByOutputType[P]>
        }
      >
    >


  export type ConferenceMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conferenceId?: boolean
    userId?: boolean
    role?: boolean
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    user?: boolean | ConferenceMember$userArgs<ExtArgs>
  }, ExtArgs["result"]["conferenceMember"]>

  export type ConferenceMemberSelectScalar = {
    id?: boolean
    conferenceId?: boolean
    userId?: boolean
    role?: boolean
  }


  export type ConferenceMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    user?: boolean | ConferenceMember$userArgs<ExtArgs>
  }


  export type $ConferenceMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConferenceMember"
    objects: {
      conference: Prisma.$ConferencePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conferenceId: string
      userId: string | null
      role: $Enums.ConferenceRole
    }, ExtArgs["result"]["conferenceMember"]>
    composites: {}
  }


  type ConferenceMemberGetPayload<S extends boolean | null | undefined | ConferenceMemberDefaultArgs> = $Result.GetResult<Prisma.$ConferenceMemberPayload, S>

  type ConferenceMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConferenceMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConferenceMemberCountAggregateInputType | true
    }

  export interface ConferenceMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConferenceMember'], meta: { name: 'ConferenceMember' } }
    /**
     * Find zero or one ConferenceMember that matches the filter.
     * @param {ConferenceMemberFindUniqueArgs} args - Arguments to find a ConferenceMember
     * @example
     * // Get one ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ConferenceMemberFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberFindUniqueArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one ConferenceMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConferenceMemberFindUniqueOrThrowArgs} args - Arguments to find a ConferenceMember
     * @example
     * // Get one ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ConferenceMemberFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first ConferenceMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberFindFirstArgs} args - Arguments to find a ConferenceMember
     * @example
     * // Get one ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ConferenceMemberFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberFindFirstArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first ConferenceMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberFindFirstOrThrowArgs} args - Arguments to find a ConferenceMember
     * @example
     * // Get one ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ConferenceMemberFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more ConferenceMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConferenceMembers
     * const conferenceMembers = await prisma.conferenceMember.findMany()
     * 
     * // Get first 10 ConferenceMembers
     * const conferenceMembers = await prisma.conferenceMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conferenceMemberWithIdOnly = await prisma.conferenceMember.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ConferenceMemberFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a ConferenceMember.
     * @param {ConferenceMemberCreateArgs} args - Arguments to create a ConferenceMember.
     * @example
     * // Create one ConferenceMember
     * const ConferenceMember = await prisma.conferenceMember.create({
     *   data: {
     *     // ... data to create a ConferenceMember
     *   }
     * })
     * 
    **/
    create<T extends ConferenceMemberCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberCreateArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many ConferenceMembers.
     * @param {ConferenceMemberCreateManyArgs} args - Arguments to create many ConferenceMembers.
     * @example
     * // Create many ConferenceMembers
     * const conferenceMember = await prisma.conferenceMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends ConferenceMemberCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConferenceMembers and returns the data saved in the database.
     * @param {ConferenceMemberCreateManyAndReturnArgs} args - Arguments to create many ConferenceMembers.
     * @example
     * // Create many ConferenceMembers
     * const conferenceMember = await prisma.conferenceMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConferenceMembers and only return the `id`
     * const conferenceMemberWithIdOnly = await prisma.conferenceMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends ConferenceMemberCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a ConferenceMember.
     * @param {ConferenceMemberDeleteArgs} args - Arguments to delete one ConferenceMember.
     * @example
     * // Delete one ConferenceMember
     * const ConferenceMember = await prisma.conferenceMember.delete({
     *   where: {
     *     // ... filter to delete one ConferenceMember
     *   }
     * })
     * 
    **/
    delete<T extends ConferenceMemberDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberDeleteArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one ConferenceMember.
     * @param {ConferenceMemberUpdateArgs} args - Arguments to update one ConferenceMember.
     * @example
     * // Update one ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ConferenceMemberUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberUpdateArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more ConferenceMembers.
     * @param {ConferenceMemberDeleteManyArgs} args - Arguments to filter ConferenceMembers to delete.
     * @example
     * // Delete a few ConferenceMembers
     * const { count } = await prisma.conferenceMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ConferenceMemberDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceMemberDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConferenceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConferenceMembers
     * const conferenceMember = await prisma.conferenceMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ConferenceMemberUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConferenceMember.
     * @param {ConferenceMemberUpsertArgs} args - Arguments to update or create a ConferenceMember.
     * @example
     * // Update or create a ConferenceMember
     * const conferenceMember = await prisma.conferenceMember.upsert({
     *   create: {
     *     // ... data to create a ConferenceMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConferenceMember we want to update
     *   }
     * })
    **/
    upsert<T extends ConferenceMemberUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceMemberUpsertArgs<ExtArgs>>
    ): Prisma__ConferenceMemberClient<$Result.GetResult<Prisma.$ConferenceMemberPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of ConferenceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberCountArgs} args - Arguments to filter ConferenceMembers to count.
     * @example
     * // Count the number of ConferenceMembers
     * const count = await prisma.conferenceMember.count({
     *   where: {
     *     // ... the filter for the ConferenceMembers we want to count
     *   }
     * })
    **/
    count<T extends ConferenceMemberCountArgs>(
      args?: Subset<T, ConferenceMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConferenceMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConferenceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConferenceMemberAggregateArgs>(args: Subset<T, ConferenceMemberAggregateArgs>): Prisma.PrismaPromise<GetConferenceMemberAggregateType<T>>

    /**
     * Group by ConferenceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConferenceMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConferenceMemberGroupByArgs['orderBy'] }
        : { orderBy?: ConferenceMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConferenceMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConferenceMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConferenceMember model
   */
  readonly fields: ConferenceMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConferenceMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConferenceMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    conference<T extends ConferenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConferenceDefaultArgs<ExtArgs>>): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    user<T extends ConferenceMember$userArgs<ExtArgs> = {}>(args?: Subset<T, ConferenceMember$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the ConferenceMember model
   */ 
  interface ConferenceMemberFieldRefs {
    readonly id: FieldRef<"ConferenceMember", 'String'>
    readonly conferenceId: FieldRef<"ConferenceMember", 'String'>
    readonly userId: FieldRef<"ConferenceMember", 'String'>
    readonly role: FieldRef<"ConferenceMember", 'ConferenceRole'>
  }
    

  // Custom InputTypes
  /**
   * ConferenceMember findUnique
   */
  export type ConferenceMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter, which ConferenceMember to fetch.
     */
    where: ConferenceMemberWhereUniqueInput
  }

  /**
   * ConferenceMember findUniqueOrThrow
   */
  export type ConferenceMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter, which ConferenceMember to fetch.
     */
    where: ConferenceMemberWhereUniqueInput
  }

  /**
   * ConferenceMember findFirst
   */
  export type ConferenceMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter, which ConferenceMember to fetch.
     */
    where?: ConferenceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceMembers to fetch.
     */
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceMembers.
     */
    cursor?: ConferenceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceMembers.
     */
    distinct?: ConferenceMemberScalarFieldEnum | ConferenceMemberScalarFieldEnum[]
  }

  /**
   * ConferenceMember findFirstOrThrow
   */
  export type ConferenceMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter, which ConferenceMember to fetch.
     */
    where?: ConferenceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceMembers to fetch.
     */
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceMembers.
     */
    cursor?: ConferenceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceMembers.
     */
    distinct?: ConferenceMemberScalarFieldEnum | ConferenceMemberScalarFieldEnum[]
  }

  /**
   * ConferenceMember findMany
   */
  export type ConferenceMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter, which ConferenceMembers to fetch.
     */
    where?: ConferenceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceMembers to fetch.
     */
    orderBy?: ConferenceMemberOrderByWithRelationInput | ConferenceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConferenceMembers.
     */
    cursor?: ConferenceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceMembers.
     */
    skip?: number
    distinct?: ConferenceMemberScalarFieldEnum | ConferenceMemberScalarFieldEnum[]
  }

  /**
   * ConferenceMember create
   */
  export type ConferenceMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a ConferenceMember.
     */
    data: XOR<ConferenceMemberCreateInput, ConferenceMemberUncheckedCreateInput>
  }

  /**
   * ConferenceMember createMany
   */
  export type ConferenceMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConferenceMembers.
     */
    data: ConferenceMemberCreateManyInput | ConferenceMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConferenceMember createManyAndReturn
   */
  export type ConferenceMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * The data used to create many ConferenceMembers.
     */
    data: ConferenceMemberCreateManyInput | ConferenceMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConferenceMember update
   */
  export type ConferenceMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a ConferenceMember.
     */
    data: XOR<ConferenceMemberUpdateInput, ConferenceMemberUncheckedUpdateInput>
    /**
     * Choose, which ConferenceMember to update.
     */
    where: ConferenceMemberWhereUniqueInput
  }

  /**
   * ConferenceMember updateMany
   */
  export type ConferenceMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConferenceMembers.
     */
    data: XOR<ConferenceMemberUpdateManyMutationInput, ConferenceMemberUncheckedUpdateManyInput>
    /**
     * Filter which ConferenceMembers to update
     */
    where?: ConferenceMemberWhereInput
  }

  /**
   * ConferenceMember upsert
   */
  export type ConferenceMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the ConferenceMember to update in case it exists.
     */
    where: ConferenceMemberWhereUniqueInput
    /**
     * In case the ConferenceMember found by the `where` argument doesn't exist, create a new ConferenceMember with this data.
     */
    create: XOR<ConferenceMemberCreateInput, ConferenceMemberUncheckedCreateInput>
    /**
     * In case the ConferenceMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConferenceMemberUpdateInput, ConferenceMemberUncheckedUpdateInput>
  }

  /**
   * ConferenceMember delete
   */
  export type ConferenceMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
    /**
     * Filter which ConferenceMember to delete.
     */
    where: ConferenceMemberWhereUniqueInput
  }

  /**
   * ConferenceMember deleteMany
   */
  export type ConferenceMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceMembers to delete
     */
    where?: ConferenceMemberWhereInput
  }

  /**
   * ConferenceMember.user
   */
  export type ConferenceMember$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ConferenceMember without action
   */
  export type ConferenceMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceMember
     */
    select?: ConferenceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConferenceMemberInclude<ExtArgs> | null
  }


  /**
   * Model Committee
   */

  export type AggregateCommittee = {
    _count: CommitteeCountAggregateOutputType | null
    _min: CommitteeMinAggregateOutputType | null
    _max: CommitteeMaxAggregateOutputType | null
  }

  export type CommitteeMinAggregateOutputType = {
    id: string | null
    name: string | null
    abbreviation: string | null
    category: $Enums.CommitteeCategory | null
    conferenceId: string | null
    parentId: string | null
    whiteboardContent: string | null
    status: $Enums.CommitteeStatus | null
    stateOfDebate: string | null
    statusHeadline: string | null
    statusUntil: Date | null
    allowDelegationsToAddThemselvesToSpeakersList: boolean | null
  }

  export type CommitteeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    abbreviation: string | null
    category: $Enums.CommitteeCategory | null
    conferenceId: string | null
    parentId: string | null
    whiteboardContent: string | null
    status: $Enums.CommitteeStatus | null
    stateOfDebate: string | null
    statusHeadline: string | null
    statusUntil: Date | null
    allowDelegationsToAddThemselvesToSpeakersList: boolean | null
  }

  export type CommitteeCountAggregateOutputType = {
    id: number
    name: number
    abbreviation: number
    category: number
    conferenceId: number
    parentId: number
    whiteboardContent: number
    status: number
    stateOfDebate: number
    statusHeadline: number
    statusUntil: number
    allowDelegationsToAddThemselvesToSpeakersList: number
    _all: number
  }


  export type CommitteeMinAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    category?: true
    conferenceId?: true
    parentId?: true
    whiteboardContent?: true
    status?: true
    stateOfDebate?: true
    statusHeadline?: true
    statusUntil?: true
    allowDelegationsToAddThemselvesToSpeakersList?: true
  }

  export type CommitteeMaxAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    category?: true
    conferenceId?: true
    parentId?: true
    whiteboardContent?: true
    status?: true
    stateOfDebate?: true
    statusHeadline?: true
    statusUntil?: true
    allowDelegationsToAddThemselvesToSpeakersList?: true
  }

  export type CommitteeCountAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    category?: true
    conferenceId?: true
    parentId?: true
    whiteboardContent?: true
    status?: true
    stateOfDebate?: true
    statusHeadline?: true
    statusUntil?: true
    allowDelegationsToAddThemselvesToSpeakersList?: true
    _all?: true
  }

  export type CommitteeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Committee to aggregate.
     */
    where?: CommitteeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Committees to fetch.
     */
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommitteeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Committees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Committees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Committees
    **/
    _count?: true | CommitteeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommitteeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommitteeMaxAggregateInputType
  }

  export type GetCommitteeAggregateType<T extends CommitteeAggregateArgs> = {
        [P in keyof T & keyof AggregateCommittee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommittee[P]>
      : GetScalarType<T[P], AggregateCommittee[P]>
  }




  export type CommitteeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeWhereInput
    orderBy?: CommitteeOrderByWithAggregationInput | CommitteeOrderByWithAggregationInput[]
    by: CommitteeScalarFieldEnum[] | CommitteeScalarFieldEnum
    having?: CommitteeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommitteeCountAggregateInputType | true
    _min?: CommitteeMinAggregateInputType
    _max?: CommitteeMaxAggregateInputType
  }

  export type CommitteeGroupByOutputType = {
    id: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId: string | null
    whiteboardContent: string
    status: $Enums.CommitteeStatus
    stateOfDebate: string | null
    statusHeadline: string | null
    statusUntil: Date | null
    allowDelegationsToAddThemselvesToSpeakersList: boolean
    _count: CommitteeCountAggregateOutputType | null
    _min: CommitteeMinAggregateOutputType | null
    _max: CommitteeMaxAggregateOutputType | null
  }

  type GetCommitteeGroupByPayload<T extends CommitteeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommitteeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommitteeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommitteeGroupByOutputType[P]>
            : GetScalarType<T[P], CommitteeGroupByOutputType[P]>
        }
      >
    >


  export type CommitteeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    abbreviation?: boolean
    category?: boolean
    conferenceId?: boolean
    parentId?: boolean
    whiteboardContent?: boolean
    status?: boolean
    stateOfDebate?: boolean
    statusHeadline?: boolean
    statusUntil?: boolean
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    members?: boolean | Committee$membersArgs<ExtArgs>
    parent?: boolean | Committee$parentArgs<ExtArgs>
    subCommittees?: boolean | Committee$subCommitteesArgs<ExtArgs>
    messages?: boolean | Committee$messagesArgs<ExtArgs>
    agendaItems?: boolean | Committee$agendaItemsArgs<ExtArgs>
    _count?: boolean | CommitteeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["committee"]>

  export type CommitteeSelectScalar = {
    id?: boolean
    name?: boolean
    abbreviation?: boolean
    category?: boolean
    conferenceId?: boolean
    parentId?: boolean
    whiteboardContent?: boolean
    status?: boolean
    stateOfDebate?: boolean
    statusHeadline?: boolean
    statusUntil?: boolean
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
  }


  export type CommitteeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    members?: boolean | Committee$membersArgs<ExtArgs>
    parent?: boolean | Committee$parentArgs<ExtArgs>
    subCommittees?: boolean | Committee$subCommitteesArgs<ExtArgs>
    messages?: boolean | Committee$messagesArgs<ExtArgs>
    agendaItems?: boolean | Committee$agendaItemsArgs<ExtArgs>
    _count?: boolean | CommitteeCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $CommitteePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Committee"
    objects: {
      conference: Prisma.$ConferencePayload<ExtArgs>
      members: Prisma.$CommitteeMemberPayload<ExtArgs>[]
      parent: Prisma.$CommitteePayload<ExtArgs> | null
      subCommittees: Prisma.$CommitteePayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      agendaItems: Prisma.$AgendaItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      abbreviation: string
      category: $Enums.CommitteeCategory
      conferenceId: string
      parentId: string | null
      whiteboardContent: string
      status: $Enums.CommitteeStatus
      stateOfDebate: string | null
      statusHeadline: string | null
      statusUntil: Date | null
      allowDelegationsToAddThemselvesToSpeakersList: boolean
    }, ExtArgs["result"]["committee"]>
    composites: {}
  }


  type CommitteeGetPayload<S extends boolean | null | undefined | CommitteeDefaultArgs> = $Result.GetResult<Prisma.$CommitteePayload, S>

  type CommitteeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommitteeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommitteeCountAggregateInputType | true
    }

  export interface CommitteeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Committee'], meta: { name: 'Committee' } }
    /**
     * Find zero or one Committee that matches the filter.
     * @param {CommitteeFindUniqueArgs} args - Arguments to find a Committee
     * @example
     * // Get one Committee
     * const committee = await prisma.committee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CommitteeFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeFindUniqueArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Committee that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommitteeFindUniqueOrThrowArgs} args - Arguments to find a Committee
     * @example
     * // Get one Committee
     * const committee = await prisma.committee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CommitteeFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Committee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeFindFirstArgs} args - Arguments to find a Committee
     * @example
     * // Get one Committee
     * const committee = await prisma.committee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CommitteeFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeFindFirstArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Committee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeFindFirstOrThrowArgs} args - Arguments to find a Committee
     * @example
     * // Get one Committee
     * const committee = await prisma.committee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CommitteeFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Committees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Committees
     * const committees = await prisma.committee.findMany()
     * 
     * // Get first 10 Committees
     * const committees = await prisma.committee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const committeeWithIdOnly = await prisma.committee.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CommitteeFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Committee.
     * @param {CommitteeCreateArgs} args - Arguments to create a Committee.
     * @example
     * // Create one Committee
     * const Committee = await prisma.committee.create({
     *   data: {
     *     // ... data to create a Committee
     *   }
     * })
     * 
    **/
    create<T extends CommitteeCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeCreateArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Committees.
     * @param {CommitteeCreateManyArgs} args - Arguments to create many Committees.
     * @example
     * // Create many Committees
     * const committee = await prisma.committee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends CommitteeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Committees and returns the data saved in the database.
     * @param {CommitteeCreateManyAndReturnArgs} args - Arguments to create many Committees.
     * @example
     * // Create many Committees
     * const committee = await prisma.committee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Committees and only return the `id`
     * const committeeWithIdOnly = await prisma.committee.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends CommitteeCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Committee.
     * @param {CommitteeDeleteArgs} args - Arguments to delete one Committee.
     * @example
     * // Delete one Committee
     * const Committee = await prisma.committee.delete({
     *   where: {
     *     // ... filter to delete one Committee
     *   }
     * })
     * 
    **/
    delete<T extends CommitteeDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeDeleteArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Committee.
     * @param {CommitteeUpdateArgs} args - Arguments to update one Committee.
     * @example
     * // Update one Committee
     * const committee = await prisma.committee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CommitteeUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeUpdateArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Committees.
     * @param {CommitteeDeleteManyArgs} args - Arguments to filter Committees to delete.
     * @example
     * // Delete a few Committees
     * const { count } = await prisma.committee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CommitteeDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Committees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Committees
     * const committee = await prisma.committee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CommitteeUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Committee.
     * @param {CommitteeUpsertArgs} args - Arguments to update or create a Committee.
     * @example
     * // Update or create a Committee
     * const committee = await prisma.committee.upsert({
     *   create: {
     *     // ... data to create a Committee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Committee we want to update
     *   }
     * })
    **/
    upsert<T extends CommitteeUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeUpsertArgs<ExtArgs>>
    ): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Committees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeCountArgs} args - Arguments to filter Committees to count.
     * @example
     * // Count the number of Committees
     * const count = await prisma.committee.count({
     *   where: {
     *     // ... the filter for the Committees we want to count
     *   }
     * })
    **/
    count<T extends CommitteeCountArgs>(
      args?: Subset<T, CommitteeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommitteeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Committee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommitteeAggregateArgs>(args: Subset<T, CommitteeAggregateArgs>): Prisma.PrismaPromise<GetCommitteeAggregateType<T>>

    /**
     * Group by Committee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommitteeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommitteeGroupByArgs['orderBy'] }
        : { orderBy?: CommitteeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommitteeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommitteeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Committee model
   */
  readonly fields: CommitteeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Committee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommitteeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    conference<T extends ConferenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConferenceDefaultArgs<ExtArgs>>): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    members<T extends Committee$membersArgs<ExtArgs> = {}>(args?: Subset<T, Committee$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findMany'> | Null>;

    parent<T extends Committee$parentArgs<ExtArgs> = {}>(args?: Subset<T, Committee$parentArgs<ExtArgs>>): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    subCommittees<T extends Committee$subCommitteesArgs<ExtArgs> = {}>(args?: Subset<T, Committee$subCommitteesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findMany'> | Null>;

    messages<T extends Committee$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Committee$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findMany'> | Null>;

    agendaItems<T extends Committee$agendaItemsArgs<ExtArgs> = {}>(args?: Subset<T, Committee$agendaItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Committee model
   */ 
  interface CommitteeFieldRefs {
    readonly id: FieldRef<"Committee", 'String'>
    readonly name: FieldRef<"Committee", 'String'>
    readonly abbreviation: FieldRef<"Committee", 'String'>
    readonly category: FieldRef<"Committee", 'CommitteeCategory'>
    readonly conferenceId: FieldRef<"Committee", 'String'>
    readonly parentId: FieldRef<"Committee", 'String'>
    readonly whiteboardContent: FieldRef<"Committee", 'String'>
    readonly status: FieldRef<"Committee", 'CommitteeStatus'>
    readonly stateOfDebate: FieldRef<"Committee", 'String'>
    readonly statusHeadline: FieldRef<"Committee", 'String'>
    readonly statusUntil: FieldRef<"Committee", 'DateTime'>
    readonly allowDelegationsToAddThemselvesToSpeakersList: FieldRef<"Committee", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Committee findUnique
   */
  export type CommitteeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter, which Committee to fetch.
     */
    where: CommitteeWhereUniqueInput
  }

  /**
   * Committee findUniqueOrThrow
   */
  export type CommitteeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter, which Committee to fetch.
     */
    where: CommitteeWhereUniqueInput
  }

  /**
   * Committee findFirst
   */
  export type CommitteeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter, which Committee to fetch.
     */
    where?: CommitteeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Committees to fetch.
     */
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Committees.
     */
    cursor?: CommitteeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Committees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Committees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Committees.
     */
    distinct?: CommitteeScalarFieldEnum | CommitteeScalarFieldEnum[]
  }

  /**
   * Committee findFirstOrThrow
   */
  export type CommitteeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter, which Committee to fetch.
     */
    where?: CommitteeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Committees to fetch.
     */
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Committees.
     */
    cursor?: CommitteeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Committees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Committees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Committees.
     */
    distinct?: CommitteeScalarFieldEnum | CommitteeScalarFieldEnum[]
  }

  /**
   * Committee findMany
   */
  export type CommitteeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter, which Committees to fetch.
     */
    where?: CommitteeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Committees to fetch.
     */
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Committees.
     */
    cursor?: CommitteeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Committees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Committees.
     */
    skip?: number
    distinct?: CommitteeScalarFieldEnum | CommitteeScalarFieldEnum[]
  }

  /**
   * Committee create
   */
  export type CommitteeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * The data needed to create a Committee.
     */
    data: XOR<CommitteeCreateInput, CommitteeUncheckedCreateInput>
  }

  /**
   * Committee createMany
   */
  export type CommitteeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Committees.
     */
    data: CommitteeCreateManyInput | CommitteeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Committee createManyAndReturn
   */
  export type CommitteeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * The data used to create many Committees.
     */
    data: CommitteeCreateManyInput | CommitteeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Committee update
   */
  export type CommitteeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * The data needed to update a Committee.
     */
    data: XOR<CommitteeUpdateInput, CommitteeUncheckedUpdateInput>
    /**
     * Choose, which Committee to update.
     */
    where: CommitteeWhereUniqueInput
  }

  /**
   * Committee updateMany
   */
  export type CommitteeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Committees.
     */
    data: XOR<CommitteeUpdateManyMutationInput, CommitteeUncheckedUpdateManyInput>
    /**
     * Filter which Committees to update
     */
    where?: CommitteeWhereInput
  }

  /**
   * Committee upsert
   */
  export type CommitteeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * The filter to search for the Committee to update in case it exists.
     */
    where: CommitteeWhereUniqueInput
    /**
     * In case the Committee found by the `where` argument doesn't exist, create a new Committee with this data.
     */
    create: XOR<CommitteeCreateInput, CommitteeUncheckedCreateInput>
    /**
     * In case the Committee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommitteeUpdateInput, CommitteeUncheckedUpdateInput>
  }

  /**
   * Committee delete
   */
  export type CommitteeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    /**
     * Filter which Committee to delete.
     */
    where: CommitteeWhereUniqueInput
  }

  /**
   * Committee deleteMany
   */
  export type CommitteeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Committees to delete
     */
    where?: CommitteeWhereInput
  }

  /**
   * Committee.members
   */
  export type Committee$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    where?: CommitteeMemberWhereInput
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    cursor?: CommitteeMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * Committee.parent
   */
  export type Committee$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    where?: CommitteeWhereInput
  }

  /**
   * Committee.subCommittees
   */
  export type Committee$subCommitteesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
    where?: CommitteeWhereInput
    orderBy?: CommitteeOrderByWithRelationInput | CommitteeOrderByWithRelationInput[]
    cursor?: CommitteeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommitteeScalarFieldEnum | CommitteeScalarFieldEnum[]
  }

  /**
   * Committee.messages
   */
  export type Committee$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Committee.agendaItems
   */
  export type Committee$agendaItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    where?: AgendaItemWhereInput
    orderBy?: AgendaItemOrderByWithRelationInput | AgendaItemOrderByWithRelationInput[]
    cursor?: AgendaItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendaItemScalarFieldEnum | AgendaItemScalarFieldEnum[]
  }

  /**
   * Committee without action
   */
  export type CommitteeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeInclude<ExtArgs> | null
  }


  /**
   * Model CommitteeMember
   */

  export type AggregateCommitteeMember = {
    _count: CommitteeMemberCountAggregateOutputType | null
    _min: CommitteeMemberMinAggregateOutputType | null
    _max: CommitteeMemberMaxAggregateOutputType | null
  }

  export type CommitteeMemberMinAggregateOutputType = {
    id: string | null
    committeeId: string | null
    userId: string | null
    delegationId: string | null
    presence: $Enums.Presence | null
  }

  export type CommitteeMemberMaxAggregateOutputType = {
    id: string | null
    committeeId: string | null
    userId: string | null
    delegationId: string | null
    presence: $Enums.Presence | null
  }

  export type CommitteeMemberCountAggregateOutputType = {
    id: number
    committeeId: number
    userId: number
    delegationId: number
    presence: number
    _all: number
  }


  export type CommitteeMemberMinAggregateInputType = {
    id?: true
    committeeId?: true
    userId?: true
    delegationId?: true
    presence?: true
  }

  export type CommitteeMemberMaxAggregateInputType = {
    id?: true
    committeeId?: true
    userId?: true
    delegationId?: true
    presence?: true
  }

  export type CommitteeMemberCountAggregateInputType = {
    id?: true
    committeeId?: true
    userId?: true
    delegationId?: true
    presence?: true
    _all?: true
  }

  export type CommitteeMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommitteeMember to aggregate.
     */
    where?: CommitteeMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommitteeMembers to fetch.
     */
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommitteeMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommitteeMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommitteeMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommitteeMembers
    **/
    _count?: true | CommitteeMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommitteeMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommitteeMemberMaxAggregateInputType
  }

  export type GetCommitteeMemberAggregateType<T extends CommitteeMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateCommitteeMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommitteeMember[P]>
      : GetScalarType<T[P], AggregateCommitteeMember[P]>
  }




  export type CommitteeMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitteeMemberWhereInput
    orderBy?: CommitteeMemberOrderByWithAggregationInput | CommitteeMemberOrderByWithAggregationInput[]
    by: CommitteeMemberScalarFieldEnum[] | CommitteeMemberScalarFieldEnum
    having?: CommitteeMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommitteeMemberCountAggregateInputType | true
    _min?: CommitteeMemberMinAggregateInputType
    _max?: CommitteeMemberMaxAggregateInputType
  }

  export type CommitteeMemberGroupByOutputType = {
    id: string
    committeeId: string
    userId: string | null
    delegationId: string | null
    presence: $Enums.Presence
    _count: CommitteeMemberCountAggregateOutputType | null
    _min: CommitteeMemberMinAggregateOutputType | null
    _max: CommitteeMemberMaxAggregateOutputType | null
  }

  type GetCommitteeMemberGroupByPayload<T extends CommitteeMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommitteeMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommitteeMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommitteeMemberGroupByOutputType[P]>
            : GetScalarType<T[P], CommitteeMemberGroupByOutputType[P]>
        }
      >
    >


  export type CommitteeMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    committeeId?: boolean
    userId?: boolean
    delegationId?: boolean
    presence?: boolean
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    user?: boolean | CommitteeMember$userArgs<ExtArgs>
    speakerLists?: boolean | CommitteeMember$speakerListsArgs<ExtArgs>
    delegation?: boolean | CommitteeMember$delegationArgs<ExtArgs>
    _count?: boolean | CommitteeMemberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["committeeMember"]>

  export type CommitteeMemberSelectScalar = {
    id?: boolean
    committeeId?: boolean
    userId?: boolean
    delegationId?: boolean
    presence?: boolean
  }


  export type CommitteeMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    user?: boolean | CommitteeMember$userArgs<ExtArgs>
    speakerLists?: boolean | CommitteeMember$speakerListsArgs<ExtArgs>
    delegation?: boolean | CommitteeMember$delegationArgs<ExtArgs>
    _count?: boolean | CommitteeMemberCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $CommitteeMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommitteeMember"
    objects: {
      committee: Prisma.$CommitteePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
      speakerLists: Prisma.$SpeakerOnListPayload<ExtArgs>[]
      delegation: Prisma.$DelegationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      committeeId: string
      userId: string | null
      delegationId: string | null
      presence: $Enums.Presence
    }, ExtArgs["result"]["committeeMember"]>
    composites: {}
  }


  type CommitteeMemberGetPayload<S extends boolean | null | undefined | CommitteeMemberDefaultArgs> = $Result.GetResult<Prisma.$CommitteeMemberPayload, S>

  type CommitteeMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommitteeMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommitteeMemberCountAggregateInputType | true
    }

  export interface CommitteeMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommitteeMember'], meta: { name: 'CommitteeMember' } }
    /**
     * Find zero or one CommitteeMember that matches the filter.
     * @param {CommitteeMemberFindUniqueArgs} args - Arguments to find a CommitteeMember
     * @example
     * // Get one CommitteeMember
     * const committeeMember = await prisma.committeeMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CommitteeMemberFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberFindUniqueArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one CommitteeMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommitteeMemberFindUniqueOrThrowArgs} args - Arguments to find a CommitteeMember
     * @example
     * // Get one CommitteeMember
     * const committeeMember = await prisma.committeeMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CommitteeMemberFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first CommitteeMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberFindFirstArgs} args - Arguments to find a CommitteeMember
     * @example
     * // Get one CommitteeMember
     * const committeeMember = await prisma.committeeMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CommitteeMemberFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberFindFirstArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first CommitteeMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberFindFirstOrThrowArgs} args - Arguments to find a CommitteeMember
     * @example
     * // Get one CommitteeMember
     * const committeeMember = await prisma.committeeMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CommitteeMemberFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more CommitteeMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommitteeMembers
     * const committeeMembers = await prisma.committeeMember.findMany()
     * 
     * // Get first 10 CommitteeMembers
     * const committeeMembers = await prisma.committeeMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const committeeMemberWithIdOnly = await prisma.committeeMember.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CommitteeMemberFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a CommitteeMember.
     * @param {CommitteeMemberCreateArgs} args - Arguments to create a CommitteeMember.
     * @example
     * // Create one CommitteeMember
     * const CommitteeMember = await prisma.committeeMember.create({
     *   data: {
     *     // ... data to create a CommitteeMember
     *   }
     * })
     * 
    **/
    create<T extends CommitteeMemberCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberCreateArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many CommitteeMembers.
     * @param {CommitteeMemberCreateManyArgs} args - Arguments to create many CommitteeMembers.
     * @example
     * // Create many CommitteeMembers
     * const committeeMember = await prisma.committeeMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends CommitteeMemberCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommitteeMembers and returns the data saved in the database.
     * @param {CommitteeMemberCreateManyAndReturnArgs} args - Arguments to create many CommitteeMembers.
     * @example
     * // Create many CommitteeMembers
     * const committeeMember = await prisma.committeeMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommitteeMembers and only return the `id`
     * const committeeMemberWithIdOnly = await prisma.committeeMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends CommitteeMemberCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a CommitteeMember.
     * @param {CommitteeMemberDeleteArgs} args - Arguments to delete one CommitteeMember.
     * @example
     * // Delete one CommitteeMember
     * const CommitteeMember = await prisma.committeeMember.delete({
     *   where: {
     *     // ... filter to delete one CommitteeMember
     *   }
     * })
     * 
    **/
    delete<T extends CommitteeMemberDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberDeleteArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one CommitteeMember.
     * @param {CommitteeMemberUpdateArgs} args - Arguments to update one CommitteeMember.
     * @example
     * // Update one CommitteeMember
     * const committeeMember = await prisma.committeeMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CommitteeMemberUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberUpdateArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more CommitteeMembers.
     * @param {CommitteeMemberDeleteManyArgs} args - Arguments to filter CommitteeMembers to delete.
     * @example
     * // Delete a few CommitteeMembers
     * const { count } = await prisma.committeeMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CommitteeMemberDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeMemberDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommitteeMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommitteeMembers
     * const committeeMember = await prisma.committeeMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CommitteeMemberUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommitteeMember.
     * @param {CommitteeMemberUpsertArgs} args - Arguments to update or create a CommitteeMember.
     * @example
     * // Update or create a CommitteeMember
     * const committeeMember = await prisma.committeeMember.upsert({
     *   create: {
     *     // ... data to create a CommitteeMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommitteeMember we want to update
     *   }
     * })
    **/
    upsert<T extends CommitteeMemberUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CommitteeMemberUpsertArgs<ExtArgs>>
    ): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of CommitteeMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberCountArgs} args - Arguments to filter CommitteeMembers to count.
     * @example
     * // Count the number of CommitteeMembers
     * const count = await prisma.committeeMember.count({
     *   where: {
     *     // ... the filter for the CommitteeMembers we want to count
     *   }
     * })
    **/
    count<T extends CommitteeMemberCountArgs>(
      args?: Subset<T, CommitteeMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommitteeMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommitteeMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommitteeMemberAggregateArgs>(args: Subset<T, CommitteeMemberAggregateArgs>): Prisma.PrismaPromise<GetCommitteeMemberAggregateType<T>>

    /**
     * Group by CommitteeMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitteeMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommitteeMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommitteeMemberGroupByArgs['orderBy'] }
        : { orderBy?: CommitteeMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommitteeMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommitteeMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommitteeMember model
   */
  readonly fields: CommitteeMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommitteeMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommitteeMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    committee<T extends CommitteeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeDefaultArgs<ExtArgs>>): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    user<T extends CommitteeMember$userArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeMember$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    speakerLists<T extends CommitteeMember$speakerListsArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeMember$speakerListsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findMany'> | Null>;

    delegation<T extends CommitteeMember$delegationArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeMember$delegationArgs<ExtArgs>>): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the CommitteeMember model
   */ 
  interface CommitteeMemberFieldRefs {
    readonly id: FieldRef<"CommitteeMember", 'String'>
    readonly committeeId: FieldRef<"CommitteeMember", 'String'>
    readonly userId: FieldRef<"CommitteeMember", 'String'>
    readonly delegationId: FieldRef<"CommitteeMember", 'String'>
    readonly presence: FieldRef<"CommitteeMember", 'Presence'>
  }
    

  // Custom InputTypes
  /**
   * CommitteeMember findUnique
   */
  export type CommitteeMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter, which CommitteeMember to fetch.
     */
    where: CommitteeMemberWhereUniqueInput
  }

  /**
   * CommitteeMember findUniqueOrThrow
   */
  export type CommitteeMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter, which CommitteeMember to fetch.
     */
    where: CommitteeMemberWhereUniqueInput
  }

  /**
   * CommitteeMember findFirst
   */
  export type CommitteeMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter, which CommitteeMember to fetch.
     */
    where?: CommitteeMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommitteeMembers to fetch.
     */
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommitteeMembers.
     */
    cursor?: CommitteeMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommitteeMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommitteeMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommitteeMembers.
     */
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * CommitteeMember findFirstOrThrow
   */
  export type CommitteeMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter, which CommitteeMember to fetch.
     */
    where?: CommitteeMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommitteeMembers to fetch.
     */
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommitteeMembers.
     */
    cursor?: CommitteeMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommitteeMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommitteeMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommitteeMembers.
     */
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * CommitteeMember findMany
   */
  export type CommitteeMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter, which CommitteeMembers to fetch.
     */
    where?: CommitteeMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommitteeMembers to fetch.
     */
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommitteeMembers.
     */
    cursor?: CommitteeMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommitteeMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommitteeMembers.
     */
    skip?: number
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * CommitteeMember create
   */
  export type CommitteeMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a CommitteeMember.
     */
    data: XOR<CommitteeMemberCreateInput, CommitteeMemberUncheckedCreateInput>
  }

  /**
   * CommitteeMember createMany
   */
  export type CommitteeMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommitteeMembers.
     */
    data: CommitteeMemberCreateManyInput | CommitteeMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommitteeMember createManyAndReturn
   */
  export type CommitteeMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * The data used to create many CommitteeMembers.
     */
    data: CommitteeMemberCreateManyInput | CommitteeMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommitteeMember update
   */
  export type CommitteeMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a CommitteeMember.
     */
    data: XOR<CommitteeMemberUpdateInput, CommitteeMemberUncheckedUpdateInput>
    /**
     * Choose, which CommitteeMember to update.
     */
    where: CommitteeMemberWhereUniqueInput
  }

  /**
   * CommitteeMember updateMany
   */
  export type CommitteeMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommitteeMembers.
     */
    data: XOR<CommitteeMemberUpdateManyMutationInput, CommitteeMemberUncheckedUpdateManyInput>
    /**
     * Filter which CommitteeMembers to update
     */
    where?: CommitteeMemberWhereInput
  }

  /**
   * CommitteeMember upsert
   */
  export type CommitteeMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the CommitteeMember to update in case it exists.
     */
    where: CommitteeMemberWhereUniqueInput
    /**
     * In case the CommitteeMember found by the `where` argument doesn't exist, create a new CommitteeMember with this data.
     */
    create: XOR<CommitteeMemberCreateInput, CommitteeMemberUncheckedCreateInput>
    /**
     * In case the CommitteeMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommitteeMemberUpdateInput, CommitteeMemberUncheckedUpdateInput>
  }

  /**
   * CommitteeMember delete
   */
  export type CommitteeMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    /**
     * Filter which CommitteeMember to delete.
     */
    where: CommitteeMemberWhereUniqueInput
  }

  /**
   * CommitteeMember deleteMany
   */
  export type CommitteeMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommitteeMembers to delete
     */
    where?: CommitteeMemberWhereInput
  }

  /**
   * CommitteeMember.user
   */
  export type CommitteeMember$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * CommitteeMember.speakerLists
   */
  export type CommitteeMember$speakerListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    where?: SpeakerOnListWhereInput
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    cursor?: SpeakerOnListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpeakerOnListScalarFieldEnum | SpeakerOnListScalarFieldEnum[]
  }

  /**
   * CommitteeMember.delegation
   */
  export type CommitteeMember$delegationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    where?: DelegationWhereInput
  }

  /**
   * CommitteeMember without action
   */
  export type CommitteeMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
  }


  /**
   * Model AgendaItem
   */

  export type AggregateAgendaItem = {
    _count: AgendaItemCountAggregateOutputType | null
    _min: AgendaItemMinAggregateOutputType | null
    _max: AgendaItemMaxAggregateOutputType | null
  }

  export type AgendaItemMinAggregateOutputType = {
    id: string | null
    committeeId: string | null
    title: string | null
    description: string | null
    isActive: boolean | null
  }

  export type AgendaItemMaxAggregateOutputType = {
    id: string | null
    committeeId: string | null
    title: string | null
    description: string | null
    isActive: boolean | null
  }

  export type AgendaItemCountAggregateOutputType = {
    id: number
    committeeId: number
    title: number
    description: number
    isActive: number
    _all: number
  }


  export type AgendaItemMinAggregateInputType = {
    id?: true
    committeeId?: true
    title?: true
    description?: true
    isActive?: true
  }

  export type AgendaItemMaxAggregateInputType = {
    id?: true
    committeeId?: true
    title?: true
    description?: true
    isActive?: true
  }

  export type AgendaItemCountAggregateInputType = {
    id?: true
    committeeId?: true
    title?: true
    description?: true
    isActive?: true
    _all?: true
  }

  export type AgendaItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgendaItem to aggregate.
     */
    where?: AgendaItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendaItems to fetch.
     */
    orderBy?: AgendaItemOrderByWithRelationInput | AgendaItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgendaItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendaItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendaItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgendaItems
    **/
    _count?: true | AgendaItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgendaItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgendaItemMaxAggregateInputType
  }

  export type GetAgendaItemAggregateType<T extends AgendaItemAggregateArgs> = {
        [P in keyof T & keyof AggregateAgendaItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgendaItem[P]>
      : GetScalarType<T[P], AggregateAgendaItem[P]>
  }




  export type AgendaItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendaItemWhereInput
    orderBy?: AgendaItemOrderByWithAggregationInput | AgendaItemOrderByWithAggregationInput[]
    by: AgendaItemScalarFieldEnum[] | AgendaItemScalarFieldEnum
    having?: AgendaItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgendaItemCountAggregateInputType | true
    _min?: AgendaItemMinAggregateInputType
    _max?: AgendaItemMaxAggregateInputType
  }

  export type AgendaItemGroupByOutputType = {
    id: string
    committeeId: string
    title: string
    description: string | null
    isActive: boolean
    _count: AgendaItemCountAggregateOutputType | null
    _min: AgendaItemMinAggregateOutputType | null
    _max: AgendaItemMaxAggregateOutputType | null
  }

  type GetAgendaItemGroupByPayload<T extends AgendaItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgendaItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgendaItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgendaItemGroupByOutputType[P]>
            : GetScalarType<T[P], AgendaItemGroupByOutputType[P]>
        }
      >
    >


  export type AgendaItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    committeeId?: boolean
    title?: boolean
    description?: boolean
    isActive?: boolean
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    speakerLists?: boolean | AgendaItem$speakerListsArgs<ExtArgs>
    _count?: boolean | AgendaItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agendaItem"]>

  export type AgendaItemSelectScalar = {
    id?: boolean
    committeeId?: boolean
    title?: boolean
    description?: boolean
    isActive?: boolean
  }


  export type AgendaItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    speakerLists?: boolean | AgendaItem$speakerListsArgs<ExtArgs>
    _count?: boolean | AgendaItemCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $AgendaItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgendaItem"
    objects: {
      committee: Prisma.$CommitteePayload<ExtArgs>
      speakerLists: Prisma.$SpeakersListPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      committeeId: string
      title: string
      description: string | null
      isActive: boolean
    }, ExtArgs["result"]["agendaItem"]>
    composites: {}
  }


  type AgendaItemGetPayload<S extends boolean | null | undefined | AgendaItemDefaultArgs> = $Result.GetResult<Prisma.$AgendaItemPayload, S>

  type AgendaItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgendaItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgendaItemCountAggregateInputType | true
    }

  export interface AgendaItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgendaItem'], meta: { name: 'AgendaItem' } }
    /**
     * Find zero or one AgendaItem that matches the filter.
     * @param {AgendaItemFindUniqueArgs} args - Arguments to find a AgendaItem
     * @example
     * // Get one AgendaItem
     * const agendaItem = await prisma.agendaItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AgendaItemFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemFindUniqueArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one AgendaItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgendaItemFindUniqueOrThrowArgs} args - Arguments to find a AgendaItem
     * @example
     * // Get one AgendaItem
     * const agendaItem = await prisma.agendaItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AgendaItemFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first AgendaItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemFindFirstArgs} args - Arguments to find a AgendaItem
     * @example
     * // Get one AgendaItem
     * const agendaItem = await prisma.agendaItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AgendaItemFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemFindFirstArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first AgendaItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemFindFirstOrThrowArgs} args - Arguments to find a AgendaItem
     * @example
     * // Get one AgendaItem
     * const agendaItem = await prisma.agendaItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AgendaItemFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more AgendaItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgendaItems
     * const agendaItems = await prisma.agendaItem.findMany()
     * 
     * // Get first 10 AgendaItems
     * const agendaItems = await prisma.agendaItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agendaItemWithIdOnly = await prisma.agendaItem.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AgendaItemFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a AgendaItem.
     * @param {AgendaItemCreateArgs} args - Arguments to create a AgendaItem.
     * @example
     * // Create one AgendaItem
     * const AgendaItem = await prisma.agendaItem.create({
     *   data: {
     *     // ... data to create a AgendaItem
     *   }
     * })
     * 
    **/
    create<T extends AgendaItemCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemCreateArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many AgendaItems.
     * @param {AgendaItemCreateManyArgs} args - Arguments to create many AgendaItems.
     * @example
     * // Create many AgendaItems
     * const agendaItem = await prisma.agendaItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends AgendaItemCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgendaItems and returns the data saved in the database.
     * @param {AgendaItemCreateManyAndReturnArgs} args - Arguments to create many AgendaItems.
     * @example
     * // Create many AgendaItems
     * const agendaItem = await prisma.agendaItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgendaItems and only return the `id`
     * const agendaItemWithIdOnly = await prisma.agendaItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends AgendaItemCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a AgendaItem.
     * @param {AgendaItemDeleteArgs} args - Arguments to delete one AgendaItem.
     * @example
     * // Delete one AgendaItem
     * const AgendaItem = await prisma.agendaItem.delete({
     *   where: {
     *     // ... filter to delete one AgendaItem
     *   }
     * })
     * 
    **/
    delete<T extends AgendaItemDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemDeleteArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one AgendaItem.
     * @param {AgendaItemUpdateArgs} args - Arguments to update one AgendaItem.
     * @example
     * // Update one AgendaItem
     * const agendaItem = await prisma.agendaItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AgendaItemUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemUpdateArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more AgendaItems.
     * @param {AgendaItemDeleteManyArgs} args - Arguments to filter AgendaItems to delete.
     * @example
     * // Delete a few AgendaItems
     * const { count } = await prisma.agendaItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AgendaItemDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AgendaItemDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgendaItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgendaItems
     * const agendaItem = await prisma.agendaItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AgendaItemUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AgendaItem.
     * @param {AgendaItemUpsertArgs} args - Arguments to update or create a AgendaItem.
     * @example
     * // Update or create a AgendaItem
     * const agendaItem = await prisma.agendaItem.upsert({
     *   create: {
     *     // ... data to create a AgendaItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgendaItem we want to update
     *   }
     * })
    **/
    upsert<T extends AgendaItemUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AgendaItemUpsertArgs<ExtArgs>>
    ): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of AgendaItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemCountArgs} args - Arguments to filter AgendaItems to count.
     * @example
     * // Count the number of AgendaItems
     * const count = await prisma.agendaItem.count({
     *   where: {
     *     // ... the filter for the AgendaItems we want to count
     *   }
     * })
    **/
    count<T extends AgendaItemCountArgs>(
      args?: Subset<T, AgendaItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgendaItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgendaItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgendaItemAggregateArgs>(args: Subset<T, AgendaItemAggregateArgs>): Prisma.PrismaPromise<GetAgendaItemAggregateType<T>>

    /**
     * Group by AgendaItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendaItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgendaItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgendaItemGroupByArgs['orderBy'] }
        : { orderBy?: AgendaItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgendaItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgendaItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgendaItem model
   */
  readonly fields: AgendaItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgendaItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgendaItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    committee<T extends CommitteeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeDefaultArgs<ExtArgs>>): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    speakerLists<T extends AgendaItem$speakerListsArgs<ExtArgs> = {}>(args?: Subset<T, AgendaItem$speakerListsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the AgendaItem model
   */ 
  interface AgendaItemFieldRefs {
    readonly id: FieldRef<"AgendaItem", 'String'>
    readonly committeeId: FieldRef<"AgendaItem", 'String'>
    readonly title: FieldRef<"AgendaItem", 'String'>
    readonly description: FieldRef<"AgendaItem", 'String'>
    readonly isActive: FieldRef<"AgendaItem", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AgendaItem findUnique
   */
  export type AgendaItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter, which AgendaItem to fetch.
     */
    where: AgendaItemWhereUniqueInput
  }

  /**
   * AgendaItem findUniqueOrThrow
   */
  export type AgendaItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter, which AgendaItem to fetch.
     */
    where: AgendaItemWhereUniqueInput
  }

  /**
   * AgendaItem findFirst
   */
  export type AgendaItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter, which AgendaItem to fetch.
     */
    where?: AgendaItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendaItems to fetch.
     */
    orderBy?: AgendaItemOrderByWithRelationInput | AgendaItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgendaItems.
     */
    cursor?: AgendaItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendaItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendaItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgendaItems.
     */
    distinct?: AgendaItemScalarFieldEnum | AgendaItemScalarFieldEnum[]
  }

  /**
   * AgendaItem findFirstOrThrow
   */
  export type AgendaItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter, which AgendaItem to fetch.
     */
    where?: AgendaItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendaItems to fetch.
     */
    orderBy?: AgendaItemOrderByWithRelationInput | AgendaItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgendaItems.
     */
    cursor?: AgendaItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendaItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendaItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgendaItems.
     */
    distinct?: AgendaItemScalarFieldEnum | AgendaItemScalarFieldEnum[]
  }

  /**
   * AgendaItem findMany
   */
  export type AgendaItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter, which AgendaItems to fetch.
     */
    where?: AgendaItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendaItems to fetch.
     */
    orderBy?: AgendaItemOrderByWithRelationInput | AgendaItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgendaItems.
     */
    cursor?: AgendaItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendaItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendaItems.
     */
    skip?: number
    distinct?: AgendaItemScalarFieldEnum | AgendaItemScalarFieldEnum[]
  }

  /**
   * AgendaItem create
   */
  export type AgendaItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * The data needed to create a AgendaItem.
     */
    data: XOR<AgendaItemCreateInput, AgendaItemUncheckedCreateInput>
  }

  /**
   * AgendaItem createMany
   */
  export type AgendaItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgendaItems.
     */
    data: AgendaItemCreateManyInput | AgendaItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgendaItem createManyAndReturn
   */
  export type AgendaItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * The data used to create many AgendaItems.
     */
    data: AgendaItemCreateManyInput | AgendaItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgendaItem update
   */
  export type AgendaItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * The data needed to update a AgendaItem.
     */
    data: XOR<AgendaItemUpdateInput, AgendaItemUncheckedUpdateInput>
    /**
     * Choose, which AgendaItem to update.
     */
    where: AgendaItemWhereUniqueInput
  }

  /**
   * AgendaItem updateMany
   */
  export type AgendaItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgendaItems.
     */
    data: XOR<AgendaItemUpdateManyMutationInput, AgendaItemUncheckedUpdateManyInput>
    /**
     * Filter which AgendaItems to update
     */
    where?: AgendaItemWhereInput
  }

  /**
   * AgendaItem upsert
   */
  export type AgendaItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * The filter to search for the AgendaItem to update in case it exists.
     */
    where: AgendaItemWhereUniqueInput
    /**
     * In case the AgendaItem found by the `where` argument doesn't exist, create a new AgendaItem with this data.
     */
    create: XOR<AgendaItemCreateInput, AgendaItemUncheckedCreateInput>
    /**
     * In case the AgendaItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgendaItemUpdateInput, AgendaItemUncheckedUpdateInput>
  }

  /**
   * AgendaItem delete
   */
  export type AgendaItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
    /**
     * Filter which AgendaItem to delete.
     */
    where: AgendaItemWhereUniqueInput
  }

  /**
   * AgendaItem deleteMany
   */
  export type AgendaItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgendaItems to delete
     */
    where?: AgendaItemWhereInput
  }

  /**
   * AgendaItem.speakerLists
   */
  export type AgendaItem$speakerListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    where?: SpeakersListWhereInput
    orderBy?: SpeakersListOrderByWithRelationInput | SpeakersListOrderByWithRelationInput[]
    cursor?: SpeakersListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpeakersListScalarFieldEnum | SpeakersListScalarFieldEnum[]
  }

  /**
   * AgendaItem without action
   */
  export type AgendaItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendaItem
     */
    select?: AgendaItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendaItemInclude<ExtArgs> | null
  }


  /**
   * Model SpeakersList
   */

  export type AggregateSpeakersList = {
    _count: SpeakersListCountAggregateOutputType | null
    _avg: SpeakersListAvgAggregateOutputType | null
    _sum: SpeakersListSumAggregateOutputType | null
    _min: SpeakersListMinAggregateOutputType | null
    _max: SpeakersListMaxAggregateOutputType | null
  }

  export type SpeakersListAvgAggregateOutputType = {
    speakingTime: number | null
    timeLeft: number | null
  }

  export type SpeakersListSumAggregateOutputType = {
    speakingTime: number | null
    timeLeft: number | null
  }

  export type SpeakersListMinAggregateOutputType = {
    id: string | null
    agendaItemId: string | null
    type: $Enums.SpeakersListCategory | null
    speakingTime: number | null
    timeLeft: number | null
    startTimestamp: Date | null
    isClosed: boolean | null
  }

  export type SpeakersListMaxAggregateOutputType = {
    id: string | null
    agendaItemId: string | null
    type: $Enums.SpeakersListCategory | null
    speakingTime: number | null
    timeLeft: number | null
    startTimestamp: Date | null
    isClosed: boolean | null
  }

  export type SpeakersListCountAggregateOutputType = {
    id: number
    agendaItemId: number
    type: number
    speakingTime: number
    timeLeft: number
    startTimestamp: number
    isClosed: number
    _all: number
  }


  export type SpeakersListAvgAggregateInputType = {
    speakingTime?: true
    timeLeft?: true
  }

  export type SpeakersListSumAggregateInputType = {
    speakingTime?: true
    timeLeft?: true
  }

  export type SpeakersListMinAggregateInputType = {
    id?: true
    agendaItemId?: true
    type?: true
    speakingTime?: true
    timeLeft?: true
    startTimestamp?: true
    isClosed?: true
  }

  export type SpeakersListMaxAggregateInputType = {
    id?: true
    agendaItemId?: true
    type?: true
    speakingTime?: true
    timeLeft?: true
    startTimestamp?: true
    isClosed?: true
  }

  export type SpeakersListCountAggregateInputType = {
    id?: true
    agendaItemId?: true
    type?: true
    speakingTime?: true
    timeLeft?: true
    startTimestamp?: true
    isClosed?: true
    _all?: true
  }

  export type SpeakersListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakersList to aggregate.
     */
    where?: SpeakersListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakersLists to fetch.
     */
    orderBy?: SpeakersListOrderByWithRelationInput | SpeakersListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpeakersListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakersLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakersLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpeakersLists
    **/
    _count?: true | SpeakersListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpeakersListAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpeakersListSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpeakersListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpeakersListMaxAggregateInputType
  }

  export type GetSpeakersListAggregateType<T extends SpeakersListAggregateArgs> = {
        [P in keyof T & keyof AggregateSpeakersList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpeakersList[P]>
      : GetScalarType<T[P], AggregateSpeakersList[P]>
  }




  export type SpeakersListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakersListWhereInput
    orderBy?: SpeakersListOrderByWithAggregationInput | SpeakersListOrderByWithAggregationInput[]
    by: SpeakersListScalarFieldEnum[] | SpeakersListScalarFieldEnum
    having?: SpeakersListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpeakersListCountAggregateInputType | true
    _avg?: SpeakersListAvgAggregateInputType
    _sum?: SpeakersListSumAggregateInputType
    _min?: SpeakersListMinAggregateInputType
    _max?: SpeakersListMaxAggregateInputType
  }

  export type SpeakersListGroupByOutputType = {
    id: string
    agendaItemId: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft: number | null
    startTimestamp: Date | null
    isClosed: boolean
    _count: SpeakersListCountAggregateOutputType | null
    _avg: SpeakersListAvgAggregateOutputType | null
    _sum: SpeakersListSumAggregateOutputType | null
    _min: SpeakersListMinAggregateOutputType | null
    _max: SpeakersListMaxAggregateOutputType | null
  }

  type GetSpeakersListGroupByPayload<T extends SpeakersListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpeakersListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpeakersListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpeakersListGroupByOutputType[P]>
            : GetScalarType<T[P], SpeakersListGroupByOutputType[P]>
        }
      >
    >


  export type SpeakersListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agendaItemId?: boolean
    type?: boolean
    speakingTime?: boolean
    timeLeft?: boolean
    startTimestamp?: boolean
    isClosed?: boolean
    agendaItem?: boolean | AgendaItemDefaultArgs<ExtArgs>
    speakers?: boolean | SpeakersList$speakersArgs<ExtArgs>
    _count?: boolean | SpeakersListCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speakersList"]>

  export type SpeakersListSelectScalar = {
    id?: boolean
    agendaItemId?: boolean
    type?: boolean
    speakingTime?: boolean
    timeLeft?: boolean
    startTimestamp?: boolean
    isClosed?: boolean
  }


  export type SpeakersListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendaItem?: boolean | AgendaItemDefaultArgs<ExtArgs>
    speakers?: boolean | SpeakersList$speakersArgs<ExtArgs>
    _count?: boolean | SpeakersListCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $SpeakersListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpeakersList"
    objects: {
      agendaItem: Prisma.$AgendaItemPayload<ExtArgs>
      speakers: Prisma.$SpeakerOnListPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agendaItemId: string
      type: $Enums.SpeakersListCategory
      /**
       * The time in seconds that a speaker has to speak
       */
      speakingTime: number
      timeLeft: number | null
      startTimestamp: Date | null
      isClosed: boolean
    }, ExtArgs["result"]["speakersList"]>
    composites: {}
  }


  type SpeakersListGetPayload<S extends boolean | null | undefined | SpeakersListDefaultArgs> = $Result.GetResult<Prisma.$SpeakersListPayload, S>

  type SpeakersListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SpeakersListFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SpeakersListCountAggregateInputType | true
    }

  export interface SpeakersListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpeakersList'], meta: { name: 'SpeakersList' } }
    /**
     * Find zero or one SpeakersList that matches the filter.
     * @param {SpeakersListFindUniqueArgs} args - Arguments to find a SpeakersList
     * @example
     * // Get one SpeakersList
     * const speakersList = await prisma.speakersList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SpeakersListFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListFindUniqueArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SpeakersList that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SpeakersListFindUniqueOrThrowArgs} args - Arguments to find a SpeakersList
     * @example
     * // Get one SpeakersList
     * const speakersList = await prisma.speakersList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SpeakersListFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SpeakersList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListFindFirstArgs} args - Arguments to find a SpeakersList
     * @example
     * // Get one SpeakersList
     * const speakersList = await prisma.speakersList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SpeakersListFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListFindFirstArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SpeakersList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListFindFirstOrThrowArgs} args - Arguments to find a SpeakersList
     * @example
     * // Get one SpeakersList
     * const speakersList = await prisma.speakersList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SpeakersListFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SpeakersLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpeakersLists
     * const speakersLists = await prisma.speakersList.findMany()
     * 
     * // Get first 10 SpeakersLists
     * const speakersLists = await prisma.speakersList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const speakersListWithIdOnly = await prisma.speakersList.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SpeakersListFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SpeakersList.
     * @param {SpeakersListCreateArgs} args - Arguments to create a SpeakersList.
     * @example
     * // Create one SpeakersList
     * const SpeakersList = await prisma.speakersList.create({
     *   data: {
     *     // ... data to create a SpeakersList
     *   }
     * })
     * 
    **/
    create<T extends SpeakersListCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListCreateArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many SpeakersLists.
     * @param {SpeakersListCreateManyArgs} args - Arguments to create many SpeakersLists.
     * @example
     * // Create many SpeakersLists
     * const speakersList = await prisma.speakersList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends SpeakersListCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpeakersLists and returns the data saved in the database.
     * @param {SpeakersListCreateManyAndReturnArgs} args - Arguments to create many SpeakersLists.
     * @example
     * // Create many SpeakersLists
     * const speakersList = await prisma.speakersList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpeakersLists and only return the `id`
     * const speakersListWithIdOnly = await prisma.speakersList.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends SpeakersListCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a SpeakersList.
     * @param {SpeakersListDeleteArgs} args - Arguments to delete one SpeakersList.
     * @example
     * // Delete one SpeakersList
     * const SpeakersList = await prisma.speakersList.delete({
     *   where: {
     *     // ... filter to delete one SpeakersList
     *   }
     * })
     * 
    **/
    delete<T extends SpeakersListDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListDeleteArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SpeakersList.
     * @param {SpeakersListUpdateArgs} args - Arguments to update one SpeakersList.
     * @example
     * // Update one SpeakersList
     * const speakersList = await prisma.speakersList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SpeakersListUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListUpdateArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SpeakersLists.
     * @param {SpeakersListDeleteManyArgs} args - Arguments to filter SpeakersLists to delete.
     * @example
     * // Delete a few SpeakersLists
     * const { count } = await prisma.speakersList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SpeakersListDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakersListDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpeakersLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpeakersLists
     * const speakersList = await prisma.speakersList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SpeakersListUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SpeakersList.
     * @param {SpeakersListUpsertArgs} args - Arguments to update or create a SpeakersList.
     * @example
     * // Update or create a SpeakersList
     * const speakersList = await prisma.speakersList.upsert({
     *   create: {
     *     // ... data to create a SpeakersList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpeakersList we want to update
     *   }
     * })
    **/
    upsert<T extends SpeakersListUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakersListUpsertArgs<ExtArgs>>
    ): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SpeakersLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListCountArgs} args - Arguments to filter SpeakersLists to count.
     * @example
     * // Count the number of SpeakersLists
     * const count = await prisma.speakersList.count({
     *   where: {
     *     // ... the filter for the SpeakersLists we want to count
     *   }
     * })
    **/
    count<T extends SpeakersListCountArgs>(
      args?: Subset<T, SpeakersListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpeakersListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpeakersList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpeakersListAggregateArgs>(args: Subset<T, SpeakersListAggregateArgs>): Prisma.PrismaPromise<GetSpeakersListAggregateType<T>>

    /**
     * Group by SpeakersList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakersListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpeakersListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpeakersListGroupByArgs['orderBy'] }
        : { orderBy?: SpeakersListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpeakersListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpeakersListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpeakersList model
   */
  readonly fields: SpeakersListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpeakersList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpeakersListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    agendaItem<T extends AgendaItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgendaItemDefaultArgs<ExtArgs>>): Prisma__AgendaItemClient<$Result.GetResult<Prisma.$AgendaItemPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    speakers<T extends SpeakersList$speakersArgs<ExtArgs> = {}>(args?: Subset<T, SpeakersList$speakersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the SpeakersList model
   */ 
  interface SpeakersListFieldRefs {
    readonly id: FieldRef<"SpeakersList", 'String'>
    readonly agendaItemId: FieldRef<"SpeakersList", 'String'>
    readonly type: FieldRef<"SpeakersList", 'SpeakersListCategory'>
    readonly speakingTime: FieldRef<"SpeakersList", 'Int'>
    readonly timeLeft: FieldRef<"SpeakersList", 'Int'>
    readonly startTimestamp: FieldRef<"SpeakersList", 'DateTime'>
    readonly isClosed: FieldRef<"SpeakersList", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * SpeakersList findUnique
   */
  export type SpeakersListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakersList to fetch.
     */
    where: SpeakersListWhereUniqueInput
  }

  /**
   * SpeakersList findUniqueOrThrow
   */
  export type SpeakersListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakersList to fetch.
     */
    where: SpeakersListWhereUniqueInput
  }

  /**
   * SpeakersList findFirst
   */
  export type SpeakersListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakersList to fetch.
     */
    where?: SpeakersListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakersLists to fetch.
     */
    orderBy?: SpeakersListOrderByWithRelationInput | SpeakersListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakersLists.
     */
    cursor?: SpeakersListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakersLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakersLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakersLists.
     */
    distinct?: SpeakersListScalarFieldEnum | SpeakersListScalarFieldEnum[]
  }

  /**
   * SpeakersList findFirstOrThrow
   */
  export type SpeakersListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakersList to fetch.
     */
    where?: SpeakersListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakersLists to fetch.
     */
    orderBy?: SpeakersListOrderByWithRelationInput | SpeakersListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakersLists.
     */
    cursor?: SpeakersListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakersLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakersLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakersLists.
     */
    distinct?: SpeakersListScalarFieldEnum | SpeakersListScalarFieldEnum[]
  }

  /**
   * SpeakersList findMany
   */
  export type SpeakersListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakersLists to fetch.
     */
    where?: SpeakersListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakersLists to fetch.
     */
    orderBy?: SpeakersListOrderByWithRelationInput | SpeakersListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpeakersLists.
     */
    cursor?: SpeakersListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakersLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakersLists.
     */
    skip?: number
    distinct?: SpeakersListScalarFieldEnum | SpeakersListScalarFieldEnum[]
  }

  /**
   * SpeakersList create
   */
  export type SpeakersListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * The data needed to create a SpeakersList.
     */
    data: XOR<SpeakersListCreateInput, SpeakersListUncheckedCreateInput>
  }

  /**
   * SpeakersList createMany
   */
  export type SpeakersListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpeakersLists.
     */
    data: SpeakersListCreateManyInput | SpeakersListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakersList createManyAndReturn
   */
  export type SpeakersListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * The data used to create many SpeakersLists.
     */
    data: SpeakersListCreateManyInput | SpeakersListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakersList update
   */
  export type SpeakersListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * The data needed to update a SpeakersList.
     */
    data: XOR<SpeakersListUpdateInput, SpeakersListUncheckedUpdateInput>
    /**
     * Choose, which SpeakersList to update.
     */
    where: SpeakersListWhereUniqueInput
  }

  /**
   * SpeakersList updateMany
   */
  export type SpeakersListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpeakersLists.
     */
    data: XOR<SpeakersListUpdateManyMutationInput, SpeakersListUncheckedUpdateManyInput>
    /**
     * Filter which SpeakersLists to update
     */
    where?: SpeakersListWhereInput
  }

  /**
   * SpeakersList upsert
   */
  export type SpeakersListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * The filter to search for the SpeakersList to update in case it exists.
     */
    where: SpeakersListWhereUniqueInput
    /**
     * In case the SpeakersList found by the `where` argument doesn't exist, create a new SpeakersList with this data.
     */
    create: XOR<SpeakersListCreateInput, SpeakersListUncheckedCreateInput>
    /**
     * In case the SpeakersList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpeakersListUpdateInput, SpeakersListUncheckedUpdateInput>
  }

  /**
   * SpeakersList delete
   */
  export type SpeakersListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
    /**
     * Filter which SpeakersList to delete.
     */
    where: SpeakersListWhereUniqueInput
  }

  /**
   * SpeakersList deleteMany
   */
  export type SpeakersListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakersLists to delete
     */
    where?: SpeakersListWhereInput
  }

  /**
   * SpeakersList.speakers
   */
  export type SpeakersList$speakersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    where?: SpeakerOnListWhereInput
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    cursor?: SpeakerOnListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpeakerOnListScalarFieldEnum | SpeakerOnListScalarFieldEnum[]
  }

  /**
   * SpeakersList without action
   */
  export type SpeakersListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakersList
     */
    select?: SpeakersListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakersListInclude<ExtArgs> | null
  }


  /**
   * Model SpeakerOnList
   */

  export type AggregateSpeakerOnList = {
    _count: SpeakerOnListCountAggregateOutputType | null
    _avg: SpeakerOnListAvgAggregateOutputType | null
    _sum: SpeakerOnListSumAggregateOutputType | null
    _min: SpeakerOnListMinAggregateOutputType | null
    _max: SpeakerOnListMaxAggregateOutputType | null
  }

  export type SpeakerOnListAvgAggregateOutputType = {
    position: number | null
  }

  export type SpeakerOnListSumAggregateOutputType = {
    position: number | null
  }

  export type SpeakerOnListMinAggregateOutputType = {
    id: string | null
    speakersListId: string | null
    committeeMemberId: string | null
    position: number | null
  }

  export type SpeakerOnListMaxAggregateOutputType = {
    id: string | null
    speakersListId: string | null
    committeeMemberId: string | null
    position: number | null
  }

  export type SpeakerOnListCountAggregateOutputType = {
    id: number
    speakersListId: number
    committeeMemberId: number
    position: number
    _all: number
  }


  export type SpeakerOnListAvgAggregateInputType = {
    position?: true
  }

  export type SpeakerOnListSumAggregateInputType = {
    position?: true
  }

  export type SpeakerOnListMinAggregateInputType = {
    id?: true
    speakersListId?: true
    committeeMemberId?: true
    position?: true
  }

  export type SpeakerOnListMaxAggregateInputType = {
    id?: true
    speakersListId?: true
    committeeMemberId?: true
    position?: true
  }

  export type SpeakerOnListCountAggregateInputType = {
    id?: true
    speakersListId?: true
    committeeMemberId?: true
    position?: true
    _all?: true
  }

  export type SpeakerOnListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakerOnList to aggregate.
     */
    where?: SpeakerOnListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakerOnLists to fetch.
     */
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpeakerOnListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakerOnLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakerOnLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpeakerOnLists
    **/
    _count?: true | SpeakerOnListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpeakerOnListAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpeakerOnListSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpeakerOnListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpeakerOnListMaxAggregateInputType
  }

  export type GetSpeakerOnListAggregateType<T extends SpeakerOnListAggregateArgs> = {
        [P in keyof T & keyof AggregateSpeakerOnList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpeakerOnList[P]>
      : GetScalarType<T[P], AggregateSpeakerOnList[P]>
  }




  export type SpeakerOnListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakerOnListWhereInput
    orderBy?: SpeakerOnListOrderByWithAggregationInput | SpeakerOnListOrderByWithAggregationInput[]
    by: SpeakerOnListScalarFieldEnum[] | SpeakerOnListScalarFieldEnum
    having?: SpeakerOnListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpeakerOnListCountAggregateInputType | true
    _avg?: SpeakerOnListAvgAggregateInputType
    _sum?: SpeakerOnListSumAggregateInputType
    _min?: SpeakerOnListMinAggregateInputType
    _max?: SpeakerOnListMaxAggregateInputType
  }

  export type SpeakerOnListGroupByOutputType = {
    id: string
    speakersListId: string
    committeeMemberId: string
    position: number
    _count: SpeakerOnListCountAggregateOutputType | null
    _avg: SpeakerOnListAvgAggregateOutputType | null
    _sum: SpeakerOnListSumAggregateOutputType | null
    _min: SpeakerOnListMinAggregateOutputType | null
    _max: SpeakerOnListMaxAggregateOutputType | null
  }

  type GetSpeakerOnListGroupByPayload<T extends SpeakerOnListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpeakerOnListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpeakerOnListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpeakerOnListGroupByOutputType[P]>
            : GetScalarType<T[P], SpeakerOnListGroupByOutputType[P]>
        }
      >
    >


  export type SpeakerOnListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    speakersListId?: boolean
    committeeMemberId?: boolean
    position?: boolean
    speakersList?: boolean | SpeakersListDefaultArgs<ExtArgs>
    committeeMember?: boolean | CommitteeMemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speakerOnList"]>

  export type SpeakerOnListSelectScalar = {
    id?: boolean
    speakersListId?: boolean
    committeeMemberId?: boolean
    position?: boolean
  }


  export type SpeakerOnListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    speakersList?: boolean | SpeakersListDefaultArgs<ExtArgs>
    committeeMember?: boolean | CommitteeMemberDefaultArgs<ExtArgs>
  }


  export type $SpeakerOnListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpeakerOnList"
    objects: {
      speakersList: Prisma.$SpeakersListPayload<ExtArgs>
      committeeMember: Prisma.$CommitteeMemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      speakersListId: string
      committeeMemberId: string
      position: number
    }, ExtArgs["result"]["speakerOnList"]>
    composites: {}
  }


  type SpeakerOnListGetPayload<S extends boolean | null | undefined | SpeakerOnListDefaultArgs> = $Result.GetResult<Prisma.$SpeakerOnListPayload, S>

  type SpeakerOnListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SpeakerOnListFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SpeakerOnListCountAggregateInputType | true
    }

  export interface SpeakerOnListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpeakerOnList'], meta: { name: 'SpeakerOnList' } }
    /**
     * Find zero or one SpeakerOnList that matches the filter.
     * @param {SpeakerOnListFindUniqueArgs} args - Arguments to find a SpeakerOnList
     * @example
     * // Get one SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SpeakerOnListFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListFindUniqueArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SpeakerOnList that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SpeakerOnListFindUniqueOrThrowArgs} args - Arguments to find a SpeakerOnList
     * @example
     * // Get one SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SpeakerOnListFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SpeakerOnList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListFindFirstArgs} args - Arguments to find a SpeakerOnList
     * @example
     * // Get one SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SpeakerOnListFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListFindFirstArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SpeakerOnList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListFindFirstOrThrowArgs} args - Arguments to find a SpeakerOnList
     * @example
     * // Get one SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SpeakerOnListFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SpeakerOnLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpeakerOnLists
     * const speakerOnLists = await prisma.speakerOnList.findMany()
     * 
     * // Get first 10 SpeakerOnLists
     * const speakerOnLists = await prisma.speakerOnList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const speakerOnListWithIdOnly = await prisma.speakerOnList.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SpeakerOnListFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SpeakerOnList.
     * @param {SpeakerOnListCreateArgs} args - Arguments to create a SpeakerOnList.
     * @example
     * // Create one SpeakerOnList
     * const SpeakerOnList = await prisma.speakerOnList.create({
     *   data: {
     *     // ... data to create a SpeakerOnList
     *   }
     * })
     * 
    **/
    create<T extends SpeakerOnListCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListCreateArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many SpeakerOnLists.
     * @param {SpeakerOnListCreateManyArgs} args - Arguments to create many SpeakerOnLists.
     * @example
     * // Create many SpeakerOnLists
     * const speakerOnList = await prisma.speakerOnList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends SpeakerOnListCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpeakerOnLists and returns the data saved in the database.
     * @param {SpeakerOnListCreateManyAndReturnArgs} args - Arguments to create many SpeakerOnLists.
     * @example
     * // Create many SpeakerOnLists
     * const speakerOnList = await prisma.speakerOnList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpeakerOnLists and only return the `id`
     * const speakerOnListWithIdOnly = await prisma.speakerOnList.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends SpeakerOnListCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a SpeakerOnList.
     * @param {SpeakerOnListDeleteArgs} args - Arguments to delete one SpeakerOnList.
     * @example
     * // Delete one SpeakerOnList
     * const SpeakerOnList = await prisma.speakerOnList.delete({
     *   where: {
     *     // ... filter to delete one SpeakerOnList
     *   }
     * })
     * 
    **/
    delete<T extends SpeakerOnListDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListDeleteArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SpeakerOnList.
     * @param {SpeakerOnListUpdateArgs} args - Arguments to update one SpeakerOnList.
     * @example
     * // Update one SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SpeakerOnListUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListUpdateArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SpeakerOnLists.
     * @param {SpeakerOnListDeleteManyArgs} args - Arguments to filter SpeakerOnLists to delete.
     * @example
     * // Delete a few SpeakerOnLists
     * const { count } = await prisma.speakerOnList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SpeakerOnListDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SpeakerOnListDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpeakerOnLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpeakerOnLists
     * const speakerOnList = await prisma.speakerOnList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SpeakerOnListUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SpeakerOnList.
     * @param {SpeakerOnListUpsertArgs} args - Arguments to update or create a SpeakerOnList.
     * @example
     * // Update or create a SpeakerOnList
     * const speakerOnList = await prisma.speakerOnList.upsert({
     *   create: {
     *     // ... data to create a SpeakerOnList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpeakerOnList we want to update
     *   }
     * })
    **/
    upsert<T extends SpeakerOnListUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SpeakerOnListUpsertArgs<ExtArgs>>
    ): Prisma__SpeakerOnListClient<$Result.GetResult<Prisma.$SpeakerOnListPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SpeakerOnLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListCountArgs} args - Arguments to filter SpeakerOnLists to count.
     * @example
     * // Count the number of SpeakerOnLists
     * const count = await prisma.speakerOnList.count({
     *   where: {
     *     // ... the filter for the SpeakerOnLists we want to count
     *   }
     * })
    **/
    count<T extends SpeakerOnListCountArgs>(
      args?: Subset<T, SpeakerOnListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpeakerOnListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpeakerOnList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpeakerOnListAggregateArgs>(args: Subset<T, SpeakerOnListAggregateArgs>): Prisma.PrismaPromise<GetSpeakerOnListAggregateType<T>>

    /**
     * Group by SpeakerOnList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakerOnListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpeakerOnListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpeakerOnListGroupByArgs['orderBy'] }
        : { orderBy?: SpeakerOnListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpeakerOnListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpeakerOnListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpeakerOnList model
   */
  readonly fields: SpeakerOnListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpeakerOnList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpeakerOnListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    speakersList<T extends SpeakersListDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpeakersListDefaultArgs<ExtArgs>>): Prisma__SpeakersListClient<$Result.GetResult<Prisma.$SpeakersListPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    committeeMember<T extends CommitteeMemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeMemberDefaultArgs<ExtArgs>>): Prisma__CommitteeMemberClient<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the SpeakerOnList model
   */ 
  interface SpeakerOnListFieldRefs {
    readonly id: FieldRef<"SpeakerOnList", 'String'>
    readonly speakersListId: FieldRef<"SpeakerOnList", 'String'>
    readonly committeeMemberId: FieldRef<"SpeakerOnList", 'String'>
    readonly position: FieldRef<"SpeakerOnList", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SpeakerOnList findUnique
   */
  export type SpeakerOnListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakerOnList to fetch.
     */
    where: SpeakerOnListWhereUniqueInput
  }

  /**
   * SpeakerOnList findUniqueOrThrow
   */
  export type SpeakerOnListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakerOnList to fetch.
     */
    where: SpeakerOnListWhereUniqueInput
  }

  /**
   * SpeakerOnList findFirst
   */
  export type SpeakerOnListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakerOnList to fetch.
     */
    where?: SpeakerOnListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakerOnLists to fetch.
     */
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakerOnLists.
     */
    cursor?: SpeakerOnListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakerOnLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakerOnLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakerOnLists.
     */
    distinct?: SpeakerOnListScalarFieldEnum | SpeakerOnListScalarFieldEnum[]
  }

  /**
   * SpeakerOnList findFirstOrThrow
   */
  export type SpeakerOnListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakerOnList to fetch.
     */
    where?: SpeakerOnListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakerOnLists to fetch.
     */
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakerOnLists.
     */
    cursor?: SpeakerOnListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakerOnLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakerOnLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakerOnLists.
     */
    distinct?: SpeakerOnListScalarFieldEnum | SpeakerOnListScalarFieldEnum[]
  }

  /**
   * SpeakerOnList findMany
   */
  export type SpeakerOnListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter, which SpeakerOnLists to fetch.
     */
    where?: SpeakerOnListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakerOnLists to fetch.
     */
    orderBy?: SpeakerOnListOrderByWithRelationInput | SpeakerOnListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpeakerOnLists.
     */
    cursor?: SpeakerOnListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakerOnLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakerOnLists.
     */
    skip?: number
    distinct?: SpeakerOnListScalarFieldEnum | SpeakerOnListScalarFieldEnum[]
  }

  /**
   * SpeakerOnList create
   */
  export type SpeakerOnListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * The data needed to create a SpeakerOnList.
     */
    data: XOR<SpeakerOnListCreateInput, SpeakerOnListUncheckedCreateInput>
  }

  /**
   * SpeakerOnList createMany
   */
  export type SpeakerOnListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpeakerOnLists.
     */
    data: SpeakerOnListCreateManyInput | SpeakerOnListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakerOnList createManyAndReturn
   */
  export type SpeakerOnListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * The data used to create many SpeakerOnLists.
     */
    data: SpeakerOnListCreateManyInput | SpeakerOnListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakerOnList update
   */
  export type SpeakerOnListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * The data needed to update a SpeakerOnList.
     */
    data: XOR<SpeakerOnListUpdateInput, SpeakerOnListUncheckedUpdateInput>
    /**
     * Choose, which SpeakerOnList to update.
     */
    where: SpeakerOnListWhereUniqueInput
  }

  /**
   * SpeakerOnList updateMany
   */
  export type SpeakerOnListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpeakerOnLists.
     */
    data: XOR<SpeakerOnListUpdateManyMutationInput, SpeakerOnListUncheckedUpdateManyInput>
    /**
     * Filter which SpeakerOnLists to update
     */
    where?: SpeakerOnListWhereInput
  }

  /**
   * SpeakerOnList upsert
   */
  export type SpeakerOnListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * The filter to search for the SpeakerOnList to update in case it exists.
     */
    where: SpeakerOnListWhereUniqueInput
    /**
     * In case the SpeakerOnList found by the `where` argument doesn't exist, create a new SpeakerOnList with this data.
     */
    create: XOR<SpeakerOnListCreateInput, SpeakerOnListUncheckedCreateInput>
    /**
     * In case the SpeakerOnList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpeakerOnListUpdateInput, SpeakerOnListUncheckedUpdateInput>
  }

  /**
   * SpeakerOnList delete
   */
  export type SpeakerOnListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
    /**
     * Filter which SpeakerOnList to delete.
     */
    where: SpeakerOnListWhereUniqueInput
  }

  /**
   * SpeakerOnList deleteMany
   */
  export type SpeakerOnListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakerOnLists to delete
     */
    where?: SpeakerOnListWhereInput
  }

  /**
   * SpeakerOnList without action
   */
  export type SpeakerOnListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakerOnList
     */
    select?: SpeakerOnListSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakerOnListInclude<ExtArgs> | null
  }


  /**
   * Model Delegation
   */

  export type AggregateDelegation = {
    _count: DelegationCountAggregateOutputType | null
    _min: DelegationMinAggregateOutputType | null
    _max: DelegationMaxAggregateOutputType | null
  }

  export type DelegationMinAggregateOutputType = {
    id: string | null
    conferenceId: string | null
    nationId: string | null
  }

  export type DelegationMaxAggregateOutputType = {
    id: string | null
    conferenceId: string | null
    nationId: string | null
  }

  export type DelegationCountAggregateOutputType = {
    id: number
    conferenceId: number
    nationId: number
    _all: number
  }


  export type DelegationMinAggregateInputType = {
    id?: true
    conferenceId?: true
    nationId?: true
  }

  export type DelegationMaxAggregateInputType = {
    id?: true
    conferenceId?: true
    nationId?: true
  }

  export type DelegationCountAggregateInputType = {
    id?: true
    conferenceId?: true
    nationId?: true
    _all?: true
  }

  export type DelegationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Delegation to aggregate.
     */
    where?: DelegationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Delegations to fetch.
     */
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DelegationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Delegations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Delegations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Delegations
    **/
    _count?: true | DelegationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DelegationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DelegationMaxAggregateInputType
  }

  export type GetDelegationAggregateType<T extends DelegationAggregateArgs> = {
        [P in keyof T & keyof AggregateDelegation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDelegation[P]>
      : GetScalarType<T[P], AggregateDelegation[P]>
  }




  export type DelegationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DelegationWhereInput
    orderBy?: DelegationOrderByWithAggregationInput | DelegationOrderByWithAggregationInput[]
    by: DelegationScalarFieldEnum[] | DelegationScalarFieldEnum
    having?: DelegationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DelegationCountAggregateInputType | true
    _min?: DelegationMinAggregateInputType
    _max?: DelegationMaxAggregateInputType
  }

  export type DelegationGroupByOutputType = {
    id: string
    conferenceId: string
    nationId: string
    _count: DelegationCountAggregateOutputType | null
    _min: DelegationMinAggregateOutputType | null
    _max: DelegationMaxAggregateOutputType | null
  }

  type GetDelegationGroupByPayload<T extends DelegationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DelegationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DelegationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DelegationGroupByOutputType[P]>
            : GetScalarType<T[P], DelegationGroupByOutputType[P]>
        }
      >
    >


  export type DelegationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conferenceId?: boolean
    nationId?: boolean
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    nation?: boolean | NationDefaultArgs<ExtArgs>
    members?: boolean | Delegation$membersArgs<ExtArgs>
    _count?: boolean | DelegationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["delegation"]>

  export type DelegationSelectScalar = {
    id?: boolean
    conferenceId?: boolean
    nationId?: boolean
  }


  export type DelegationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
    nation?: boolean | NationDefaultArgs<ExtArgs>
    members?: boolean | Delegation$membersArgs<ExtArgs>
    _count?: boolean | DelegationCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $DelegationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Delegation"
    objects: {
      conference: Prisma.$ConferencePayload<ExtArgs>
      nation: Prisma.$NationPayload<ExtArgs>
      members: Prisma.$CommitteeMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conferenceId: string
      nationId: string
    }, ExtArgs["result"]["delegation"]>
    composites: {}
  }


  type DelegationGetPayload<S extends boolean | null | undefined | DelegationDefaultArgs> = $Result.GetResult<Prisma.$DelegationPayload, S>

  type DelegationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DelegationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DelegationCountAggregateInputType | true
    }

  export interface DelegationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Delegation'], meta: { name: 'Delegation' } }
    /**
     * Find zero or one Delegation that matches the filter.
     * @param {DelegationFindUniqueArgs} args - Arguments to find a Delegation
     * @example
     * // Get one Delegation
     * const delegation = await prisma.delegation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DelegationFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationFindUniqueArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Delegation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DelegationFindUniqueOrThrowArgs} args - Arguments to find a Delegation
     * @example
     * // Get one Delegation
     * const delegation = await prisma.delegation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DelegationFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Delegation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationFindFirstArgs} args - Arguments to find a Delegation
     * @example
     * // Get one Delegation
     * const delegation = await prisma.delegation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DelegationFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationFindFirstArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Delegation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationFindFirstOrThrowArgs} args - Arguments to find a Delegation
     * @example
     * // Get one Delegation
     * const delegation = await prisma.delegation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DelegationFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Delegations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Delegations
     * const delegations = await prisma.delegation.findMany()
     * 
     * // Get first 10 Delegations
     * const delegations = await prisma.delegation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const delegationWithIdOnly = await prisma.delegation.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DelegationFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Delegation.
     * @param {DelegationCreateArgs} args - Arguments to create a Delegation.
     * @example
     * // Create one Delegation
     * const Delegation = await prisma.delegation.create({
     *   data: {
     *     // ... data to create a Delegation
     *   }
     * })
     * 
    **/
    create<T extends DelegationCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationCreateArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Delegations.
     * @param {DelegationCreateManyArgs} args - Arguments to create many Delegations.
     * @example
     * // Create many Delegations
     * const delegation = await prisma.delegation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends DelegationCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Delegations and returns the data saved in the database.
     * @param {DelegationCreateManyAndReturnArgs} args - Arguments to create many Delegations.
     * @example
     * // Create many Delegations
     * const delegation = await prisma.delegation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Delegations and only return the `id`
     * const delegationWithIdOnly = await prisma.delegation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends DelegationCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Delegation.
     * @param {DelegationDeleteArgs} args - Arguments to delete one Delegation.
     * @example
     * // Delete one Delegation
     * const Delegation = await prisma.delegation.delete({
     *   where: {
     *     // ... filter to delete one Delegation
     *   }
     * })
     * 
    **/
    delete<T extends DelegationDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationDeleteArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Delegation.
     * @param {DelegationUpdateArgs} args - Arguments to update one Delegation.
     * @example
     * // Update one Delegation
     * const delegation = await prisma.delegation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DelegationUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationUpdateArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Delegations.
     * @param {DelegationDeleteManyArgs} args - Arguments to filter Delegations to delete.
     * @example
     * // Delete a few Delegations
     * const { count } = await prisma.delegation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DelegationDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DelegationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Delegations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Delegations
     * const delegation = await prisma.delegation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DelegationUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Delegation.
     * @param {DelegationUpsertArgs} args - Arguments to update or create a Delegation.
     * @example
     * // Update or create a Delegation
     * const delegation = await prisma.delegation.upsert({
     *   create: {
     *     // ... data to create a Delegation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Delegation we want to update
     *   }
     * })
    **/
    upsert<T extends DelegationUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DelegationUpsertArgs<ExtArgs>>
    ): Prisma__DelegationClient<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Delegations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationCountArgs} args - Arguments to filter Delegations to count.
     * @example
     * // Count the number of Delegations
     * const count = await prisma.delegation.count({
     *   where: {
     *     // ... the filter for the Delegations we want to count
     *   }
     * })
    **/
    count<T extends DelegationCountArgs>(
      args?: Subset<T, DelegationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DelegationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Delegation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DelegationAggregateArgs>(args: Subset<T, DelegationAggregateArgs>): Prisma.PrismaPromise<GetDelegationAggregateType<T>>

    /**
     * Group by Delegation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DelegationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DelegationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DelegationGroupByArgs['orderBy'] }
        : { orderBy?: DelegationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DelegationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDelegationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Delegation model
   */
  readonly fields: DelegationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Delegation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DelegationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    conference<T extends ConferenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConferenceDefaultArgs<ExtArgs>>): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    nation<T extends NationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NationDefaultArgs<ExtArgs>>): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    members<T extends Delegation$membersArgs<ExtArgs> = {}>(args?: Subset<T, Delegation$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitteeMemberPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Delegation model
   */ 
  interface DelegationFieldRefs {
    readonly id: FieldRef<"Delegation", 'String'>
    readonly conferenceId: FieldRef<"Delegation", 'String'>
    readonly nationId: FieldRef<"Delegation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Delegation findUnique
   */
  export type DelegationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter, which Delegation to fetch.
     */
    where: DelegationWhereUniqueInput
  }

  /**
   * Delegation findUniqueOrThrow
   */
  export type DelegationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter, which Delegation to fetch.
     */
    where: DelegationWhereUniqueInput
  }

  /**
   * Delegation findFirst
   */
  export type DelegationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter, which Delegation to fetch.
     */
    where?: DelegationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Delegations to fetch.
     */
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Delegations.
     */
    cursor?: DelegationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Delegations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Delegations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Delegations.
     */
    distinct?: DelegationScalarFieldEnum | DelegationScalarFieldEnum[]
  }

  /**
   * Delegation findFirstOrThrow
   */
  export type DelegationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter, which Delegation to fetch.
     */
    where?: DelegationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Delegations to fetch.
     */
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Delegations.
     */
    cursor?: DelegationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Delegations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Delegations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Delegations.
     */
    distinct?: DelegationScalarFieldEnum | DelegationScalarFieldEnum[]
  }

  /**
   * Delegation findMany
   */
  export type DelegationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter, which Delegations to fetch.
     */
    where?: DelegationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Delegations to fetch.
     */
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Delegations.
     */
    cursor?: DelegationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Delegations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Delegations.
     */
    skip?: number
    distinct?: DelegationScalarFieldEnum | DelegationScalarFieldEnum[]
  }

  /**
   * Delegation create
   */
  export type DelegationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * The data needed to create a Delegation.
     */
    data: XOR<DelegationCreateInput, DelegationUncheckedCreateInput>
  }

  /**
   * Delegation createMany
   */
  export type DelegationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Delegations.
     */
    data: DelegationCreateManyInput | DelegationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Delegation createManyAndReturn
   */
  export type DelegationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * The data used to create many Delegations.
     */
    data: DelegationCreateManyInput | DelegationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Delegation update
   */
  export type DelegationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * The data needed to update a Delegation.
     */
    data: XOR<DelegationUpdateInput, DelegationUncheckedUpdateInput>
    /**
     * Choose, which Delegation to update.
     */
    where: DelegationWhereUniqueInput
  }

  /**
   * Delegation updateMany
   */
  export type DelegationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Delegations.
     */
    data: XOR<DelegationUpdateManyMutationInput, DelegationUncheckedUpdateManyInput>
    /**
     * Filter which Delegations to update
     */
    where?: DelegationWhereInput
  }

  /**
   * Delegation upsert
   */
  export type DelegationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * The filter to search for the Delegation to update in case it exists.
     */
    where: DelegationWhereUniqueInput
    /**
     * In case the Delegation found by the `where` argument doesn't exist, create a new Delegation with this data.
     */
    create: XOR<DelegationCreateInput, DelegationUncheckedCreateInput>
    /**
     * In case the Delegation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DelegationUpdateInput, DelegationUncheckedUpdateInput>
  }

  /**
   * Delegation delete
   */
  export type DelegationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    /**
     * Filter which Delegation to delete.
     */
    where: DelegationWhereUniqueInput
  }

  /**
   * Delegation deleteMany
   */
  export type DelegationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Delegations to delete
     */
    where?: DelegationWhereInput
  }

  /**
   * Delegation.members
   */
  export type Delegation$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommitteeMember
     */
    select?: CommitteeMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommitteeMemberInclude<ExtArgs> | null
    where?: CommitteeMemberWhereInput
    orderBy?: CommitteeMemberOrderByWithRelationInput | CommitteeMemberOrderByWithRelationInput[]
    cursor?: CommitteeMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommitteeMemberScalarFieldEnum | CommitteeMemberScalarFieldEnum[]
  }

  /**
   * Delegation without action
   */
  export type DelegationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
  }


  /**
   * Model Nation
   */

  export type AggregateNation = {
    _count: NationCountAggregateOutputType | null
    _min: NationMinAggregateOutputType | null
    _max: NationMaxAggregateOutputType | null
  }

  export type NationMinAggregateOutputType = {
    id: string | null
    alpha3Code: string | null
    variant: $Enums.NationVariant | null
  }

  export type NationMaxAggregateOutputType = {
    id: string | null
    alpha3Code: string | null
    variant: $Enums.NationVariant | null
  }

  export type NationCountAggregateOutputType = {
    id: number
    alpha3Code: number
    variant: number
    _all: number
  }


  export type NationMinAggregateInputType = {
    id?: true
    alpha3Code?: true
    variant?: true
  }

  export type NationMaxAggregateInputType = {
    id?: true
    alpha3Code?: true
    variant?: true
  }

  export type NationCountAggregateInputType = {
    id?: true
    alpha3Code?: true
    variant?: true
    _all?: true
  }

  export type NationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Nation to aggregate.
     */
    where?: NationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nations to fetch.
     */
    orderBy?: NationOrderByWithRelationInput | NationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Nations
    **/
    _count?: true | NationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NationMaxAggregateInputType
  }

  export type GetNationAggregateType<T extends NationAggregateArgs> = {
        [P in keyof T & keyof AggregateNation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNation[P]>
      : GetScalarType<T[P], AggregateNation[P]>
  }




  export type NationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NationWhereInput
    orderBy?: NationOrderByWithAggregationInput | NationOrderByWithAggregationInput[]
    by: NationScalarFieldEnum[] | NationScalarFieldEnum
    having?: NationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NationCountAggregateInputType | true
    _min?: NationMinAggregateInputType
    _max?: NationMaxAggregateInputType
  }

  export type NationGroupByOutputType = {
    id: string
    alpha3Code: string
    variant: $Enums.NationVariant
    _count: NationCountAggregateOutputType | null
    _min: NationMinAggregateOutputType | null
    _max: NationMaxAggregateOutputType | null
  }

  type GetNationGroupByPayload<T extends NationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NationGroupByOutputType[P]>
            : GetScalarType<T[P], NationGroupByOutputType[P]>
        }
      >
    >


  export type NationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alpha3Code?: boolean
    variant?: boolean
    delegations?: boolean | Nation$delegationsArgs<ExtArgs>
    _count?: boolean | NationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nation"]>

  export type NationSelectScalar = {
    id?: boolean
    alpha3Code?: boolean
    variant?: boolean
  }


  export type NationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delegations?: boolean | Nation$delegationsArgs<ExtArgs>
    _count?: boolean | NationCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $NationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Nation"
    objects: {
      delegations: Prisma.$DelegationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      alpha3Code: string
      variant: $Enums.NationVariant
    }, ExtArgs["result"]["nation"]>
    composites: {}
  }


  type NationGetPayload<S extends boolean | null | undefined | NationDefaultArgs> = $Result.GetResult<Prisma.$NationPayload, S>

  type NationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NationCountAggregateInputType | true
    }

  export interface NationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Nation'], meta: { name: 'Nation' } }
    /**
     * Find zero or one Nation that matches the filter.
     * @param {NationFindUniqueArgs} args - Arguments to find a Nation
     * @example
     * // Get one Nation
     * const nation = await prisma.nation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends NationFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, NationFindUniqueArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Nation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NationFindUniqueOrThrowArgs} args - Arguments to find a Nation
     * @example
     * // Get one Nation
     * const nation = await prisma.nation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends NationFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, NationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Nation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationFindFirstArgs} args - Arguments to find a Nation
     * @example
     * // Get one Nation
     * const nation = await prisma.nation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends NationFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, NationFindFirstArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Nation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationFindFirstOrThrowArgs} args - Arguments to find a Nation
     * @example
     * // Get one Nation
     * const nation = await prisma.nation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends NationFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, NationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Nations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Nations
     * const nations = await prisma.nation.findMany()
     * 
     * // Get first 10 Nations
     * const nations = await prisma.nation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nationWithIdOnly = await prisma.nation.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends NationFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, NationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Nation.
     * @param {NationCreateArgs} args - Arguments to create a Nation.
     * @example
     * // Create one Nation
     * const Nation = await prisma.nation.create({
     *   data: {
     *     // ... data to create a Nation
     *   }
     * })
     * 
    **/
    create<T extends NationCreateArgs<ExtArgs>>(
      args: SelectSubset<T, NationCreateArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Nations.
     * @param {NationCreateManyArgs} args - Arguments to create many Nations.
     * @example
     * // Create many Nations
     * const nation = await prisma.nation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends NationCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, NationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Nations and returns the data saved in the database.
     * @param {NationCreateManyAndReturnArgs} args - Arguments to create many Nations.
     * @example
     * // Create many Nations
     * const nation = await prisma.nation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Nations and only return the `id`
     * const nationWithIdOnly = await prisma.nation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends NationCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, NationCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Nation.
     * @param {NationDeleteArgs} args - Arguments to delete one Nation.
     * @example
     * // Delete one Nation
     * const Nation = await prisma.nation.delete({
     *   where: {
     *     // ... filter to delete one Nation
     *   }
     * })
     * 
    **/
    delete<T extends NationDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, NationDeleteArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Nation.
     * @param {NationUpdateArgs} args - Arguments to update one Nation.
     * @example
     * // Update one Nation
     * const nation = await prisma.nation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends NationUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, NationUpdateArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Nations.
     * @param {NationDeleteManyArgs} args - Arguments to filter Nations to delete.
     * @example
     * // Delete a few Nations
     * const { count } = await prisma.nation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends NationDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, NationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Nations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Nations
     * const nation = await prisma.nation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends NationUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, NationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Nation.
     * @param {NationUpsertArgs} args - Arguments to update or create a Nation.
     * @example
     * // Update or create a Nation
     * const nation = await prisma.nation.upsert({
     *   create: {
     *     // ... data to create a Nation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Nation we want to update
     *   }
     * })
    **/
    upsert<T extends NationUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, NationUpsertArgs<ExtArgs>>
    ): Prisma__NationClient<$Result.GetResult<Prisma.$NationPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Nations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationCountArgs} args - Arguments to filter Nations to count.
     * @example
     * // Count the number of Nations
     * const count = await prisma.nation.count({
     *   where: {
     *     // ... the filter for the Nations we want to count
     *   }
     * })
    **/
    count<T extends NationCountArgs>(
      args?: Subset<T, NationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Nation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NationAggregateArgs>(args: Subset<T, NationAggregateArgs>): Prisma.PrismaPromise<GetNationAggregateType<T>>

    /**
     * Group by Nation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NationGroupByArgs['orderBy'] }
        : { orderBy?: NationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Nation model
   */
  readonly fields: NationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Nation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    delegations<T extends Nation$delegationsArgs<ExtArgs> = {}>(args?: Subset<T, Nation$delegationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DelegationPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Nation model
   */ 
  interface NationFieldRefs {
    readonly id: FieldRef<"Nation", 'String'>
    readonly alpha3Code: FieldRef<"Nation", 'String'>
    readonly variant: FieldRef<"Nation", 'NationVariant'>
  }
    

  // Custom InputTypes
  /**
   * Nation findUnique
   */
  export type NationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter, which Nation to fetch.
     */
    where: NationWhereUniqueInput
  }

  /**
   * Nation findUniqueOrThrow
   */
  export type NationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter, which Nation to fetch.
     */
    where: NationWhereUniqueInput
  }

  /**
   * Nation findFirst
   */
  export type NationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter, which Nation to fetch.
     */
    where?: NationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nations to fetch.
     */
    orderBy?: NationOrderByWithRelationInput | NationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nations.
     */
    cursor?: NationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nations.
     */
    distinct?: NationScalarFieldEnum | NationScalarFieldEnum[]
  }

  /**
   * Nation findFirstOrThrow
   */
  export type NationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter, which Nation to fetch.
     */
    where?: NationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nations to fetch.
     */
    orderBy?: NationOrderByWithRelationInput | NationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nations.
     */
    cursor?: NationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nations.
     */
    distinct?: NationScalarFieldEnum | NationScalarFieldEnum[]
  }

  /**
   * Nation findMany
   */
  export type NationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter, which Nations to fetch.
     */
    where?: NationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nations to fetch.
     */
    orderBy?: NationOrderByWithRelationInput | NationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Nations.
     */
    cursor?: NationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nations.
     */
    skip?: number
    distinct?: NationScalarFieldEnum | NationScalarFieldEnum[]
  }

  /**
   * Nation create
   */
  export type NationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * The data needed to create a Nation.
     */
    data: XOR<NationCreateInput, NationUncheckedCreateInput>
  }

  /**
   * Nation createMany
   */
  export type NationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Nations.
     */
    data: NationCreateManyInput | NationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Nation createManyAndReturn
   */
  export type NationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * The data used to create many Nations.
     */
    data: NationCreateManyInput | NationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Nation update
   */
  export type NationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * The data needed to update a Nation.
     */
    data: XOR<NationUpdateInput, NationUncheckedUpdateInput>
    /**
     * Choose, which Nation to update.
     */
    where: NationWhereUniqueInput
  }

  /**
   * Nation updateMany
   */
  export type NationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Nations.
     */
    data: XOR<NationUpdateManyMutationInput, NationUncheckedUpdateManyInput>
    /**
     * Filter which Nations to update
     */
    where?: NationWhereInput
  }

  /**
   * Nation upsert
   */
  export type NationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * The filter to search for the Nation to update in case it exists.
     */
    where: NationWhereUniqueInput
    /**
     * In case the Nation found by the `where` argument doesn't exist, create a new Nation with this data.
     */
    create: XOR<NationCreateInput, NationUncheckedCreateInput>
    /**
     * In case the Nation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NationUpdateInput, NationUncheckedUpdateInput>
  }

  /**
   * Nation delete
   */
  export type NationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
    /**
     * Filter which Nation to delete.
     */
    where: NationWhereUniqueInput
  }

  /**
   * Nation deleteMany
   */
  export type NationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Nations to delete
     */
    where?: NationWhereInput
  }

  /**
   * Nation.delegations
   */
  export type Nation$delegationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delegation
     */
    select?: DelegationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DelegationInclude<ExtArgs> | null
    where?: DelegationWhereInput
    orderBy?: DelegationOrderByWithRelationInput | DelegationOrderByWithRelationInput[]
    cursor?: DelegationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DelegationScalarFieldEnum | DelegationScalarFieldEnum[]
  }

  /**
   * Nation without action
   */
  export type NationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Nation
     */
    select?: NationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NationInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    subject: string | null
    category: $Enums.MessageCategory | null
    message: string | null
    committeeId: string | null
    authorId: string | null
    timestamp: Date | null
    forwarded: boolean | null
    metaEmail: string | null
    metaDelegation: string | null
    metaCommittee: string | null
    metaAgendaItem: string | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    subject: string | null
    category: $Enums.MessageCategory | null
    message: string | null
    committeeId: string | null
    authorId: string | null
    timestamp: Date | null
    forwarded: boolean | null
    metaEmail: string | null
    metaDelegation: string | null
    metaCommittee: string | null
    metaAgendaItem: string | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    subject: number
    category: number
    message: number
    committeeId: number
    authorId: number
    timestamp: number
    status: number
    forwarded: number
    metaEmail: number
    metaDelegation: number
    metaCommittee: number
    metaAgendaItem: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    subject?: true
    category?: true
    message?: true
    committeeId?: true
    authorId?: true
    timestamp?: true
    forwarded?: true
    metaEmail?: true
    metaDelegation?: true
    metaCommittee?: true
    metaAgendaItem?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    subject?: true
    category?: true
    message?: true
    committeeId?: true
    authorId?: true
    timestamp?: true
    forwarded?: true
    metaEmail?: true
    metaDelegation?: true
    metaCommittee?: true
    metaAgendaItem?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    subject?: true
    category?: true
    message?: true
    committeeId?: true
    authorId?: true
    timestamp?: true
    status?: true
    forwarded?: true
    metaEmail?: true
    metaDelegation?: true
    metaCommittee?: true
    metaAgendaItem?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    subject: string
    category: $Enums.MessageCategory
    message: string
    committeeId: string
    authorId: string
    timestamp: Date
    status: $Enums.MessageStatus[]
    forwarded: boolean
    metaEmail: string | null
    metaDelegation: string | null
    metaCommittee: string | null
    metaAgendaItem: string | null
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    category?: boolean
    message?: boolean
    committeeId?: boolean
    authorId?: boolean
    timestamp?: boolean
    status?: boolean
    forwarded?: boolean
    metaEmail?: boolean
    metaDelegation?: boolean
    metaCommittee?: boolean
    metaAgendaItem?: boolean
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    subject?: boolean
    category?: boolean
    message?: boolean
    committeeId?: boolean
    authorId?: boolean
    timestamp?: boolean
    status?: boolean
    forwarded?: boolean
    metaEmail?: boolean
    metaDelegation?: boolean
    metaCommittee?: boolean
    metaAgendaItem?: boolean
  }


  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    committee?: boolean | CommitteeDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }


  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      committee: Prisma.$CommitteePayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subject: string
      category: $Enums.MessageCategory
      message: string
      committeeId: string
      authorId: string
      timestamp: Date
      status: $Enums.MessageStatus[]
      /**
       * If the message was forwarded to the Research Service
       */
      forwarded: boolean
      /**
       * Saved Metadata without relation
       */
      metaEmail: string | null
      metaDelegation: string | null
      metaCommittee: string | null
      metaAgendaItem: string | null
    }, ExtArgs["result"]["message"]>
    composites: {}
  }


  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends MessageFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends MessageFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends MessageFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
    **/
    create<T extends MessageCreateArgs<ExtArgs>>(
      args: SelectSubset<T, MessageCreateArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends MessageCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
    **/
    delete<T extends MessageDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends MessageUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends MessageDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends MessageUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
    **/
    upsert<T extends MessageUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>
    ): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    committee<T extends CommitteeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommitteeDefaultArgs<ExtArgs>>): Prisma__CommitteeClient<$Result.GetResult<Prisma.$CommitteePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Message model
   */ 
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly subject: FieldRef<"Message", 'String'>
    readonly category: FieldRef<"Message", 'MessageCategory'>
    readonly message: FieldRef<"Message", 'String'>
    readonly committeeId: FieldRef<"Message", 'String'>
    readonly authorId: FieldRef<"Message", 'String'>
    readonly timestamp: FieldRef<"Message", 'DateTime'>
    readonly status: FieldRef<"Message", 'MessageStatus[]'>
    readonly forwarded: FieldRef<"Message", 'Boolean'>
    readonly metaEmail: FieldRef<"Message", 'String'>
    readonly metaDelegation: FieldRef<"Message", 'String'>
    readonly metaCommittee: FieldRef<"Message", 'String'>
    readonly metaAgendaItem: FieldRef<"Message", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ConferenceCreationTokenScalarFieldEnum: {
    token: 'token'
  };

  export type ConferenceCreationTokenScalarFieldEnum = (typeof ConferenceCreationTokenScalarFieldEnum)[keyof typeof ConferenceCreationTokenScalarFieldEnum]


  export const ConferenceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    start: 'start',
    end: 'end',
    pressWebsite: 'pressWebsite',
    feedbackWebsite: 'feedbackWebsite'
  };

  export type ConferenceScalarFieldEnum = (typeof ConferenceScalarFieldEnum)[keyof typeof ConferenceScalarFieldEnum]


  export const ConferenceMemberScalarFieldEnum: {
    id: 'id',
    conferenceId: 'conferenceId',
    userId: 'userId',
    role: 'role'
  };

  export type ConferenceMemberScalarFieldEnum = (typeof ConferenceMemberScalarFieldEnum)[keyof typeof ConferenceMemberScalarFieldEnum]


  export const CommitteeScalarFieldEnum: {
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

  export type CommitteeScalarFieldEnum = (typeof CommitteeScalarFieldEnum)[keyof typeof CommitteeScalarFieldEnum]


  export const CommitteeMemberScalarFieldEnum: {
    id: 'id',
    committeeId: 'committeeId',
    userId: 'userId',
    delegationId: 'delegationId',
    presence: 'presence'
  };

  export type CommitteeMemberScalarFieldEnum = (typeof CommitteeMemberScalarFieldEnum)[keyof typeof CommitteeMemberScalarFieldEnum]


  export const AgendaItemScalarFieldEnum: {
    id: 'id',
    committeeId: 'committeeId',
    title: 'title',
    description: 'description',
    isActive: 'isActive'
  };

  export type AgendaItemScalarFieldEnum = (typeof AgendaItemScalarFieldEnum)[keyof typeof AgendaItemScalarFieldEnum]


  export const SpeakersListScalarFieldEnum: {
    id: 'id',
    agendaItemId: 'agendaItemId',
    type: 'type',
    speakingTime: 'speakingTime',
    timeLeft: 'timeLeft',
    startTimestamp: 'startTimestamp',
    isClosed: 'isClosed'
  };

  export type SpeakersListScalarFieldEnum = (typeof SpeakersListScalarFieldEnum)[keyof typeof SpeakersListScalarFieldEnum]


  export const SpeakerOnListScalarFieldEnum: {
    id: 'id',
    speakersListId: 'speakersListId',
    committeeMemberId: 'committeeMemberId',
    position: 'position'
  };

  export type SpeakerOnListScalarFieldEnum = (typeof SpeakerOnListScalarFieldEnum)[keyof typeof SpeakerOnListScalarFieldEnum]


  export const DelegationScalarFieldEnum: {
    id: 'id',
    conferenceId: 'conferenceId',
    nationId: 'nationId'
  };

  export type DelegationScalarFieldEnum = (typeof DelegationScalarFieldEnum)[keyof typeof DelegationScalarFieldEnum]


  export const NationScalarFieldEnum: {
    id: 'id',
    alpha3Code: 'alpha3Code',
    variant: 'variant'
  };

  export type NationScalarFieldEnum = (typeof NationScalarFieldEnum)[keyof typeof NationScalarFieldEnum]


  export const MessageScalarFieldEnum: {
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

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ConferenceRole'
   */
  export type EnumConferenceRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConferenceRole'>
    


  /**
   * Reference to a field of type 'ConferenceRole[]'
   */
  export type ListEnumConferenceRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConferenceRole[]'>
    


  /**
   * Reference to a field of type 'CommitteeCategory'
   */
  export type EnumCommitteeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommitteeCategory'>
    


  /**
   * Reference to a field of type 'CommitteeCategory[]'
   */
  export type ListEnumCommitteeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommitteeCategory[]'>
    


  /**
   * Reference to a field of type 'CommitteeStatus'
   */
  export type EnumCommitteeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommitteeStatus'>
    


  /**
   * Reference to a field of type 'CommitteeStatus[]'
   */
  export type ListEnumCommitteeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommitteeStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Presence'
   */
  export type EnumPresenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Presence'>
    


  /**
   * Reference to a field of type 'Presence[]'
   */
  export type ListEnumPresenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Presence[]'>
    


  /**
   * Reference to a field of type 'SpeakersListCategory'
   */
  export type EnumSpeakersListCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpeakersListCategory'>
    


  /**
   * Reference to a field of type 'SpeakersListCategory[]'
   */
  export type ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpeakersListCategory[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'NationVariant'
   */
  export type EnumNationVariantFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NationVariant'>
    


  /**
   * Reference to a field of type 'NationVariant[]'
   */
  export type ListEnumNationVariantFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NationVariant[]'>
    


  /**
   * Reference to a field of type 'MessageCategory'
   */
  export type EnumMessageCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageCategory'>
    


  /**
   * Reference to a field of type 'MessageCategory[]'
   */
  export type ListEnumMessageCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageCategory[]'>
    


  /**
   * Reference to a field of type 'MessageStatus[]'
   */
  export type ListEnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus[]'>
    


  /**
   * Reference to a field of type 'MessageStatus'
   */
  export type EnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    conferenceMemberships?: ConferenceMemberListRelationFilter
    committeeMemberships?: CommitteeMemberListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    conferenceMemberships?: ConferenceMemberOrderByRelationAggregateInput
    committeeMemberships?: CommitteeMemberOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    conferenceMemberships?: ConferenceMemberListRelationFilter
    committeeMemberships?: CommitteeMemberListRelationFilter
    messages?: MessageListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
  }

  export type ConferenceCreationTokenWhereInput = {
    AND?: ConferenceCreationTokenWhereInput | ConferenceCreationTokenWhereInput[]
    OR?: ConferenceCreationTokenWhereInput[]
    NOT?: ConferenceCreationTokenWhereInput | ConferenceCreationTokenWhereInput[]
    token?: StringFilter<"ConferenceCreationToken"> | string
  }

  export type ConferenceCreationTokenOrderByWithRelationInput = {
    token?: SortOrder
  }

  export type ConferenceCreationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    AND?: ConferenceCreationTokenWhereInput | ConferenceCreationTokenWhereInput[]
    OR?: ConferenceCreationTokenWhereInput[]
    NOT?: ConferenceCreationTokenWhereInput | ConferenceCreationTokenWhereInput[]
  }, "token">

  export type ConferenceCreationTokenOrderByWithAggregationInput = {
    token?: SortOrder
    _count?: ConferenceCreationTokenCountOrderByAggregateInput
    _max?: ConferenceCreationTokenMaxOrderByAggregateInput
    _min?: ConferenceCreationTokenMinOrderByAggregateInput
  }

  export type ConferenceCreationTokenScalarWhereWithAggregatesInput = {
    AND?: ConferenceCreationTokenScalarWhereWithAggregatesInput | ConferenceCreationTokenScalarWhereWithAggregatesInput[]
    OR?: ConferenceCreationTokenScalarWhereWithAggregatesInput[]
    NOT?: ConferenceCreationTokenScalarWhereWithAggregatesInput | ConferenceCreationTokenScalarWhereWithAggregatesInput[]
    token?: StringWithAggregatesFilter<"ConferenceCreationToken"> | string
  }

  export type ConferenceWhereInput = {
    AND?: ConferenceWhereInput | ConferenceWhereInput[]
    OR?: ConferenceWhereInput[]
    NOT?: ConferenceWhereInput | ConferenceWhereInput[]
    id?: StringFilter<"Conference"> | string
    name?: StringFilter<"Conference"> | string
    start?: DateTimeNullableFilter<"Conference"> | Date | string | null
    end?: DateTimeNullableFilter<"Conference"> | Date | string | null
    pressWebsite?: StringNullableFilter<"Conference"> | string | null
    feedbackWebsite?: StringNullableFilter<"Conference"> | string | null
    delegations?: DelegationListRelationFilter
    members?: ConferenceMemberListRelationFilter
    committees?: CommitteeListRelationFilter
  }

  export type ConferenceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrderInput | SortOrder
    end?: SortOrderInput | SortOrder
    pressWebsite?: SortOrderInput | SortOrder
    feedbackWebsite?: SortOrderInput | SortOrder
    delegations?: DelegationOrderByRelationAggregateInput
    members?: ConferenceMemberOrderByRelationAggregateInput
    committees?: CommitteeOrderByRelationAggregateInput
  }

  export type ConferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ConferenceWhereInput | ConferenceWhereInput[]
    OR?: ConferenceWhereInput[]
    NOT?: ConferenceWhereInput | ConferenceWhereInput[]
    start?: DateTimeNullableFilter<"Conference"> | Date | string | null
    end?: DateTimeNullableFilter<"Conference"> | Date | string | null
    pressWebsite?: StringNullableFilter<"Conference"> | string | null
    feedbackWebsite?: StringNullableFilter<"Conference"> | string | null
    delegations?: DelegationListRelationFilter
    members?: ConferenceMemberListRelationFilter
    committees?: CommitteeListRelationFilter
  }, "id" | "name">

  export type ConferenceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrderInput | SortOrder
    end?: SortOrderInput | SortOrder
    pressWebsite?: SortOrderInput | SortOrder
    feedbackWebsite?: SortOrderInput | SortOrder
    _count?: ConferenceCountOrderByAggregateInput
    _max?: ConferenceMaxOrderByAggregateInput
    _min?: ConferenceMinOrderByAggregateInput
  }

  export type ConferenceScalarWhereWithAggregatesInput = {
    AND?: ConferenceScalarWhereWithAggregatesInput | ConferenceScalarWhereWithAggregatesInput[]
    OR?: ConferenceScalarWhereWithAggregatesInput[]
    NOT?: ConferenceScalarWhereWithAggregatesInput | ConferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conference"> | string
    name?: StringWithAggregatesFilter<"Conference"> | string
    start?: DateTimeNullableWithAggregatesFilter<"Conference"> | Date | string | null
    end?: DateTimeNullableWithAggregatesFilter<"Conference"> | Date | string | null
    pressWebsite?: StringNullableWithAggregatesFilter<"Conference"> | string | null
    feedbackWebsite?: StringNullableWithAggregatesFilter<"Conference"> | string | null
  }

  export type ConferenceMemberWhereInput = {
    AND?: ConferenceMemberWhereInput | ConferenceMemberWhereInput[]
    OR?: ConferenceMemberWhereInput[]
    NOT?: ConferenceMemberWhereInput | ConferenceMemberWhereInput[]
    id?: StringFilter<"ConferenceMember"> | string
    conferenceId?: StringFilter<"ConferenceMember"> | string
    userId?: StringNullableFilter<"ConferenceMember"> | string | null
    role?: EnumConferenceRoleFilter<"ConferenceMember"> | $Enums.ConferenceRole
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type ConferenceMemberOrderByWithRelationInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    userId?: SortOrderInput | SortOrder
    role?: SortOrder
    conference?: ConferenceOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ConferenceMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_conferenceId?: ConferenceMemberUserIdConferenceIdCompoundUniqueInput
    AND?: ConferenceMemberWhereInput | ConferenceMemberWhereInput[]
    OR?: ConferenceMemberWhereInput[]
    NOT?: ConferenceMemberWhereInput | ConferenceMemberWhereInput[]
    conferenceId?: StringFilter<"ConferenceMember"> | string
    userId?: StringNullableFilter<"ConferenceMember"> | string | null
    role?: EnumConferenceRoleFilter<"ConferenceMember"> | $Enums.ConferenceRole
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "userId_conferenceId">

  export type ConferenceMemberOrderByWithAggregationInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    userId?: SortOrderInput | SortOrder
    role?: SortOrder
    _count?: ConferenceMemberCountOrderByAggregateInput
    _max?: ConferenceMemberMaxOrderByAggregateInput
    _min?: ConferenceMemberMinOrderByAggregateInput
  }

  export type ConferenceMemberScalarWhereWithAggregatesInput = {
    AND?: ConferenceMemberScalarWhereWithAggregatesInput | ConferenceMemberScalarWhereWithAggregatesInput[]
    OR?: ConferenceMemberScalarWhereWithAggregatesInput[]
    NOT?: ConferenceMemberScalarWhereWithAggregatesInput | ConferenceMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConferenceMember"> | string
    conferenceId?: StringWithAggregatesFilter<"ConferenceMember"> | string
    userId?: StringNullableWithAggregatesFilter<"ConferenceMember"> | string | null
    role?: EnumConferenceRoleWithAggregatesFilter<"ConferenceMember"> | $Enums.ConferenceRole
  }

  export type CommitteeWhereInput = {
    AND?: CommitteeWhereInput | CommitteeWhereInput[]
    OR?: CommitteeWhereInput[]
    NOT?: CommitteeWhereInput | CommitteeWhereInput[]
    id?: StringFilter<"Committee"> | string
    name?: StringFilter<"Committee"> | string
    abbreviation?: StringFilter<"Committee"> | string
    category?: EnumCommitteeCategoryFilter<"Committee"> | $Enums.CommitteeCategory
    conferenceId?: StringFilter<"Committee"> | string
    parentId?: StringNullableFilter<"Committee"> | string | null
    whiteboardContent?: StringFilter<"Committee"> | string
    status?: EnumCommitteeStatusFilter<"Committee"> | $Enums.CommitteeStatus
    stateOfDebate?: StringNullableFilter<"Committee"> | string | null
    statusHeadline?: StringNullableFilter<"Committee"> | string | null
    statusUntil?: DateTimeNullableFilter<"Committee"> | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFilter<"Committee"> | boolean
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    members?: CommitteeMemberListRelationFilter
    parent?: XOR<CommitteeNullableRelationFilter, CommitteeWhereInput> | null
    subCommittees?: CommitteeListRelationFilter
    messages?: MessageListRelationFilter
    agendaItems?: AgendaItemListRelationFilter
  }

  export type CommitteeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    category?: SortOrder
    conferenceId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    whiteboardContent?: SortOrder
    status?: SortOrder
    stateOfDebate?: SortOrderInput | SortOrder
    statusHeadline?: SortOrderInput | SortOrder
    statusUntil?: SortOrderInput | SortOrder
    allowDelegationsToAddThemselvesToSpeakersList?: SortOrder
    conference?: ConferenceOrderByWithRelationInput
    members?: CommitteeMemberOrderByRelationAggregateInput
    parent?: CommitteeOrderByWithRelationInput
    subCommittees?: CommitteeOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    agendaItems?: AgendaItemOrderByRelationAggregateInput
  }

  export type CommitteeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_conferenceId?: CommitteeNameConferenceIdCompoundUniqueInput
    abbreviation_conferenceId?: CommitteeAbbreviationConferenceIdCompoundUniqueInput
    AND?: CommitteeWhereInput | CommitteeWhereInput[]
    OR?: CommitteeWhereInput[]
    NOT?: CommitteeWhereInput | CommitteeWhereInput[]
    name?: StringFilter<"Committee"> | string
    abbreviation?: StringFilter<"Committee"> | string
    category?: EnumCommitteeCategoryFilter<"Committee"> | $Enums.CommitteeCategory
    conferenceId?: StringFilter<"Committee"> | string
    parentId?: StringNullableFilter<"Committee"> | string | null
    whiteboardContent?: StringFilter<"Committee"> | string
    status?: EnumCommitteeStatusFilter<"Committee"> | $Enums.CommitteeStatus
    stateOfDebate?: StringNullableFilter<"Committee"> | string | null
    statusHeadline?: StringNullableFilter<"Committee"> | string | null
    statusUntil?: DateTimeNullableFilter<"Committee"> | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFilter<"Committee"> | boolean
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    members?: CommitteeMemberListRelationFilter
    parent?: XOR<CommitteeNullableRelationFilter, CommitteeWhereInput> | null
    subCommittees?: CommitteeListRelationFilter
    messages?: MessageListRelationFilter
    agendaItems?: AgendaItemListRelationFilter
  }, "id" | "name_conferenceId" | "abbreviation_conferenceId">

  export type CommitteeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    category?: SortOrder
    conferenceId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    whiteboardContent?: SortOrder
    status?: SortOrder
    stateOfDebate?: SortOrderInput | SortOrder
    statusHeadline?: SortOrderInput | SortOrder
    statusUntil?: SortOrderInput | SortOrder
    allowDelegationsToAddThemselvesToSpeakersList?: SortOrder
    _count?: CommitteeCountOrderByAggregateInput
    _max?: CommitteeMaxOrderByAggregateInput
    _min?: CommitteeMinOrderByAggregateInput
  }

  export type CommitteeScalarWhereWithAggregatesInput = {
    AND?: CommitteeScalarWhereWithAggregatesInput | CommitteeScalarWhereWithAggregatesInput[]
    OR?: CommitteeScalarWhereWithAggregatesInput[]
    NOT?: CommitteeScalarWhereWithAggregatesInput | CommitteeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Committee"> | string
    name?: StringWithAggregatesFilter<"Committee"> | string
    abbreviation?: StringWithAggregatesFilter<"Committee"> | string
    category?: EnumCommitteeCategoryWithAggregatesFilter<"Committee"> | $Enums.CommitteeCategory
    conferenceId?: StringWithAggregatesFilter<"Committee"> | string
    parentId?: StringNullableWithAggregatesFilter<"Committee"> | string | null
    whiteboardContent?: StringWithAggregatesFilter<"Committee"> | string
    status?: EnumCommitteeStatusWithAggregatesFilter<"Committee"> | $Enums.CommitteeStatus
    stateOfDebate?: StringNullableWithAggregatesFilter<"Committee"> | string | null
    statusHeadline?: StringNullableWithAggregatesFilter<"Committee"> | string | null
    statusUntil?: DateTimeNullableWithAggregatesFilter<"Committee"> | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolWithAggregatesFilter<"Committee"> | boolean
  }

  export type CommitteeMemberWhereInput = {
    AND?: CommitteeMemberWhereInput | CommitteeMemberWhereInput[]
    OR?: CommitteeMemberWhereInput[]
    NOT?: CommitteeMemberWhereInput | CommitteeMemberWhereInput[]
    id?: StringFilter<"CommitteeMember"> | string
    committeeId?: StringFilter<"CommitteeMember"> | string
    userId?: StringNullableFilter<"CommitteeMember"> | string | null
    delegationId?: StringNullableFilter<"CommitteeMember"> | string | null
    presence?: EnumPresenceFilter<"CommitteeMember"> | $Enums.Presence
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    speakerLists?: SpeakerOnListListRelationFilter
    delegation?: XOR<DelegationNullableRelationFilter, DelegationWhereInput> | null
  }

  export type CommitteeMemberOrderByWithRelationInput = {
    id?: SortOrder
    committeeId?: SortOrder
    userId?: SortOrderInput | SortOrder
    delegationId?: SortOrderInput | SortOrder
    presence?: SortOrder
    committee?: CommitteeOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    speakerLists?: SpeakerOnListOrderByRelationAggregateInput
    delegation?: DelegationOrderByWithRelationInput
  }

  export type CommitteeMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    committeeId_delegationId?: CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput
    committeeId_userId?: CommitteeMemberCommitteeIdUserIdCompoundUniqueInput
    AND?: CommitteeMemberWhereInput | CommitteeMemberWhereInput[]
    OR?: CommitteeMemberWhereInput[]
    NOT?: CommitteeMemberWhereInput | CommitteeMemberWhereInput[]
    committeeId?: StringFilter<"CommitteeMember"> | string
    userId?: StringNullableFilter<"CommitteeMember"> | string | null
    delegationId?: StringNullableFilter<"CommitteeMember"> | string | null
    presence?: EnumPresenceFilter<"CommitteeMember"> | $Enums.Presence
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    speakerLists?: SpeakerOnListListRelationFilter
    delegation?: XOR<DelegationNullableRelationFilter, DelegationWhereInput> | null
  }, "id" | "committeeId_delegationId" | "committeeId_userId">

  export type CommitteeMemberOrderByWithAggregationInput = {
    id?: SortOrder
    committeeId?: SortOrder
    userId?: SortOrderInput | SortOrder
    delegationId?: SortOrderInput | SortOrder
    presence?: SortOrder
    _count?: CommitteeMemberCountOrderByAggregateInput
    _max?: CommitteeMemberMaxOrderByAggregateInput
    _min?: CommitteeMemberMinOrderByAggregateInput
  }

  export type CommitteeMemberScalarWhereWithAggregatesInput = {
    AND?: CommitteeMemberScalarWhereWithAggregatesInput | CommitteeMemberScalarWhereWithAggregatesInput[]
    OR?: CommitteeMemberScalarWhereWithAggregatesInput[]
    NOT?: CommitteeMemberScalarWhereWithAggregatesInput | CommitteeMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommitteeMember"> | string
    committeeId?: StringWithAggregatesFilter<"CommitteeMember"> | string
    userId?: StringNullableWithAggregatesFilter<"CommitteeMember"> | string | null
    delegationId?: StringNullableWithAggregatesFilter<"CommitteeMember"> | string | null
    presence?: EnumPresenceWithAggregatesFilter<"CommitteeMember"> | $Enums.Presence
  }

  export type AgendaItemWhereInput = {
    AND?: AgendaItemWhereInput | AgendaItemWhereInput[]
    OR?: AgendaItemWhereInput[]
    NOT?: AgendaItemWhereInput | AgendaItemWhereInput[]
    id?: StringFilter<"AgendaItem"> | string
    committeeId?: StringFilter<"AgendaItem"> | string
    title?: StringFilter<"AgendaItem"> | string
    description?: StringNullableFilter<"AgendaItem"> | string | null
    isActive?: BoolFilter<"AgendaItem"> | boolean
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    speakerLists?: SpeakersListListRelationFilter
  }

  export type AgendaItemOrderByWithRelationInput = {
    id?: SortOrder
    committeeId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    committee?: CommitteeOrderByWithRelationInput
    speakerLists?: SpeakersListOrderByRelationAggregateInput
  }

  export type AgendaItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgendaItemWhereInput | AgendaItemWhereInput[]
    OR?: AgendaItemWhereInput[]
    NOT?: AgendaItemWhereInput | AgendaItemWhereInput[]
    committeeId?: StringFilter<"AgendaItem"> | string
    title?: StringFilter<"AgendaItem"> | string
    description?: StringNullableFilter<"AgendaItem"> | string | null
    isActive?: BoolFilter<"AgendaItem"> | boolean
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    speakerLists?: SpeakersListListRelationFilter
  }, "id">

  export type AgendaItemOrderByWithAggregationInput = {
    id?: SortOrder
    committeeId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: AgendaItemCountOrderByAggregateInput
    _max?: AgendaItemMaxOrderByAggregateInput
    _min?: AgendaItemMinOrderByAggregateInput
  }

  export type AgendaItemScalarWhereWithAggregatesInput = {
    AND?: AgendaItemScalarWhereWithAggregatesInput | AgendaItemScalarWhereWithAggregatesInput[]
    OR?: AgendaItemScalarWhereWithAggregatesInput[]
    NOT?: AgendaItemScalarWhereWithAggregatesInput | AgendaItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgendaItem"> | string
    committeeId?: StringWithAggregatesFilter<"AgendaItem"> | string
    title?: StringWithAggregatesFilter<"AgendaItem"> | string
    description?: StringNullableWithAggregatesFilter<"AgendaItem"> | string | null
    isActive?: BoolWithAggregatesFilter<"AgendaItem"> | boolean
  }

  export type SpeakersListWhereInput = {
    AND?: SpeakersListWhereInput | SpeakersListWhereInput[]
    OR?: SpeakersListWhereInput[]
    NOT?: SpeakersListWhereInput | SpeakersListWhereInput[]
    id?: StringFilter<"SpeakersList"> | string
    agendaItemId?: StringFilter<"SpeakersList"> | string
    type?: EnumSpeakersListCategoryFilter<"SpeakersList"> | $Enums.SpeakersListCategory
    speakingTime?: IntFilter<"SpeakersList"> | number
    timeLeft?: IntNullableFilter<"SpeakersList"> | number | null
    startTimestamp?: DateTimeNullableFilter<"SpeakersList"> | Date | string | null
    isClosed?: BoolFilter<"SpeakersList"> | boolean
    agendaItem?: XOR<AgendaItemRelationFilter, AgendaItemWhereInput>
    speakers?: SpeakerOnListListRelationFilter
  }

  export type SpeakersListOrderByWithRelationInput = {
    id?: SortOrder
    agendaItemId?: SortOrder
    type?: SortOrder
    speakingTime?: SortOrder
    timeLeft?: SortOrderInput | SortOrder
    startTimestamp?: SortOrderInput | SortOrder
    isClosed?: SortOrder
    agendaItem?: AgendaItemOrderByWithRelationInput
    speakers?: SpeakerOnListOrderByRelationAggregateInput
  }

  export type SpeakersListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    agendaItemId_type?: SpeakersListAgendaItemIdTypeCompoundUniqueInput
    AND?: SpeakersListWhereInput | SpeakersListWhereInput[]
    OR?: SpeakersListWhereInput[]
    NOT?: SpeakersListWhereInput | SpeakersListWhereInput[]
    agendaItemId?: StringFilter<"SpeakersList"> | string
    type?: EnumSpeakersListCategoryFilter<"SpeakersList"> | $Enums.SpeakersListCategory
    speakingTime?: IntFilter<"SpeakersList"> | number
    timeLeft?: IntNullableFilter<"SpeakersList"> | number | null
    startTimestamp?: DateTimeNullableFilter<"SpeakersList"> | Date | string | null
    isClosed?: BoolFilter<"SpeakersList"> | boolean
    agendaItem?: XOR<AgendaItemRelationFilter, AgendaItemWhereInput>
    speakers?: SpeakerOnListListRelationFilter
  }, "id" | "agendaItemId_type">

  export type SpeakersListOrderByWithAggregationInput = {
    id?: SortOrder
    agendaItemId?: SortOrder
    type?: SortOrder
    speakingTime?: SortOrder
    timeLeft?: SortOrderInput | SortOrder
    startTimestamp?: SortOrderInput | SortOrder
    isClosed?: SortOrder
    _count?: SpeakersListCountOrderByAggregateInput
    _avg?: SpeakersListAvgOrderByAggregateInput
    _max?: SpeakersListMaxOrderByAggregateInput
    _min?: SpeakersListMinOrderByAggregateInput
    _sum?: SpeakersListSumOrderByAggregateInput
  }

  export type SpeakersListScalarWhereWithAggregatesInput = {
    AND?: SpeakersListScalarWhereWithAggregatesInput | SpeakersListScalarWhereWithAggregatesInput[]
    OR?: SpeakersListScalarWhereWithAggregatesInput[]
    NOT?: SpeakersListScalarWhereWithAggregatesInput | SpeakersListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SpeakersList"> | string
    agendaItemId?: StringWithAggregatesFilter<"SpeakersList"> | string
    type?: EnumSpeakersListCategoryWithAggregatesFilter<"SpeakersList"> | $Enums.SpeakersListCategory
    speakingTime?: IntWithAggregatesFilter<"SpeakersList"> | number
    timeLeft?: IntNullableWithAggregatesFilter<"SpeakersList"> | number | null
    startTimestamp?: DateTimeNullableWithAggregatesFilter<"SpeakersList"> | Date | string | null
    isClosed?: BoolWithAggregatesFilter<"SpeakersList"> | boolean
  }

  export type SpeakerOnListWhereInput = {
    AND?: SpeakerOnListWhereInput | SpeakerOnListWhereInput[]
    OR?: SpeakerOnListWhereInput[]
    NOT?: SpeakerOnListWhereInput | SpeakerOnListWhereInput[]
    id?: StringFilter<"SpeakerOnList"> | string
    speakersListId?: StringFilter<"SpeakerOnList"> | string
    committeeMemberId?: StringFilter<"SpeakerOnList"> | string
    position?: IntFilter<"SpeakerOnList"> | number
    speakersList?: XOR<SpeakersListRelationFilter, SpeakersListWhereInput>
    committeeMember?: XOR<CommitteeMemberRelationFilter, CommitteeMemberWhereInput>
  }

  export type SpeakerOnListOrderByWithRelationInput = {
    id?: SortOrder
    speakersListId?: SortOrder
    committeeMemberId?: SortOrder
    position?: SortOrder
    speakersList?: SpeakersListOrderByWithRelationInput
    committeeMember?: CommitteeMemberOrderByWithRelationInput
  }

  export type SpeakerOnListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    speakersListId_position?: SpeakerOnListSpeakersListIdPositionCompoundUniqueInput
    speakersListId_committeeMemberId?: SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput
    AND?: SpeakerOnListWhereInput | SpeakerOnListWhereInput[]
    OR?: SpeakerOnListWhereInput[]
    NOT?: SpeakerOnListWhereInput | SpeakerOnListWhereInput[]
    speakersListId?: StringFilter<"SpeakerOnList"> | string
    committeeMemberId?: StringFilter<"SpeakerOnList"> | string
    position?: IntFilter<"SpeakerOnList"> | number
    speakersList?: XOR<SpeakersListRelationFilter, SpeakersListWhereInput>
    committeeMember?: XOR<CommitteeMemberRelationFilter, CommitteeMemberWhereInput>
  }, "id" | "speakersListId_position" | "speakersListId_committeeMemberId">

  export type SpeakerOnListOrderByWithAggregationInput = {
    id?: SortOrder
    speakersListId?: SortOrder
    committeeMemberId?: SortOrder
    position?: SortOrder
    _count?: SpeakerOnListCountOrderByAggregateInput
    _avg?: SpeakerOnListAvgOrderByAggregateInput
    _max?: SpeakerOnListMaxOrderByAggregateInput
    _min?: SpeakerOnListMinOrderByAggregateInput
    _sum?: SpeakerOnListSumOrderByAggregateInput
  }

  export type SpeakerOnListScalarWhereWithAggregatesInput = {
    AND?: SpeakerOnListScalarWhereWithAggregatesInput | SpeakerOnListScalarWhereWithAggregatesInput[]
    OR?: SpeakerOnListScalarWhereWithAggregatesInput[]
    NOT?: SpeakerOnListScalarWhereWithAggregatesInput | SpeakerOnListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SpeakerOnList"> | string
    speakersListId?: StringWithAggregatesFilter<"SpeakerOnList"> | string
    committeeMemberId?: StringWithAggregatesFilter<"SpeakerOnList"> | string
    position?: IntWithAggregatesFilter<"SpeakerOnList"> | number
  }

  export type DelegationWhereInput = {
    AND?: DelegationWhereInput | DelegationWhereInput[]
    OR?: DelegationWhereInput[]
    NOT?: DelegationWhereInput | DelegationWhereInput[]
    id?: StringFilter<"Delegation"> | string
    conferenceId?: StringFilter<"Delegation"> | string
    nationId?: StringFilter<"Delegation"> | string
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    nation?: XOR<NationRelationFilter, NationWhereInput>
    members?: CommitteeMemberListRelationFilter
  }

  export type DelegationOrderByWithRelationInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    nationId?: SortOrder
    conference?: ConferenceOrderByWithRelationInput
    nation?: NationOrderByWithRelationInput
    members?: CommitteeMemberOrderByRelationAggregateInput
  }

  export type DelegationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    conferenceId_nationId?: DelegationConferenceIdNationIdCompoundUniqueInput
    AND?: DelegationWhereInput | DelegationWhereInput[]
    OR?: DelegationWhereInput[]
    NOT?: DelegationWhereInput | DelegationWhereInput[]
    conferenceId?: StringFilter<"Delegation"> | string
    nationId?: StringFilter<"Delegation"> | string
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
    nation?: XOR<NationRelationFilter, NationWhereInput>
    members?: CommitteeMemberListRelationFilter
  }, "id" | "conferenceId_nationId">

  export type DelegationOrderByWithAggregationInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    nationId?: SortOrder
    _count?: DelegationCountOrderByAggregateInput
    _max?: DelegationMaxOrderByAggregateInput
    _min?: DelegationMinOrderByAggregateInput
  }

  export type DelegationScalarWhereWithAggregatesInput = {
    AND?: DelegationScalarWhereWithAggregatesInput | DelegationScalarWhereWithAggregatesInput[]
    OR?: DelegationScalarWhereWithAggregatesInput[]
    NOT?: DelegationScalarWhereWithAggregatesInput | DelegationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Delegation"> | string
    conferenceId?: StringWithAggregatesFilter<"Delegation"> | string
    nationId?: StringWithAggregatesFilter<"Delegation"> | string
  }

  export type NationWhereInput = {
    AND?: NationWhereInput | NationWhereInput[]
    OR?: NationWhereInput[]
    NOT?: NationWhereInput | NationWhereInput[]
    id?: StringFilter<"Nation"> | string
    alpha3Code?: StringFilter<"Nation"> | string
    variant?: EnumNationVariantFilter<"Nation"> | $Enums.NationVariant
    delegations?: DelegationListRelationFilter
  }

  export type NationOrderByWithRelationInput = {
    id?: SortOrder
    alpha3Code?: SortOrder
    variant?: SortOrder
    delegations?: DelegationOrderByRelationAggregateInput
  }

  export type NationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    alpha3Code?: string
    AND?: NationWhereInput | NationWhereInput[]
    OR?: NationWhereInput[]
    NOT?: NationWhereInput | NationWhereInput[]
    variant?: EnumNationVariantFilter<"Nation"> | $Enums.NationVariant
    delegations?: DelegationListRelationFilter
  }, "id" | "alpha3Code">

  export type NationOrderByWithAggregationInput = {
    id?: SortOrder
    alpha3Code?: SortOrder
    variant?: SortOrder
    _count?: NationCountOrderByAggregateInput
    _max?: NationMaxOrderByAggregateInput
    _min?: NationMinOrderByAggregateInput
  }

  export type NationScalarWhereWithAggregatesInput = {
    AND?: NationScalarWhereWithAggregatesInput | NationScalarWhereWithAggregatesInput[]
    OR?: NationScalarWhereWithAggregatesInput[]
    NOT?: NationScalarWhereWithAggregatesInput | NationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Nation"> | string
    alpha3Code?: StringWithAggregatesFilter<"Nation"> | string
    variant?: EnumNationVariantWithAggregatesFilter<"Nation"> | $Enums.NationVariant
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    subject?: StringFilter<"Message"> | string
    category?: EnumMessageCategoryFilter<"Message"> | $Enums.MessageCategory
    message?: StringFilter<"Message"> | string
    committeeId?: StringFilter<"Message"> | string
    authorId?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
    status?: EnumMessageStatusNullableListFilter<"Message">
    forwarded?: BoolFilter<"Message"> | boolean
    metaEmail?: StringNullableFilter<"Message"> | string | null
    metaDelegation?: StringNullableFilter<"Message"> | string | null
    metaCommittee?: StringNullableFilter<"Message"> | string | null
    metaAgendaItem?: StringNullableFilter<"Message"> | string | null
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    author?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    subject?: SortOrder
    category?: SortOrder
    message?: SortOrder
    committeeId?: SortOrder
    authorId?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    forwarded?: SortOrder
    metaEmail?: SortOrderInput | SortOrder
    metaDelegation?: SortOrderInput | SortOrder
    metaCommittee?: SortOrderInput | SortOrder
    metaAgendaItem?: SortOrderInput | SortOrder
    committee?: CommitteeOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    subject?: StringFilter<"Message"> | string
    category?: EnumMessageCategoryFilter<"Message"> | $Enums.MessageCategory
    message?: StringFilter<"Message"> | string
    committeeId?: StringFilter<"Message"> | string
    authorId?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
    status?: EnumMessageStatusNullableListFilter<"Message">
    forwarded?: BoolFilter<"Message"> | boolean
    metaEmail?: StringNullableFilter<"Message"> | string | null
    metaDelegation?: StringNullableFilter<"Message"> | string | null
    metaCommittee?: StringNullableFilter<"Message"> | string | null
    metaAgendaItem?: StringNullableFilter<"Message"> | string | null
    committee?: XOR<CommitteeRelationFilter, CommitteeWhereInput>
    author?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    subject?: SortOrder
    category?: SortOrder
    message?: SortOrder
    committeeId?: SortOrder
    authorId?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    forwarded?: SortOrder
    metaEmail?: SortOrderInput | SortOrder
    metaDelegation?: SortOrderInput | SortOrder
    metaCommittee?: SortOrderInput | SortOrder
    metaAgendaItem?: SortOrderInput | SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    subject?: StringWithAggregatesFilter<"Message"> | string
    category?: EnumMessageCategoryWithAggregatesFilter<"Message"> | $Enums.MessageCategory
    message?: StringWithAggregatesFilter<"Message"> | string
    committeeId?: StringWithAggregatesFilter<"Message"> | string
    authorId?: StringWithAggregatesFilter<"Message"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    status?: EnumMessageStatusNullableListFilter<"Message">
    forwarded?: BoolWithAggregatesFilter<"Message"> | boolean
    metaEmail?: StringNullableWithAggregatesFilter<"Message"> | string | null
    metaDelegation?: StringNullableWithAggregatesFilter<"Message"> | string | null
    metaCommittee?: StringNullableWithAggregatesFilter<"Message"> | string | null
    metaAgendaItem?: StringNullableWithAggregatesFilter<"Message"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberCreateNestedManyWithoutUserInput
    committeeMemberships?: CommitteeMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberUncheckedCreateNestedManyWithoutUserInput
    committeeMemberships?: CommitteeMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUpdateManyWithoutUserNestedInput
    committeeMemberships?: CommitteeMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUncheckedUpdateManyWithoutUserNestedInput
    committeeMemberships?: CommitteeMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreationTokenCreateInput = {
    token: string
  }

  export type ConferenceCreationTokenUncheckedCreateInput = {
    token: string
  }

  export type ConferenceCreationTokenUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreationTokenUncheckedUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreationTokenCreateManyInput = {
    token: string
  }

  export type ConferenceCreationTokenUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreationTokenUncheckedUpdateManyInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreateInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationCreateNestedManyWithoutConferenceInput
    members?: ConferenceMemberCreateNestedManyWithoutConferenceInput
    committees?: CommitteeCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUncheckedCreateInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationUncheckedCreateNestedManyWithoutConferenceInput
    members?: ConferenceMemberUncheckedCreateNestedManyWithoutConferenceInput
    committees?: CommitteeUncheckedCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUpdateManyWithoutConferenceNestedInput
    members?: ConferenceMemberUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUncheckedUpdateManyWithoutConferenceNestedInput
    members?: ConferenceMemberUncheckedUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUncheckedUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceCreateManyInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
  }

  export type ConferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConferenceMemberCreateInput = {
    id?: string
    role: $Enums.ConferenceRole
    conference: ConferenceCreateNestedOneWithoutMembersInput
    user?: UserCreateNestedOneWithoutConferenceMembershipsInput
  }

  export type ConferenceMemberUncheckedCreateInput = {
    id?: string
    conferenceId: string
    userId?: string | null
    role: $Enums.ConferenceRole
  }

  export type ConferenceMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
    conference?: ConferenceUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneWithoutConferenceMembershipsNestedInput
  }

  export type ConferenceMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type ConferenceMemberCreateManyInput = {
    id?: string
    conferenceId: string
    userId?: string | null
    role: $Enums.ConferenceRole
  }

  export type ConferenceMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type ConferenceMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type CommitteeCreateInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeCreateManyInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
  }

  export type CommitteeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CommitteeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CommitteeMemberCreateInput = {
    id?: string
    presence?: $Enums.Presence
    committee: CommitteeCreateNestedOneWithoutMembersInput
    user?: UserCreateNestedOneWithoutCommitteeMembershipsInput
    speakerLists?: SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput
    delegation?: DelegationCreateNestedOneWithoutMembersInput
  }

  export type CommitteeMemberUncheckedCreateInput = {
    id?: string
    committeeId: string
    userId?: string | null
    delegationId?: string | null
    presence?: $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedCreateNestedManyWithoutCommitteeMemberInput
  }

  export type CommitteeMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    committee?: CommitteeUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneWithoutCommitteeMembershipsNestedInput
    speakerLists?: SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput
    delegation?: DelegationUpdateOneWithoutMembersNestedInput
  }

  export type CommitteeMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberNestedInput
  }

  export type CommitteeMemberCreateManyInput = {
    id?: string
    committeeId: string
    userId?: string | null
    delegationId?: string | null
    presence?: $Enums.Presence
  }

  export type CommitteeMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type CommitteeMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type AgendaItemCreateInput = {
    id?: string
    title: string
    description?: string | null
    isActive?: boolean
    committee: CommitteeCreateNestedOneWithoutAgendaItemsInput
    speakerLists?: SpeakersListCreateNestedManyWithoutAgendaItemInput
  }

  export type AgendaItemUncheckedCreateInput = {
    id?: string
    committeeId: string
    title: string
    description?: string | null
    isActive?: boolean
    speakerLists?: SpeakersListUncheckedCreateNestedManyWithoutAgendaItemInput
  }

  export type AgendaItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    committee?: CommitteeUpdateOneRequiredWithoutAgendaItemsNestedInput
    speakerLists?: SpeakersListUpdateManyWithoutAgendaItemNestedInput
  }

  export type AgendaItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    speakerLists?: SpeakersListUncheckedUpdateManyWithoutAgendaItemNestedInput
  }

  export type AgendaItemCreateManyInput = {
    id?: string
    committeeId: string
    title: string
    description?: string | null
    isActive?: boolean
  }

  export type AgendaItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AgendaItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakersListCreateInput = {
    id?: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
    agendaItem: AgendaItemCreateNestedOneWithoutSpeakerListsInput
    speakers?: SpeakerOnListCreateNestedManyWithoutSpeakersListInput
  }

  export type SpeakersListUncheckedCreateInput = {
    id?: string
    agendaItemId: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
    speakers?: SpeakerOnListUncheckedCreateNestedManyWithoutSpeakersListInput
  }

  export type SpeakersListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    agendaItem?: AgendaItemUpdateOneRequiredWithoutSpeakerListsNestedInput
    speakers?: SpeakerOnListUpdateManyWithoutSpeakersListNestedInput
  }

  export type SpeakersListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agendaItemId?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    speakers?: SpeakerOnListUncheckedUpdateManyWithoutSpeakersListNestedInput
  }

  export type SpeakersListCreateManyInput = {
    id?: string
    agendaItemId: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
  }

  export type SpeakersListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakersListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agendaItemId?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakerOnListCreateInput = {
    id?: string
    position: number
    speakersList: SpeakersListCreateNestedOneWithoutSpeakersInput
    committeeMember: CommitteeMemberCreateNestedOneWithoutSpeakerListsInput
  }

  export type SpeakerOnListUncheckedCreateInput = {
    id?: string
    speakersListId: string
    committeeMemberId: string
    position: number
  }

  export type SpeakerOnListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    speakersList?: SpeakersListUpdateOneRequiredWithoutSpeakersNestedInput
    committeeMember?: CommitteeMemberUpdateOneRequiredWithoutSpeakerListsNestedInput
  }

  export type SpeakerOnListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    speakersListId?: StringFieldUpdateOperationsInput | string
    committeeMemberId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakerOnListCreateManyInput = {
    id?: string
    speakersListId: string
    committeeMemberId: string
    position: number
  }

  export type SpeakerOnListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakerOnListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    speakersListId?: StringFieldUpdateOperationsInput | string
    committeeMemberId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type DelegationCreateInput = {
    id?: string
    conference: ConferenceCreateNestedOneWithoutDelegationsInput
    nation: NationCreateNestedOneWithoutDelegationsInput
    members?: CommitteeMemberCreateNestedManyWithoutDelegationInput
  }

  export type DelegationUncheckedCreateInput = {
    id?: string
    conferenceId: string
    nationId: string
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutDelegationInput
  }

  export type DelegationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conference?: ConferenceUpdateOneRequiredWithoutDelegationsNestedInput
    nation?: NationUpdateOneRequiredWithoutDelegationsNestedInput
    members?: CommitteeMemberUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    nationId?: StringFieldUpdateOperationsInput | string
    members?: CommitteeMemberUncheckedUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationCreateManyInput = {
    id?: string
    conferenceId: string
    nationId: string
  }

  export type DelegationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type DelegationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    nationId?: StringFieldUpdateOperationsInput | string
  }

  export type NationCreateInput = {
    id?: string
    alpha3Code: string
    variant?: $Enums.NationVariant
    delegations?: DelegationCreateNestedManyWithoutNationInput
  }

  export type NationUncheckedCreateInput = {
    id?: string
    alpha3Code: string
    variant?: $Enums.NationVariant
    delegations?: DelegationUncheckedCreateNestedManyWithoutNationInput
  }

  export type NationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
    delegations?: DelegationUpdateManyWithoutNationNestedInput
  }

  export type NationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
    delegations?: DelegationUncheckedUpdateManyWithoutNationNestedInput
  }

  export type NationCreateManyInput = {
    id?: string
    alpha3Code: string
    variant?: $Enums.NationVariant
  }

  export type NationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
  }

  export type NationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
  }

  export type MessageCreateInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
    committee: CommitteeCreateNestedOneWithoutMessagesInput
    author: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    committeeId: string
    authorId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
    committee?: CommitteeUpdateOneRequiredWithoutMessagesNestedInput
    author?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageCreateManyInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    committeeId: string
    authorId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type ConferenceMemberListRelationFilter = {
    every?: ConferenceMemberWhereInput
    some?: ConferenceMemberWhereInput
    none?: ConferenceMemberWhereInput
  }

  export type CommitteeMemberListRelationFilter = {
    every?: CommitteeMemberWhereInput
    some?: CommitteeMemberWhereInput
    none?: CommitteeMemberWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type ConferenceMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommitteeMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type ConferenceCreationTokenCountOrderByAggregateInput = {
    token?: SortOrder
  }

  export type ConferenceCreationTokenMaxOrderByAggregateInput = {
    token?: SortOrder
  }

  export type ConferenceCreationTokenMinOrderByAggregateInput = {
    token?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DelegationListRelationFilter = {
    every?: DelegationWhereInput
    some?: DelegationWhereInput
    none?: DelegationWhereInput
  }

  export type CommitteeListRelationFilter = {
    every?: CommitteeWhereInput
    some?: CommitteeWhereInput
    none?: CommitteeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DelegationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommitteeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConferenceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
    pressWebsite?: SortOrder
    feedbackWebsite?: SortOrder
  }

  export type ConferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
    pressWebsite?: SortOrder
    feedbackWebsite?: SortOrder
  }

  export type ConferenceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
    pressWebsite?: SortOrder
    feedbackWebsite?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumConferenceRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ConferenceRole | EnumConferenceRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumConferenceRoleFilter<$PrismaModel> | $Enums.ConferenceRole
  }

  export type ConferenceRelationFilter = {
    is?: ConferenceWhereInput
    isNot?: ConferenceWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ConferenceMemberUserIdConferenceIdCompoundUniqueInput = {
    userId: string
    conferenceId: string
  }

  export type ConferenceMemberCountOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type ConferenceMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type ConferenceMemberMinOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
  }

  export type EnumConferenceRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConferenceRole | EnumConferenceRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumConferenceRoleWithAggregatesFilter<$PrismaModel> | $Enums.ConferenceRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConferenceRoleFilter<$PrismaModel>
    _max?: NestedEnumConferenceRoleFilter<$PrismaModel>
  }

  export type EnumCommitteeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeCategory | EnumCommitteeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeCategoryFilter<$PrismaModel> | $Enums.CommitteeCategory
  }

  export type EnumCommitteeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeStatus | EnumCommitteeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeStatusFilter<$PrismaModel> | $Enums.CommitteeStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CommitteeNullableRelationFilter = {
    is?: CommitteeWhereInput | null
    isNot?: CommitteeWhereInput | null
  }

  export type AgendaItemListRelationFilter = {
    every?: AgendaItemWhereInput
    some?: AgendaItemWhereInput
    none?: AgendaItemWhereInput
  }

  export type AgendaItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommitteeNameConferenceIdCompoundUniqueInput = {
    name: string
    conferenceId: string
  }

  export type CommitteeAbbreviationConferenceIdCompoundUniqueInput = {
    abbreviation: string
    conferenceId: string
  }

  export type CommitteeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    category?: SortOrder
    conferenceId?: SortOrder
    parentId?: SortOrder
    whiteboardContent?: SortOrder
    status?: SortOrder
    stateOfDebate?: SortOrder
    statusHeadline?: SortOrder
    statusUntil?: SortOrder
    allowDelegationsToAddThemselvesToSpeakersList?: SortOrder
  }

  export type CommitteeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    category?: SortOrder
    conferenceId?: SortOrder
    parentId?: SortOrder
    whiteboardContent?: SortOrder
    status?: SortOrder
    stateOfDebate?: SortOrder
    statusHeadline?: SortOrder
    statusUntil?: SortOrder
    allowDelegationsToAddThemselvesToSpeakersList?: SortOrder
  }

  export type CommitteeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    category?: SortOrder
    conferenceId?: SortOrder
    parentId?: SortOrder
    whiteboardContent?: SortOrder
    status?: SortOrder
    stateOfDebate?: SortOrder
    statusHeadline?: SortOrder
    statusUntil?: SortOrder
    allowDelegationsToAddThemselvesToSpeakersList?: SortOrder
  }

  export type EnumCommitteeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeCategory | EnumCommitteeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CommitteeCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommitteeCategoryFilter<$PrismaModel>
    _max?: NestedEnumCommitteeCategoryFilter<$PrismaModel>
  }

  export type EnumCommitteeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeStatus | EnumCommitteeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeStatusWithAggregatesFilter<$PrismaModel> | $Enums.CommitteeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommitteeStatusFilter<$PrismaModel>
    _max?: NestedEnumCommitteeStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPresenceFilter<$PrismaModel = never> = {
    equals?: $Enums.Presence | EnumPresenceFieldRefInput<$PrismaModel>
    in?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    not?: NestedEnumPresenceFilter<$PrismaModel> | $Enums.Presence
  }

  export type CommitteeRelationFilter = {
    is?: CommitteeWhereInput
    isNot?: CommitteeWhereInput
  }

  export type SpeakerOnListListRelationFilter = {
    every?: SpeakerOnListWhereInput
    some?: SpeakerOnListWhereInput
    none?: SpeakerOnListWhereInput
  }

  export type DelegationNullableRelationFilter = {
    is?: DelegationWhereInput | null
    isNot?: DelegationWhereInput | null
  }

  export type SpeakerOnListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput = {
    committeeId: string
    delegationId: string
  }

  export type CommitteeMemberCommitteeIdUserIdCompoundUniqueInput = {
    committeeId: string
    userId: string
  }

  export type CommitteeMemberCountOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    userId?: SortOrder
    delegationId?: SortOrder
    presence?: SortOrder
  }

  export type CommitteeMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    userId?: SortOrder
    delegationId?: SortOrder
    presence?: SortOrder
  }

  export type CommitteeMemberMinOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    userId?: SortOrder
    delegationId?: SortOrder
    presence?: SortOrder
  }

  export type EnumPresenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Presence | EnumPresenceFieldRefInput<$PrismaModel>
    in?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    not?: NestedEnumPresenceWithAggregatesFilter<$PrismaModel> | $Enums.Presence
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPresenceFilter<$PrismaModel>
    _max?: NestedEnumPresenceFilter<$PrismaModel>
  }

  export type SpeakersListListRelationFilter = {
    every?: SpeakersListWhereInput
    some?: SpeakersListWhereInput
    none?: SpeakersListWhereInput
  }

  export type SpeakersListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgendaItemCountOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type AgendaItemMaxOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type AgendaItemMinOrderByAggregateInput = {
    id?: SortOrder
    committeeId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type EnumSpeakersListCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SpeakersListCategory | EnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSpeakersListCategoryFilter<$PrismaModel> | $Enums.SpeakersListCategory
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AgendaItemRelationFilter = {
    is?: AgendaItemWhereInput
    isNot?: AgendaItemWhereInput
  }

  export type SpeakersListAgendaItemIdTypeCompoundUniqueInput = {
    agendaItemId: string
    type: $Enums.SpeakersListCategory
  }

  export type SpeakersListCountOrderByAggregateInput = {
    id?: SortOrder
    agendaItemId?: SortOrder
    type?: SortOrder
    speakingTime?: SortOrder
    timeLeft?: SortOrder
    startTimestamp?: SortOrder
    isClosed?: SortOrder
  }

  export type SpeakersListAvgOrderByAggregateInput = {
    speakingTime?: SortOrder
    timeLeft?: SortOrder
  }

  export type SpeakersListMaxOrderByAggregateInput = {
    id?: SortOrder
    agendaItemId?: SortOrder
    type?: SortOrder
    speakingTime?: SortOrder
    timeLeft?: SortOrder
    startTimestamp?: SortOrder
    isClosed?: SortOrder
  }

  export type SpeakersListMinOrderByAggregateInput = {
    id?: SortOrder
    agendaItemId?: SortOrder
    type?: SortOrder
    speakingTime?: SortOrder
    timeLeft?: SortOrder
    startTimestamp?: SortOrder
    isClosed?: SortOrder
  }

  export type SpeakersListSumOrderByAggregateInput = {
    speakingTime?: SortOrder
    timeLeft?: SortOrder
  }

  export type EnumSpeakersListCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpeakersListCategory | EnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSpeakersListCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SpeakersListCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpeakersListCategoryFilter<$PrismaModel>
    _max?: NestedEnumSpeakersListCategoryFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SpeakersListRelationFilter = {
    is?: SpeakersListWhereInput
    isNot?: SpeakersListWhereInput
  }

  export type CommitteeMemberRelationFilter = {
    is?: CommitteeMemberWhereInput
    isNot?: CommitteeMemberWhereInput
  }

  export type SpeakerOnListSpeakersListIdPositionCompoundUniqueInput = {
    speakersListId: string
    position: number
  }

  export type SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput = {
    speakersListId: string
    committeeMemberId: string
  }

  export type SpeakerOnListCountOrderByAggregateInput = {
    id?: SortOrder
    speakersListId?: SortOrder
    committeeMemberId?: SortOrder
    position?: SortOrder
  }

  export type SpeakerOnListAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type SpeakerOnListMaxOrderByAggregateInput = {
    id?: SortOrder
    speakersListId?: SortOrder
    committeeMemberId?: SortOrder
    position?: SortOrder
  }

  export type SpeakerOnListMinOrderByAggregateInput = {
    id?: SortOrder
    speakersListId?: SortOrder
    committeeMemberId?: SortOrder
    position?: SortOrder
  }

  export type SpeakerOnListSumOrderByAggregateInput = {
    position?: SortOrder
  }

  export type NationRelationFilter = {
    is?: NationWhereInput
    isNot?: NationWhereInput
  }

  export type DelegationConferenceIdNationIdCompoundUniqueInput = {
    conferenceId: string
    nationId: string
  }

  export type DelegationCountOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    nationId?: SortOrder
  }

  export type DelegationMaxOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    nationId?: SortOrder
  }

  export type DelegationMinOrderByAggregateInput = {
    id?: SortOrder
    conferenceId?: SortOrder
    nationId?: SortOrder
  }

  export type EnumNationVariantFilter<$PrismaModel = never> = {
    equals?: $Enums.NationVariant | EnumNationVariantFieldRefInput<$PrismaModel>
    in?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    notIn?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    not?: NestedEnumNationVariantFilter<$PrismaModel> | $Enums.NationVariant
  }

  export type NationCountOrderByAggregateInput = {
    id?: SortOrder
    alpha3Code?: SortOrder
    variant?: SortOrder
  }

  export type NationMaxOrderByAggregateInput = {
    id?: SortOrder
    alpha3Code?: SortOrder
    variant?: SortOrder
  }

  export type NationMinOrderByAggregateInput = {
    id?: SortOrder
    alpha3Code?: SortOrder
    variant?: SortOrder
  }

  export type EnumNationVariantWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NationVariant | EnumNationVariantFieldRefInput<$PrismaModel>
    in?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    notIn?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    not?: NestedEnumNationVariantWithAggregatesFilter<$PrismaModel> | $Enums.NationVariant
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNationVariantFilter<$PrismaModel>
    _max?: NestedEnumNationVariantFilter<$PrismaModel>
  }

  export type EnumMessageCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageCategory | EnumMessageCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageCategoryFilter<$PrismaModel> | $Enums.MessageCategory
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumMessageStatusNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel> | null
    has?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    hasSome?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    category?: SortOrder
    message?: SortOrder
    committeeId?: SortOrder
    authorId?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    forwarded?: SortOrder
    metaEmail?: SortOrder
    metaDelegation?: SortOrder
    metaCommittee?: SortOrder
    metaAgendaItem?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    category?: SortOrder
    message?: SortOrder
    committeeId?: SortOrder
    authorId?: SortOrder
    timestamp?: SortOrder
    forwarded?: SortOrder
    metaEmail?: SortOrder
    metaDelegation?: SortOrder
    metaCommittee?: SortOrder
    metaAgendaItem?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    category?: SortOrder
    message?: SortOrder
    committeeId?: SortOrder
    authorId?: SortOrder
    timestamp?: SortOrder
    forwarded?: SortOrder
    metaEmail?: SortOrder
    metaDelegation?: SortOrder
    metaCommittee?: SortOrder
    metaAgendaItem?: SortOrder
  }

  export type EnumMessageCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageCategory | EnumMessageCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageCategoryWithAggregatesFilter<$PrismaModel> | $Enums.MessageCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageCategoryFilter<$PrismaModel>
    _max?: NestedEnumMessageCategoryFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ConferenceMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput> | ConferenceMemberCreateWithoutUserInput[] | ConferenceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutUserInput | ConferenceMemberCreateOrConnectWithoutUserInput[]
    createMany?: ConferenceMemberCreateManyUserInputEnvelope
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
  }

  export type CommitteeMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput> | CommitteeMemberCreateWithoutUserInput[] | CommitteeMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutUserInput | CommitteeMemberCreateOrConnectWithoutUserInput[]
    createMany?: CommitteeMemberCreateManyUserInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutAuthorInput = {
    create?: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput> | MessageCreateWithoutAuthorInput[] | MessageUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutAuthorInput | MessageCreateOrConnectWithoutAuthorInput[]
    createMany?: MessageCreateManyAuthorInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ConferenceMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput> | ConferenceMemberCreateWithoutUserInput[] | ConferenceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutUserInput | ConferenceMemberCreateOrConnectWithoutUserInput[]
    createMany?: ConferenceMemberCreateManyUserInputEnvelope
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
  }

  export type CommitteeMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput> | CommitteeMemberCreateWithoutUserInput[] | CommitteeMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutUserInput | CommitteeMemberCreateOrConnectWithoutUserInput[]
    createMany?: CommitteeMemberCreateManyUserInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput> | MessageCreateWithoutAuthorInput[] | MessageUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutAuthorInput | MessageCreateOrConnectWithoutAuthorInput[]
    createMany?: MessageCreateManyAuthorInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type ConferenceMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput> | ConferenceMemberCreateWithoutUserInput[] | ConferenceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutUserInput | ConferenceMemberCreateOrConnectWithoutUserInput[]
    upsert?: ConferenceMemberUpsertWithWhereUniqueWithoutUserInput | ConferenceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConferenceMemberCreateManyUserInputEnvelope
    set?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    disconnect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    delete?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    update?: ConferenceMemberUpdateWithWhereUniqueWithoutUserInput | ConferenceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConferenceMemberUpdateManyWithWhereWithoutUserInput | ConferenceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
  }

  export type CommitteeMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput> | CommitteeMemberCreateWithoutUserInput[] | CommitteeMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutUserInput | CommitteeMemberCreateOrConnectWithoutUserInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutUserInput | CommitteeMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommitteeMemberCreateManyUserInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutUserInput | CommitteeMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutUserInput | CommitteeMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput> | MessageCreateWithoutAuthorInput[] | MessageUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutAuthorInput | MessageCreateOrConnectWithoutAuthorInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutAuthorInput | MessageUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: MessageCreateManyAuthorInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutAuthorInput | MessageUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutAuthorInput | MessageUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ConferenceMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput> | ConferenceMemberCreateWithoutUserInput[] | ConferenceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutUserInput | ConferenceMemberCreateOrConnectWithoutUserInput[]
    upsert?: ConferenceMemberUpsertWithWhereUniqueWithoutUserInput | ConferenceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConferenceMemberCreateManyUserInputEnvelope
    set?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    disconnect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    delete?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    update?: ConferenceMemberUpdateWithWhereUniqueWithoutUserInput | ConferenceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConferenceMemberUpdateManyWithWhereWithoutUserInput | ConferenceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput> | CommitteeMemberCreateWithoutUserInput[] | CommitteeMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutUserInput | CommitteeMemberCreateOrConnectWithoutUserInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutUserInput | CommitteeMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommitteeMemberCreateManyUserInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutUserInput | CommitteeMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutUserInput | CommitteeMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput> | MessageCreateWithoutAuthorInput[] | MessageUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutAuthorInput | MessageCreateOrConnectWithoutAuthorInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutAuthorInput | MessageUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: MessageCreateManyAuthorInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutAuthorInput | MessageUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutAuthorInput | MessageUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type DelegationCreateNestedManyWithoutConferenceInput = {
    create?: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput> | DelegationCreateWithoutConferenceInput[] | DelegationUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutConferenceInput | DelegationCreateOrConnectWithoutConferenceInput[]
    createMany?: DelegationCreateManyConferenceInputEnvelope
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
  }

  export type ConferenceMemberCreateNestedManyWithoutConferenceInput = {
    create?: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput> | ConferenceMemberCreateWithoutConferenceInput[] | ConferenceMemberUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutConferenceInput | ConferenceMemberCreateOrConnectWithoutConferenceInput[]
    createMany?: ConferenceMemberCreateManyConferenceInputEnvelope
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
  }

  export type CommitteeCreateNestedManyWithoutConferenceInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type DelegationUncheckedCreateNestedManyWithoutConferenceInput = {
    create?: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput> | DelegationCreateWithoutConferenceInput[] | DelegationUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutConferenceInput | DelegationCreateOrConnectWithoutConferenceInput[]
    createMany?: DelegationCreateManyConferenceInputEnvelope
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
  }

  export type ConferenceMemberUncheckedCreateNestedManyWithoutConferenceInput = {
    create?: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput> | ConferenceMemberCreateWithoutConferenceInput[] | ConferenceMemberUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutConferenceInput | ConferenceMemberCreateOrConnectWithoutConferenceInput[]
    createMany?: ConferenceMemberCreateManyConferenceInputEnvelope
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
  }

  export type CommitteeUncheckedCreateNestedManyWithoutConferenceInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DelegationUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput> | DelegationCreateWithoutConferenceInput[] | DelegationUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutConferenceInput | DelegationCreateOrConnectWithoutConferenceInput[]
    upsert?: DelegationUpsertWithWhereUniqueWithoutConferenceInput | DelegationUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: DelegationCreateManyConferenceInputEnvelope
    set?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    disconnect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    delete?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    update?: DelegationUpdateWithWhereUniqueWithoutConferenceInput | DelegationUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: DelegationUpdateManyWithWhereWithoutConferenceInput | DelegationUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
  }

  export type ConferenceMemberUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput> | ConferenceMemberCreateWithoutConferenceInput[] | ConferenceMemberUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutConferenceInput | ConferenceMemberCreateOrConnectWithoutConferenceInput[]
    upsert?: ConferenceMemberUpsertWithWhereUniqueWithoutConferenceInput | ConferenceMemberUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: ConferenceMemberCreateManyConferenceInputEnvelope
    set?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    disconnect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    delete?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    update?: ConferenceMemberUpdateWithWhereUniqueWithoutConferenceInput | ConferenceMemberUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: ConferenceMemberUpdateManyWithWhereWithoutConferenceInput | ConferenceMemberUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
  }

  export type CommitteeUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    upsert?: CommitteeUpsertWithWhereUniqueWithoutConferenceInput | CommitteeUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    set?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    disconnect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    delete?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    update?: CommitteeUpdateWithWhereUniqueWithoutConferenceInput | CommitteeUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: CommitteeUpdateManyWithWhereWithoutConferenceInput | CommitteeUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
  }

  export type DelegationUncheckedUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput> | DelegationCreateWithoutConferenceInput[] | DelegationUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutConferenceInput | DelegationCreateOrConnectWithoutConferenceInput[]
    upsert?: DelegationUpsertWithWhereUniqueWithoutConferenceInput | DelegationUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: DelegationCreateManyConferenceInputEnvelope
    set?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    disconnect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    delete?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    update?: DelegationUpdateWithWhereUniqueWithoutConferenceInput | DelegationUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: DelegationUpdateManyWithWhereWithoutConferenceInput | DelegationUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
  }

  export type ConferenceMemberUncheckedUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput> | ConferenceMemberCreateWithoutConferenceInput[] | ConferenceMemberUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: ConferenceMemberCreateOrConnectWithoutConferenceInput | ConferenceMemberCreateOrConnectWithoutConferenceInput[]
    upsert?: ConferenceMemberUpsertWithWhereUniqueWithoutConferenceInput | ConferenceMemberUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: ConferenceMemberCreateManyConferenceInputEnvelope
    set?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    disconnect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    delete?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    connect?: ConferenceMemberWhereUniqueInput | ConferenceMemberWhereUniqueInput[]
    update?: ConferenceMemberUpdateWithWhereUniqueWithoutConferenceInput | ConferenceMemberUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: ConferenceMemberUpdateManyWithWhereWithoutConferenceInput | ConferenceMemberUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
  }

  export type CommitteeUncheckedUpdateManyWithoutConferenceNestedInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    upsert?: CommitteeUpsertWithWhereUniqueWithoutConferenceInput | CommitteeUpsertWithWhereUniqueWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    set?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    disconnect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    delete?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    update?: CommitteeUpdateWithWhereUniqueWithoutConferenceInput | CommitteeUpdateWithWhereUniqueWithoutConferenceInput[]
    updateMany?: CommitteeUpdateManyWithWhereWithoutConferenceInput | CommitteeUpdateManyWithWhereWithoutConferenceInput[]
    deleteMany?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
  }

  export type ConferenceCreateNestedOneWithoutMembersInput = {
    create?: XOR<ConferenceCreateWithoutMembersInput, ConferenceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutMembersInput
    connect?: ConferenceWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutConferenceMembershipsInput = {
    create?: XOR<UserCreateWithoutConferenceMembershipsInput, UserUncheckedCreateWithoutConferenceMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConferenceMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumConferenceRoleFieldUpdateOperationsInput = {
    set?: $Enums.ConferenceRole
  }

  export type ConferenceUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ConferenceCreateWithoutMembersInput, ConferenceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutMembersInput
    upsert?: ConferenceUpsertWithoutMembersInput
    connect?: ConferenceWhereUniqueInput
    update?: XOR<XOR<ConferenceUpdateToOneWithWhereWithoutMembersInput, ConferenceUpdateWithoutMembersInput>, ConferenceUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneWithoutConferenceMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutConferenceMembershipsInput, UserUncheckedCreateWithoutConferenceMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConferenceMembershipsInput
    upsert?: UserUpsertWithoutConferenceMembershipsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutConferenceMembershipsInput, UserUpdateWithoutConferenceMembershipsInput>, UserUncheckedUpdateWithoutConferenceMembershipsInput>
  }

  export type ConferenceCreateNestedOneWithoutCommitteesInput = {
    create?: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutCommitteesInput
    connect?: ConferenceWhereUniqueInput
  }

  export type CommitteeMemberCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput> | CommitteeMemberCreateWithoutCommitteeInput[] | CommitteeMemberUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutCommitteeInput | CommitteeMemberCreateOrConnectWithoutCommitteeInput[]
    createMany?: CommitteeMemberCreateManyCommitteeInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type CommitteeCreateNestedOneWithoutSubCommitteesInput = {
    create?: XOR<CommitteeCreateWithoutSubCommitteesInput, CommitteeUncheckedCreateWithoutSubCommitteesInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutSubCommitteesInput
    connect?: CommitteeWhereUniqueInput
  }

  export type CommitteeCreateNestedManyWithoutParentInput = {
    create?: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput> | CommitteeCreateWithoutParentInput[] | CommitteeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutParentInput | CommitteeCreateOrConnectWithoutParentInput[]
    createMany?: CommitteeCreateManyParentInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput> | MessageCreateWithoutCommitteeInput[] | MessageUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutCommitteeInput | MessageCreateOrConnectWithoutCommitteeInput[]
    createMany?: MessageCreateManyCommitteeInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type AgendaItemCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput> | AgendaItemCreateWithoutCommitteeInput[] | AgendaItemUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: AgendaItemCreateOrConnectWithoutCommitteeInput | AgendaItemCreateOrConnectWithoutCommitteeInput[]
    createMany?: AgendaItemCreateManyCommitteeInputEnvelope
    connect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
  }

  export type CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput> | CommitteeMemberCreateWithoutCommitteeInput[] | CommitteeMemberUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutCommitteeInput | CommitteeMemberCreateOrConnectWithoutCommitteeInput[]
    createMany?: CommitteeMemberCreateManyCommitteeInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type CommitteeUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput> | CommitteeCreateWithoutParentInput[] | CommitteeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutParentInput | CommitteeCreateOrConnectWithoutParentInput[]
    createMany?: CommitteeCreateManyParentInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput> | MessageCreateWithoutCommitteeInput[] | MessageUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutCommitteeInput | MessageCreateOrConnectWithoutCommitteeInput[]
    createMany?: MessageCreateManyCommitteeInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput = {
    create?: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput> | AgendaItemCreateWithoutCommitteeInput[] | AgendaItemUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: AgendaItemCreateOrConnectWithoutCommitteeInput | AgendaItemCreateOrConnectWithoutCommitteeInput[]
    createMany?: AgendaItemCreateManyCommitteeInputEnvelope
    connect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
  }

  export type EnumCommitteeCategoryFieldUpdateOperationsInput = {
    set?: $Enums.CommitteeCategory
  }

  export type EnumCommitteeStatusFieldUpdateOperationsInput = {
    set?: $Enums.CommitteeStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ConferenceUpdateOneRequiredWithoutCommitteesNestedInput = {
    create?: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutCommitteesInput
    upsert?: ConferenceUpsertWithoutCommitteesInput
    connect?: ConferenceWhereUniqueInput
    update?: XOR<XOR<ConferenceUpdateToOneWithWhereWithoutCommitteesInput, ConferenceUpdateWithoutCommitteesInput>, ConferenceUncheckedUpdateWithoutCommitteesInput>
  }

  export type CommitteeMemberUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput> | CommitteeMemberCreateWithoutCommitteeInput[] | CommitteeMemberUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutCommitteeInput | CommitteeMemberCreateOrConnectWithoutCommitteeInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutCommitteeInput | CommitteeMemberUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: CommitteeMemberCreateManyCommitteeInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutCommitteeInput | CommitteeMemberUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutCommitteeInput | CommitteeMemberUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type CommitteeUpdateOneWithoutSubCommitteesNestedInput = {
    create?: XOR<CommitteeCreateWithoutSubCommitteesInput, CommitteeUncheckedCreateWithoutSubCommitteesInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutSubCommitteesInput
    upsert?: CommitteeUpsertWithoutSubCommitteesInput
    disconnect?: CommitteeWhereInput | boolean
    delete?: CommitteeWhereInput | boolean
    connect?: CommitteeWhereUniqueInput
    update?: XOR<XOR<CommitteeUpdateToOneWithWhereWithoutSubCommitteesInput, CommitteeUpdateWithoutSubCommitteesInput>, CommitteeUncheckedUpdateWithoutSubCommitteesInput>
  }

  export type CommitteeUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput> | CommitteeCreateWithoutParentInput[] | CommitteeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutParentInput | CommitteeCreateOrConnectWithoutParentInput[]
    upsert?: CommitteeUpsertWithWhereUniqueWithoutParentInput | CommitteeUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommitteeCreateManyParentInputEnvelope
    set?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    disconnect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    delete?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    update?: CommitteeUpdateWithWhereUniqueWithoutParentInput | CommitteeUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommitteeUpdateManyWithWhereWithoutParentInput | CommitteeUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput> | MessageCreateWithoutCommitteeInput[] | MessageUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutCommitteeInput | MessageCreateOrConnectWithoutCommitteeInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutCommitteeInput | MessageUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: MessageCreateManyCommitteeInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutCommitteeInput | MessageUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutCommitteeInput | MessageUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type AgendaItemUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput> | AgendaItemCreateWithoutCommitteeInput[] | AgendaItemUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: AgendaItemCreateOrConnectWithoutCommitteeInput | AgendaItemCreateOrConnectWithoutCommitteeInput[]
    upsert?: AgendaItemUpsertWithWhereUniqueWithoutCommitteeInput | AgendaItemUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: AgendaItemCreateManyCommitteeInputEnvelope
    set?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    disconnect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    delete?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    connect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    update?: AgendaItemUpdateWithWhereUniqueWithoutCommitteeInput | AgendaItemUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: AgendaItemUpdateManyWithWhereWithoutCommitteeInput | AgendaItemUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: AgendaItemScalarWhereInput | AgendaItemScalarWhereInput[]
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput> | CommitteeMemberCreateWithoutCommitteeInput[] | CommitteeMemberUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutCommitteeInput | CommitteeMemberCreateOrConnectWithoutCommitteeInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutCommitteeInput | CommitteeMemberUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: CommitteeMemberCreateManyCommitteeInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutCommitteeInput | CommitteeMemberUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutCommitteeInput | CommitteeMemberUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type CommitteeUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput> | CommitteeCreateWithoutParentInput[] | CommitteeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutParentInput | CommitteeCreateOrConnectWithoutParentInput[]
    upsert?: CommitteeUpsertWithWhereUniqueWithoutParentInput | CommitteeUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommitteeCreateManyParentInputEnvelope
    set?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    disconnect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    delete?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
    update?: CommitteeUpdateWithWhereUniqueWithoutParentInput | CommitteeUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommitteeUpdateManyWithWhereWithoutParentInput | CommitteeUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput> | MessageCreateWithoutCommitteeInput[] | MessageUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutCommitteeInput | MessageCreateOrConnectWithoutCommitteeInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutCommitteeInput | MessageUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: MessageCreateManyCommitteeInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutCommitteeInput | MessageUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutCommitteeInput | MessageUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput = {
    create?: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput> | AgendaItemCreateWithoutCommitteeInput[] | AgendaItemUncheckedCreateWithoutCommitteeInput[]
    connectOrCreate?: AgendaItemCreateOrConnectWithoutCommitteeInput | AgendaItemCreateOrConnectWithoutCommitteeInput[]
    upsert?: AgendaItemUpsertWithWhereUniqueWithoutCommitteeInput | AgendaItemUpsertWithWhereUniqueWithoutCommitteeInput[]
    createMany?: AgendaItemCreateManyCommitteeInputEnvelope
    set?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    disconnect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    delete?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    connect?: AgendaItemWhereUniqueInput | AgendaItemWhereUniqueInput[]
    update?: AgendaItemUpdateWithWhereUniqueWithoutCommitteeInput | AgendaItemUpdateWithWhereUniqueWithoutCommitteeInput[]
    updateMany?: AgendaItemUpdateManyWithWhereWithoutCommitteeInput | AgendaItemUpdateManyWithWhereWithoutCommitteeInput[]
    deleteMany?: AgendaItemScalarWhereInput | AgendaItemScalarWhereInput[]
  }

  export type CommitteeCreateNestedOneWithoutMembersInput = {
    create?: XOR<CommitteeCreateWithoutMembersInput, CommitteeUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutMembersInput
    connect?: CommitteeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCommitteeMembershipsInput = {
    create?: XOR<UserCreateWithoutCommitteeMembershipsInput, UserUncheckedCreateWithoutCommitteeMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommitteeMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput = {
    create?: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput> | SpeakerOnListCreateWithoutCommitteeMemberInput[] | SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput | SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput[]
    createMany?: SpeakerOnListCreateManyCommitteeMemberInputEnvelope
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
  }

  export type DelegationCreateNestedOneWithoutMembersInput = {
    create?: XOR<DelegationCreateWithoutMembersInput, DelegationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: DelegationCreateOrConnectWithoutMembersInput
    connect?: DelegationWhereUniqueInput
  }

  export type SpeakerOnListUncheckedCreateNestedManyWithoutCommitteeMemberInput = {
    create?: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput> | SpeakerOnListCreateWithoutCommitteeMemberInput[] | SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput | SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput[]
    createMany?: SpeakerOnListCreateManyCommitteeMemberInputEnvelope
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
  }

  export type EnumPresenceFieldUpdateOperationsInput = {
    set?: $Enums.Presence
  }

  export type CommitteeUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<CommitteeCreateWithoutMembersInput, CommitteeUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutMembersInput
    upsert?: CommitteeUpsertWithoutMembersInput
    connect?: CommitteeWhereUniqueInput
    update?: XOR<XOR<CommitteeUpdateToOneWithWhereWithoutMembersInput, CommitteeUpdateWithoutMembersInput>, CommitteeUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneWithoutCommitteeMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutCommitteeMembershipsInput, UserUncheckedCreateWithoutCommitteeMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommitteeMembershipsInput
    upsert?: UserUpsertWithoutCommitteeMembershipsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommitteeMembershipsInput, UserUpdateWithoutCommitteeMembershipsInput>, UserUncheckedUpdateWithoutCommitteeMembershipsInput>
  }

  export type SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput = {
    create?: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput> | SpeakerOnListCreateWithoutCommitteeMemberInput[] | SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput | SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput[]
    upsert?: SpeakerOnListUpsertWithWhereUniqueWithoutCommitteeMemberInput | SpeakerOnListUpsertWithWhereUniqueWithoutCommitteeMemberInput[]
    createMany?: SpeakerOnListCreateManyCommitteeMemberInputEnvelope
    set?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    disconnect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    delete?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    update?: SpeakerOnListUpdateWithWhereUniqueWithoutCommitteeMemberInput | SpeakerOnListUpdateWithWhereUniqueWithoutCommitteeMemberInput[]
    updateMany?: SpeakerOnListUpdateManyWithWhereWithoutCommitteeMemberInput | SpeakerOnListUpdateManyWithWhereWithoutCommitteeMemberInput[]
    deleteMany?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
  }

  export type DelegationUpdateOneWithoutMembersNestedInput = {
    create?: XOR<DelegationCreateWithoutMembersInput, DelegationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: DelegationCreateOrConnectWithoutMembersInput
    upsert?: DelegationUpsertWithoutMembersInput
    disconnect?: DelegationWhereInput | boolean
    delete?: DelegationWhereInput | boolean
    connect?: DelegationWhereUniqueInput
    update?: XOR<XOR<DelegationUpdateToOneWithWhereWithoutMembersInput, DelegationUpdateWithoutMembersInput>, DelegationUncheckedUpdateWithoutMembersInput>
  }

  export type SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberNestedInput = {
    create?: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput> | SpeakerOnListCreateWithoutCommitteeMemberInput[] | SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput | SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput[]
    upsert?: SpeakerOnListUpsertWithWhereUniqueWithoutCommitteeMemberInput | SpeakerOnListUpsertWithWhereUniqueWithoutCommitteeMemberInput[]
    createMany?: SpeakerOnListCreateManyCommitteeMemberInputEnvelope
    set?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    disconnect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    delete?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    update?: SpeakerOnListUpdateWithWhereUniqueWithoutCommitteeMemberInput | SpeakerOnListUpdateWithWhereUniqueWithoutCommitteeMemberInput[]
    updateMany?: SpeakerOnListUpdateManyWithWhereWithoutCommitteeMemberInput | SpeakerOnListUpdateManyWithWhereWithoutCommitteeMemberInput[]
    deleteMany?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
  }

  export type CommitteeCreateNestedOneWithoutAgendaItemsInput = {
    create?: XOR<CommitteeCreateWithoutAgendaItemsInput, CommitteeUncheckedCreateWithoutAgendaItemsInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutAgendaItemsInput
    connect?: CommitteeWhereUniqueInput
  }

  export type SpeakersListCreateNestedManyWithoutAgendaItemInput = {
    create?: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput> | SpeakersListCreateWithoutAgendaItemInput[] | SpeakersListUncheckedCreateWithoutAgendaItemInput[]
    connectOrCreate?: SpeakersListCreateOrConnectWithoutAgendaItemInput | SpeakersListCreateOrConnectWithoutAgendaItemInput[]
    createMany?: SpeakersListCreateManyAgendaItemInputEnvelope
    connect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
  }

  export type SpeakersListUncheckedCreateNestedManyWithoutAgendaItemInput = {
    create?: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput> | SpeakersListCreateWithoutAgendaItemInput[] | SpeakersListUncheckedCreateWithoutAgendaItemInput[]
    connectOrCreate?: SpeakersListCreateOrConnectWithoutAgendaItemInput | SpeakersListCreateOrConnectWithoutAgendaItemInput[]
    createMany?: SpeakersListCreateManyAgendaItemInputEnvelope
    connect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
  }

  export type CommitteeUpdateOneRequiredWithoutAgendaItemsNestedInput = {
    create?: XOR<CommitteeCreateWithoutAgendaItemsInput, CommitteeUncheckedCreateWithoutAgendaItemsInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutAgendaItemsInput
    upsert?: CommitteeUpsertWithoutAgendaItemsInput
    connect?: CommitteeWhereUniqueInput
    update?: XOR<XOR<CommitteeUpdateToOneWithWhereWithoutAgendaItemsInput, CommitteeUpdateWithoutAgendaItemsInput>, CommitteeUncheckedUpdateWithoutAgendaItemsInput>
  }

  export type SpeakersListUpdateManyWithoutAgendaItemNestedInput = {
    create?: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput> | SpeakersListCreateWithoutAgendaItemInput[] | SpeakersListUncheckedCreateWithoutAgendaItemInput[]
    connectOrCreate?: SpeakersListCreateOrConnectWithoutAgendaItemInput | SpeakersListCreateOrConnectWithoutAgendaItemInput[]
    upsert?: SpeakersListUpsertWithWhereUniqueWithoutAgendaItemInput | SpeakersListUpsertWithWhereUniqueWithoutAgendaItemInput[]
    createMany?: SpeakersListCreateManyAgendaItemInputEnvelope
    set?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    disconnect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    delete?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    connect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    update?: SpeakersListUpdateWithWhereUniqueWithoutAgendaItemInput | SpeakersListUpdateWithWhereUniqueWithoutAgendaItemInput[]
    updateMany?: SpeakersListUpdateManyWithWhereWithoutAgendaItemInput | SpeakersListUpdateManyWithWhereWithoutAgendaItemInput[]
    deleteMany?: SpeakersListScalarWhereInput | SpeakersListScalarWhereInput[]
  }

  export type SpeakersListUncheckedUpdateManyWithoutAgendaItemNestedInput = {
    create?: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput> | SpeakersListCreateWithoutAgendaItemInput[] | SpeakersListUncheckedCreateWithoutAgendaItemInput[]
    connectOrCreate?: SpeakersListCreateOrConnectWithoutAgendaItemInput | SpeakersListCreateOrConnectWithoutAgendaItemInput[]
    upsert?: SpeakersListUpsertWithWhereUniqueWithoutAgendaItemInput | SpeakersListUpsertWithWhereUniqueWithoutAgendaItemInput[]
    createMany?: SpeakersListCreateManyAgendaItemInputEnvelope
    set?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    disconnect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    delete?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    connect?: SpeakersListWhereUniqueInput | SpeakersListWhereUniqueInput[]
    update?: SpeakersListUpdateWithWhereUniqueWithoutAgendaItemInput | SpeakersListUpdateWithWhereUniqueWithoutAgendaItemInput[]
    updateMany?: SpeakersListUpdateManyWithWhereWithoutAgendaItemInput | SpeakersListUpdateManyWithWhereWithoutAgendaItemInput[]
    deleteMany?: SpeakersListScalarWhereInput | SpeakersListScalarWhereInput[]
  }

  export type AgendaItemCreateNestedOneWithoutSpeakerListsInput = {
    create?: XOR<AgendaItemCreateWithoutSpeakerListsInput, AgendaItemUncheckedCreateWithoutSpeakerListsInput>
    connectOrCreate?: AgendaItemCreateOrConnectWithoutSpeakerListsInput
    connect?: AgendaItemWhereUniqueInput
  }

  export type SpeakerOnListCreateNestedManyWithoutSpeakersListInput = {
    create?: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput> | SpeakerOnListCreateWithoutSpeakersListInput[] | SpeakerOnListUncheckedCreateWithoutSpeakersListInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutSpeakersListInput | SpeakerOnListCreateOrConnectWithoutSpeakersListInput[]
    createMany?: SpeakerOnListCreateManySpeakersListInputEnvelope
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
  }

  export type SpeakerOnListUncheckedCreateNestedManyWithoutSpeakersListInput = {
    create?: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput> | SpeakerOnListCreateWithoutSpeakersListInput[] | SpeakerOnListUncheckedCreateWithoutSpeakersListInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutSpeakersListInput | SpeakerOnListCreateOrConnectWithoutSpeakersListInput[]
    createMany?: SpeakerOnListCreateManySpeakersListInputEnvelope
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
  }

  export type EnumSpeakersListCategoryFieldUpdateOperationsInput = {
    set?: $Enums.SpeakersListCategory
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgendaItemUpdateOneRequiredWithoutSpeakerListsNestedInput = {
    create?: XOR<AgendaItemCreateWithoutSpeakerListsInput, AgendaItemUncheckedCreateWithoutSpeakerListsInput>
    connectOrCreate?: AgendaItemCreateOrConnectWithoutSpeakerListsInput
    upsert?: AgendaItemUpsertWithoutSpeakerListsInput
    connect?: AgendaItemWhereUniqueInput
    update?: XOR<XOR<AgendaItemUpdateToOneWithWhereWithoutSpeakerListsInput, AgendaItemUpdateWithoutSpeakerListsInput>, AgendaItemUncheckedUpdateWithoutSpeakerListsInput>
  }

  export type SpeakerOnListUpdateManyWithoutSpeakersListNestedInput = {
    create?: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput> | SpeakerOnListCreateWithoutSpeakersListInput[] | SpeakerOnListUncheckedCreateWithoutSpeakersListInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutSpeakersListInput | SpeakerOnListCreateOrConnectWithoutSpeakersListInput[]
    upsert?: SpeakerOnListUpsertWithWhereUniqueWithoutSpeakersListInput | SpeakerOnListUpsertWithWhereUniqueWithoutSpeakersListInput[]
    createMany?: SpeakerOnListCreateManySpeakersListInputEnvelope
    set?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    disconnect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    delete?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    update?: SpeakerOnListUpdateWithWhereUniqueWithoutSpeakersListInput | SpeakerOnListUpdateWithWhereUniqueWithoutSpeakersListInput[]
    updateMany?: SpeakerOnListUpdateManyWithWhereWithoutSpeakersListInput | SpeakerOnListUpdateManyWithWhereWithoutSpeakersListInput[]
    deleteMany?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
  }

  export type SpeakerOnListUncheckedUpdateManyWithoutSpeakersListNestedInput = {
    create?: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput> | SpeakerOnListCreateWithoutSpeakersListInput[] | SpeakerOnListUncheckedCreateWithoutSpeakersListInput[]
    connectOrCreate?: SpeakerOnListCreateOrConnectWithoutSpeakersListInput | SpeakerOnListCreateOrConnectWithoutSpeakersListInput[]
    upsert?: SpeakerOnListUpsertWithWhereUniqueWithoutSpeakersListInput | SpeakerOnListUpsertWithWhereUniqueWithoutSpeakersListInput[]
    createMany?: SpeakerOnListCreateManySpeakersListInputEnvelope
    set?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    disconnect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    delete?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    connect?: SpeakerOnListWhereUniqueInput | SpeakerOnListWhereUniqueInput[]
    update?: SpeakerOnListUpdateWithWhereUniqueWithoutSpeakersListInput | SpeakerOnListUpdateWithWhereUniqueWithoutSpeakersListInput[]
    updateMany?: SpeakerOnListUpdateManyWithWhereWithoutSpeakersListInput | SpeakerOnListUpdateManyWithWhereWithoutSpeakersListInput[]
    deleteMany?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
  }

  export type SpeakersListCreateNestedOneWithoutSpeakersInput = {
    create?: XOR<SpeakersListCreateWithoutSpeakersInput, SpeakersListUncheckedCreateWithoutSpeakersInput>
    connectOrCreate?: SpeakersListCreateOrConnectWithoutSpeakersInput
    connect?: SpeakersListWhereUniqueInput
  }

  export type CommitteeMemberCreateNestedOneWithoutSpeakerListsInput = {
    create?: XOR<CommitteeMemberCreateWithoutSpeakerListsInput, CommitteeMemberUncheckedCreateWithoutSpeakerListsInput>
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutSpeakerListsInput
    connect?: CommitteeMemberWhereUniqueInput
  }

  export type SpeakersListUpdateOneRequiredWithoutSpeakersNestedInput = {
    create?: XOR<SpeakersListCreateWithoutSpeakersInput, SpeakersListUncheckedCreateWithoutSpeakersInput>
    connectOrCreate?: SpeakersListCreateOrConnectWithoutSpeakersInput
    upsert?: SpeakersListUpsertWithoutSpeakersInput
    connect?: SpeakersListWhereUniqueInput
    update?: XOR<XOR<SpeakersListUpdateToOneWithWhereWithoutSpeakersInput, SpeakersListUpdateWithoutSpeakersInput>, SpeakersListUncheckedUpdateWithoutSpeakersInput>
  }

  export type CommitteeMemberUpdateOneRequiredWithoutSpeakerListsNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutSpeakerListsInput, CommitteeMemberUncheckedCreateWithoutSpeakerListsInput>
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutSpeakerListsInput
    upsert?: CommitteeMemberUpsertWithoutSpeakerListsInput
    connect?: CommitteeMemberWhereUniqueInput
    update?: XOR<XOR<CommitteeMemberUpdateToOneWithWhereWithoutSpeakerListsInput, CommitteeMemberUpdateWithoutSpeakerListsInput>, CommitteeMemberUncheckedUpdateWithoutSpeakerListsInput>
  }

  export type ConferenceCreateNestedOneWithoutDelegationsInput = {
    create?: XOR<ConferenceCreateWithoutDelegationsInput, ConferenceUncheckedCreateWithoutDelegationsInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutDelegationsInput
    connect?: ConferenceWhereUniqueInput
  }

  export type NationCreateNestedOneWithoutDelegationsInput = {
    create?: XOR<NationCreateWithoutDelegationsInput, NationUncheckedCreateWithoutDelegationsInput>
    connectOrCreate?: NationCreateOrConnectWithoutDelegationsInput
    connect?: NationWhereUniqueInput
  }

  export type CommitteeMemberCreateNestedManyWithoutDelegationInput = {
    create?: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput> | CommitteeMemberCreateWithoutDelegationInput[] | CommitteeMemberUncheckedCreateWithoutDelegationInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutDelegationInput | CommitteeMemberCreateOrConnectWithoutDelegationInput[]
    createMany?: CommitteeMemberCreateManyDelegationInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type CommitteeMemberUncheckedCreateNestedManyWithoutDelegationInput = {
    create?: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput> | CommitteeMemberCreateWithoutDelegationInput[] | CommitteeMemberUncheckedCreateWithoutDelegationInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutDelegationInput | CommitteeMemberCreateOrConnectWithoutDelegationInput[]
    createMany?: CommitteeMemberCreateManyDelegationInputEnvelope
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
  }

  export type ConferenceUpdateOneRequiredWithoutDelegationsNestedInput = {
    create?: XOR<ConferenceCreateWithoutDelegationsInput, ConferenceUncheckedCreateWithoutDelegationsInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutDelegationsInput
    upsert?: ConferenceUpsertWithoutDelegationsInput
    connect?: ConferenceWhereUniqueInput
    update?: XOR<XOR<ConferenceUpdateToOneWithWhereWithoutDelegationsInput, ConferenceUpdateWithoutDelegationsInput>, ConferenceUncheckedUpdateWithoutDelegationsInput>
  }

  export type NationUpdateOneRequiredWithoutDelegationsNestedInput = {
    create?: XOR<NationCreateWithoutDelegationsInput, NationUncheckedCreateWithoutDelegationsInput>
    connectOrCreate?: NationCreateOrConnectWithoutDelegationsInput
    upsert?: NationUpsertWithoutDelegationsInput
    connect?: NationWhereUniqueInput
    update?: XOR<XOR<NationUpdateToOneWithWhereWithoutDelegationsInput, NationUpdateWithoutDelegationsInput>, NationUncheckedUpdateWithoutDelegationsInput>
  }

  export type CommitteeMemberUpdateManyWithoutDelegationNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput> | CommitteeMemberCreateWithoutDelegationInput[] | CommitteeMemberUncheckedCreateWithoutDelegationInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutDelegationInput | CommitteeMemberCreateOrConnectWithoutDelegationInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutDelegationInput | CommitteeMemberUpsertWithWhereUniqueWithoutDelegationInput[]
    createMany?: CommitteeMemberCreateManyDelegationInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutDelegationInput | CommitteeMemberUpdateWithWhereUniqueWithoutDelegationInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutDelegationInput | CommitteeMemberUpdateManyWithWhereWithoutDelegationInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutDelegationNestedInput = {
    create?: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput> | CommitteeMemberCreateWithoutDelegationInput[] | CommitteeMemberUncheckedCreateWithoutDelegationInput[]
    connectOrCreate?: CommitteeMemberCreateOrConnectWithoutDelegationInput | CommitteeMemberCreateOrConnectWithoutDelegationInput[]
    upsert?: CommitteeMemberUpsertWithWhereUniqueWithoutDelegationInput | CommitteeMemberUpsertWithWhereUniqueWithoutDelegationInput[]
    createMany?: CommitteeMemberCreateManyDelegationInputEnvelope
    set?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    disconnect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    delete?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    connect?: CommitteeMemberWhereUniqueInput | CommitteeMemberWhereUniqueInput[]
    update?: CommitteeMemberUpdateWithWhereUniqueWithoutDelegationInput | CommitteeMemberUpdateWithWhereUniqueWithoutDelegationInput[]
    updateMany?: CommitteeMemberUpdateManyWithWhereWithoutDelegationInput | CommitteeMemberUpdateManyWithWhereWithoutDelegationInput[]
    deleteMany?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
  }

  export type DelegationCreateNestedManyWithoutNationInput = {
    create?: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput> | DelegationCreateWithoutNationInput[] | DelegationUncheckedCreateWithoutNationInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutNationInput | DelegationCreateOrConnectWithoutNationInput[]
    createMany?: DelegationCreateManyNationInputEnvelope
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
  }

  export type DelegationUncheckedCreateNestedManyWithoutNationInput = {
    create?: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput> | DelegationCreateWithoutNationInput[] | DelegationUncheckedCreateWithoutNationInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutNationInput | DelegationCreateOrConnectWithoutNationInput[]
    createMany?: DelegationCreateManyNationInputEnvelope
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
  }

  export type EnumNationVariantFieldUpdateOperationsInput = {
    set?: $Enums.NationVariant
  }

  export type DelegationUpdateManyWithoutNationNestedInput = {
    create?: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput> | DelegationCreateWithoutNationInput[] | DelegationUncheckedCreateWithoutNationInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutNationInput | DelegationCreateOrConnectWithoutNationInput[]
    upsert?: DelegationUpsertWithWhereUniqueWithoutNationInput | DelegationUpsertWithWhereUniqueWithoutNationInput[]
    createMany?: DelegationCreateManyNationInputEnvelope
    set?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    disconnect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    delete?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    update?: DelegationUpdateWithWhereUniqueWithoutNationInput | DelegationUpdateWithWhereUniqueWithoutNationInput[]
    updateMany?: DelegationUpdateManyWithWhereWithoutNationInput | DelegationUpdateManyWithWhereWithoutNationInput[]
    deleteMany?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
  }

  export type DelegationUncheckedUpdateManyWithoutNationNestedInput = {
    create?: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput> | DelegationCreateWithoutNationInput[] | DelegationUncheckedCreateWithoutNationInput[]
    connectOrCreate?: DelegationCreateOrConnectWithoutNationInput | DelegationCreateOrConnectWithoutNationInput[]
    upsert?: DelegationUpsertWithWhereUniqueWithoutNationInput | DelegationUpsertWithWhereUniqueWithoutNationInput[]
    createMany?: DelegationCreateManyNationInputEnvelope
    set?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    disconnect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    delete?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    connect?: DelegationWhereUniqueInput | DelegationWhereUniqueInput[]
    update?: DelegationUpdateWithWhereUniqueWithoutNationInput | DelegationUpdateWithWhereUniqueWithoutNationInput[]
    updateMany?: DelegationUpdateManyWithWhereWithoutNationInput | DelegationUpdateManyWithWhereWithoutNationInput[]
    deleteMany?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
  }

  export type MessageCreatestatusInput = {
    set: $Enums.MessageStatus[]
  }

  export type CommitteeCreateNestedOneWithoutMessagesInput = {
    create?: XOR<CommitteeCreateWithoutMessagesInput, CommitteeUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutMessagesInput
    connect?: CommitteeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumMessageCategoryFieldUpdateOperationsInput = {
    set?: $Enums.MessageCategory
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MessageUpdatestatusInput = {
    set?: $Enums.MessageStatus[]
    push?: $Enums.MessageStatus | $Enums.MessageStatus[]
  }

  export type CommitteeUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<CommitteeCreateWithoutMessagesInput, CommitteeUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: CommitteeCreateOrConnectWithoutMessagesInput
    upsert?: CommitteeUpsertWithoutMessagesInput
    connect?: CommitteeWhereUniqueInput
    update?: XOR<XOR<CommitteeUpdateToOneWithWhereWithoutMessagesInput, CommitteeUpdateWithoutMessagesInput>, CommitteeUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    upsert?: UserUpsertWithoutMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesInput, UserUpdateWithoutMessagesInput>, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumConferenceRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ConferenceRole | EnumConferenceRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumConferenceRoleFilter<$PrismaModel> | $Enums.ConferenceRole
  }

  export type NestedEnumConferenceRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConferenceRole | EnumConferenceRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConferenceRole[] | ListEnumConferenceRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumConferenceRoleWithAggregatesFilter<$PrismaModel> | $Enums.ConferenceRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConferenceRoleFilter<$PrismaModel>
    _max?: NestedEnumConferenceRoleFilter<$PrismaModel>
  }

  export type NestedEnumCommitteeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeCategory | EnumCommitteeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeCategoryFilter<$PrismaModel> | $Enums.CommitteeCategory
  }

  export type NestedEnumCommitteeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeStatus | EnumCommitteeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeStatusFilter<$PrismaModel> | $Enums.CommitteeStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumCommitteeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeCategory | EnumCommitteeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeCategory[] | ListEnumCommitteeCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CommitteeCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommitteeCategoryFilter<$PrismaModel>
    _max?: NestedEnumCommitteeCategoryFilter<$PrismaModel>
  }

  export type NestedEnumCommitteeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommitteeStatus | EnumCommitteeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommitteeStatus[] | ListEnumCommitteeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommitteeStatusWithAggregatesFilter<$PrismaModel> | $Enums.CommitteeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommitteeStatusFilter<$PrismaModel>
    _max?: NestedEnumCommitteeStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPresenceFilter<$PrismaModel = never> = {
    equals?: $Enums.Presence | EnumPresenceFieldRefInput<$PrismaModel>
    in?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    not?: NestedEnumPresenceFilter<$PrismaModel> | $Enums.Presence
  }

  export type NestedEnumPresenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Presence | EnumPresenceFieldRefInput<$PrismaModel>
    in?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Presence[] | ListEnumPresenceFieldRefInput<$PrismaModel>
    not?: NestedEnumPresenceWithAggregatesFilter<$PrismaModel> | $Enums.Presence
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPresenceFilter<$PrismaModel>
    _max?: NestedEnumPresenceFilter<$PrismaModel>
  }

  export type NestedEnumSpeakersListCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SpeakersListCategory | EnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSpeakersListCategoryFilter<$PrismaModel> | $Enums.SpeakersListCategory
  }

  export type NestedEnumSpeakersListCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpeakersListCategory | EnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpeakersListCategory[] | ListEnumSpeakersListCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSpeakersListCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SpeakersListCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpeakersListCategoryFilter<$PrismaModel>
    _max?: NestedEnumSpeakersListCategoryFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNationVariantFilter<$PrismaModel = never> = {
    equals?: $Enums.NationVariant | EnumNationVariantFieldRefInput<$PrismaModel>
    in?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    notIn?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    not?: NestedEnumNationVariantFilter<$PrismaModel> | $Enums.NationVariant
  }

  export type NestedEnumNationVariantWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NationVariant | EnumNationVariantFieldRefInput<$PrismaModel>
    in?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    notIn?: $Enums.NationVariant[] | ListEnumNationVariantFieldRefInput<$PrismaModel>
    not?: NestedEnumNationVariantWithAggregatesFilter<$PrismaModel> | $Enums.NationVariant
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNationVariantFilter<$PrismaModel>
    _max?: NestedEnumNationVariantFilter<$PrismaModel>
  }

  export type NestedEnumMessageCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageCategory | EnumMessageCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageCategoryFilter<$PrismaModel> | $Enums.MessageCategory
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumMessageCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageCategory | EnumMessageCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageCategory[] | ListEnumMessageCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageCategoryWithAggregatesFilter<$PrismaModel> | $Enums.MessageCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageCategoryFilter<$PrismaModel>
    _max?: NestedEnumMessageCategoryFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ConferenceMemberCreateWithoutUserInput = {
    id?: string
    role: $Enums.ConferenceRole
    conference: ConferenceCreateNestedOneWithoutMembersInput
  }

  export type ConferenceMemberUncheckedCreateWithoutUserInput = {
    id?: string
    conferenceId: string
    role: $Enums.ConferenceRole
  }

  export type ConferenceMemberCreateOrConnectWithoutUserInput = {
    where: ConferenceMemberWhereUniqueInput
    create: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput>
  }

  export type ConferenceMemberCreateManyUserInputEnvelope = {
    data: ConferenceMemberCreateManyUserInput | ConferenceMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommitteeMemberCreateWithoutUserInput = {
    id?: string
    presence?: $Enums.Presence
    committee: CommitteeCreateNestedOneWithoutMembersInput
    speakerLists?: SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput
    delegation?: DelegationCreateNestedOneWithoutMembersInput
  }

  export type CommitteeMemberUncheckedCreateWithoutUserInput = {
    id?: string
    committeeId: string
    delegationId?: string | null
    presence?: $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedCreateNestedManyWithoutCommitteeMemberInput
  }

  export type CommitteeMemberCreateOrConnectWithoutUserInput = {
    where: CommitteeMemberWhereUniqueInput
    create: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput>
  }

  export type CommitteeMemberCreateManyUserInputEnvelope = {
    data: CommitteeMemberCreateManyUserInput | CommitteeMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutAuthorInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
    committee: CommitteeCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutAuthorInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    committeeId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type MessageCreateOrConnectWithoutAuthorInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput>
  }

  export type MessageCreateManyAuthorInputEnvelope = {
    data: MessageCreateManyAuthorInput | MessageCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type ConferenceMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: ConferenceMemberWhereUniqueInput
    update: XOR<ConferenceMemberUpdateWithoutUserInput, ConferenceMemberUncheckedUpdateWithoutUserInput>
    create: XOR<ConferenceMemberCreateWithoutUserInput, ConferenceMemberUncheckedCreateWithoutUserInput>
  }

  export type ConferenceMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: ConferenceMemberWhereUniqueInput
    data: XOR<ConferenceMemberUpdateWithoutUserInput, ConferenceMemberUncheckedUpdateWithoutUserInput>
  }

  export type ConferenceMemberUpdateManyWithWhereWithoutUserInput = {
    where: ConferenceMemberScalarWhereInput
    data: XOR<ConferenceMemberUpdateManyMutationInput, ConferenceMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type ConferenceMemberScalarWhereInput = {
    AND?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
    OR?: ConferenceMemberScalarWhereInput[]
    NOT?: ConferenceMemberScalarWhereInput | ConferenceMemberScalarWhereInput[]
    id?: StringFilter<"ConferenceMember"> | string
    conferenceId?: StringFilter<"ConferenceMember"> | string
    userId?: StringNullableFilter<"ConferenceMember"> | string | null
    role?: EnumConferenceRoleFilter<"ConferenceMember"> | $Enums.ConferenceRole
  }

  export type CommitteeMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: CommitteeMemberWhereUniqueInput
    update: XOR<CommitteeMemberUpdateWithoutUserInput, CommitteeMemberUncheckedUpdateWithoutUserInput>
    create: XOR<CommitteeMemberCreateWithoutUserInput, CommitteeMemberUncheckedCreateWithoutUserInput>
  }

  export type CommitteeMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: CommitteeMemberWhereUniqueInput
    data: XOR<CommitteeMemberUpdateWithoutUserInput, CommitteeMemberUncheckedUpdateWithoutUserInput>
  }

  export type CommitteeMemberUpdateManyWithWhereWithoutUserInput = {
    where: CommitteeMemberScalarWhereInput
    data: XOR<CommitteeMemberUpdateManyMutationInput, CommitteeMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type CommitteeMemberScalarWhereInput = {
    AND?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
    OR?: CommitteeMemberScalarWhereInput[]
    NOT?: CommitteeMemberScalarWhereInput | CommitteeMemberScalarWhereInput[]
    id?: StringFilter<"CommitteeMember"> | string
    committeeId?: StringFilter<"CommitteeMember"> | string
    userId?: StringNullableFilter<"CommitteeMember"> | string | null
    delegationId?: StringNullableFilter<"CommitteeMember"> | string | null
    presence?: EnumPresenceFilter<"CommitteeMember"> | $Enums.Presence
  }

  export type MessageUpsertWithWhereUniqueWithoutAuthorInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutAuthorInput, MessageUncheckedUpdateWithoutAuthorInput>
    create: XOR<MessageCreateWithoutAuthorInput, MessageUncheckedCreateWithoutAuthorInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutAuthorInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutAuthorInput, MessageUncheckedUpdateWithoutAuthorInput>
  }

  export type MessageUpdateManyWithWhereWithoutAuthorInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutAuthorInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    subject?: StringFilter<"Message"> | string
    category?: EnumMessageCategoryFilter<"Message"> | $Enums.MessageCategory
    message?: StringFilter<"Message"> | string
    committeeId?: StringFilter<"Message"> | string
    authorId?: StringFilter<"Message"> | string
    timestamp?: DateTimeFilter<"Message"> | Date | string
    status?: EnumMessageStatusNullableListFilter<"Message">
    forwarded?: BoolFilter<"Message"> | boolean
    metaEmail?: StringNullableFilter<"Message"> | string | null
    metaDelegation?: StringNullableFilter<"Message"> | string | null
    metaCommittee?: StringNullableFilter<"Message"> | string | null
    metaAgendaItem?: StringNullableFilter<"Message"> | string | null
  }

  export type DelegationCreateWithoutConferenceInput = {
    id?: string
    nation: NationCreateNestedOneWithoutDelegationsInput
    members?: CommitteeMemberCreateNestedManyWithoutDelegationInput
  }

  export type DelegationUncheckedCreateWithoutConferenceInput = {
    id?: string
    nationId: string
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutDelegationInput
  }

  export type DelegationCreateOrConnectWithoutConferenceInput = {
    where: DelegationWhereUniqueInput
    create: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput>
  }

  export type DelegationCreateManyConferenceInputEnvelope = {
    data: DelegationCreateManyConferenceInput | DelegationCreateManyConferenceInput[]
    skipDuplicates?: boolean
  }

  export type ConferenceMemberCreateWithoutConferenceInput = {
    id?: string
    role: $Enums.ConferenceRole
    user?: UserCreateNestedOneWithoutConferenceMembershipsInput
  }

  export type ConferenceMemberUncheckedCreateWithoutConferenceInput = {
    id?: string
    userId?: string | null
    role: $Enums.ConferenceRole
  }

  export type ConferenceMemberCreateOrConnectWithoutConferenceInput = {
    where: ConferenceMemberWhereUniqueInput
    create: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput>
  }

  export type ConferenceMemberCreateManyConferenceInputEnvelope = {
    data: ConferenceMemberCreateManyConferenceInput | ConferenceMemberCreateManyConferenceInput[]
    skipDuplicates?: boolean
  }

  export type CommitteeCreateWithoutConferenceInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutConferenceInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutConferenceInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput>
  }

  export type CommitteeCreateManyConferenceInputEnvelope = {
    data: CommitteeCreateManyConferenceInput | CommitteeCreateManyConferenceInput[]
    skipDuplicates?: boolean
  }

  export type DelegationUpsertWithWhereUniqueWithoutConferenceInput = {
    where: DelegationWhereUniqueInput
    update: XOR<DelegationUpdateWithoutConferenceInput, DelegationUncheckedUpdateWithoutConferenceInput>
    create: XOR<DelegationCreateWithoutConferenceInput, DelegationUncheckedCreateWithoutConferenceInput>
  }

  export type DelegationUpdateWithWhereUniqueWithoutConferenceInput = {
    where: DelegationWhereUniqueInput
    data: XOR<DelegationUpdateWithoutConferenceInput, DelegationUncheckedUpdateWithoutConferenceInput>
  }

  export type DelegationUpdateManyWithWhereWithoutConferenceInput = {
    where: DelegationScalarWhereInput
    data: XOR<DelegationUpdateManyMutationInput, DelegationUncheckedUpdateManyWithoutConferenceInput>
  }

  export type DelegationScalarWhereInput = {
    AND?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
    OR?: DelegationScalarWhereInput[]
    NOT?: DelegationScalarWhereInput | DelegationScalarWhereInput[]
    id?: StringFilter<"Delegation"> | string
    conferenceId?: StringFilter<"Delegation"> | string
    nationId?: StringFilter<"Delegation"> | string
  }

  export type ConferenceMemberUpsertWithWhereUniqueWithoutConferenceInput = {
    where: ConferenceMemberWhereUniqueInput
    update: XOR<ConferenceMemberUpdateWithoutConferenceInput, ConferenceMemberUncheckedUpdateWithoutConferenceInput>
    create: XOR<ConferenceMemberCreateWithoutConferenceInput, ConferenceMemberUncheckedCreateWithoutConferenceInput>
  }

  export type ConferenceMemberUpdateWithWhereUniqueWithoutConferenceInput = {
    where: ConferenceMemberWhereUniqueInput
    data: XOR<ConferenceMemberUpdateWithoutConferenceInput, ConferenceMemberUncheckedUpdateWithoutConferenceInput>
  }

  export type ConferenceMemberUpdateManyWithWhereWithoutConferenceInput = {
    where: ConferenceMemberScalarWhereInput
    data: XOR<ConferenceMemberUpdateManyMutationInput, ConferenceMemberUncheckedUpdateManyWithoutConferenceInput>
  }

  export type CommitteeUpsertWithWhereUniqueWithoutConferenceInput = {
    where: CommitteeWhereUniqueInput
    update: XOR<CommitteeUpdateWithoutConferenceInput, CommitteeUncheckedUpdateWithoutConferenceInput>
    create: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput>
  }

  export type CommitteeUpdateWithWhereUniqueWithoutConferenceInput = {
    where: CommitteeWhereUniqueInput
    data: XOR<CommitteeUpdateWithoutConferenceInput, CommitteeUncheckedUpdateWithoutConferenceInput>
  }

  export type CommitteeUpdateManyWithWhereWithoutConferenceInput = {
    where: CommitteeScalarWhereInput
    data: XOR<CommitteeUpdateManyMutationInput, CommitteeUncheckedUpdateManyWithoutConferenceInput>
  }

  export type CommitteeScalarWhereInput = {
    AND?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
    OR?: CommitteeScalarWhereInput[]
    NOT?: CommitteeScalarWhereInput | CommitteeScalarWhereInput[]
    id?: StringFilter<"Committee"> | string
    name?: StringFilter<"Committee"> | string
    abbreviation?: StringFilter<"Committee"> | string
    category?: EnumCommitteeCategoryFilter<"Committee"> | $Enums.CommitteeCategory
    conferenceId?: StringFilter<"Committee"> | string
    parentId?: StringNullableFilter<"Committee"> | string | null
    whiteboardContent?: StringFilter<"Committee"> | string
    status?: EnumCommitteeStatusFilter<"Committee"> | $Enums.CommitteeStatus
    stateOfDebate?: StringNullableFilter<"Committee"> | string | null
    statusHeadline?: StringNullableFilter<"Committee"> | string | null
    statusUntil?: DateTimeNullableFilter<"Committee"> | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFilter<"Committee"> | boolean
  }

  export type ConferenceCreateWithoutMembersInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationCreateNestedManyWithoutConferenceInput
    committees?: CommitteeCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationUncheckedCreateNestedManyWithoutConferenceInput
    committees?: CommitteeUncheckedCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceCreateOrConnectWithoutMembersInput = {
    where: ConferenceWhereUniqueInput
    create: XOR<ConferenceCreateWithoutMembersInput, ConferenceUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutConferenceMembershipsInput = {
    id?: string
    committeeMemberships?: CommitteeMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutConferenceMembershipsInput = {
    id?: string
    committeeMemberships?: CommitteeMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutConferenceMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutConferenceMembershipsInput, UserUncheckedCreateWithoutConferenceMembershipsInput>
  }

  export type ConferenceUpsertWithoutMembersInput = {
    update: XOR<ConferenceUpdateWithoutMembersInput, ConferenceUncheckedUpdateWithoutMembersInput>
    create: XOR<ConferenceCreateWithoutMembersInput, ConferenceUncheckedCreateWithoutMembersInput>
    where?: ConferenceWhereInput
  }

  export type ConferenceUpdateToOneWithWhereWithoutMembersInput = {
    where?: ConferenceWhereInput
    data: XOR<ConferenceUpdateWithoutMembersInput, ConferenceUncheckedUpdateWithoutMembersInput>
  }

  export type ConferenceUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUncheckedUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUncheckedUpdateManyWithoutConferenceNestedInput
  }

  export type UserUpsertWithoutConferenceMembershipsInput = {
    update: XOR<UserUpdateWithoutConferenceMembershipsInput, UserUncheckedUpdateWithoutConferenceMembershipsInput>
    create: XOR<UserCreateWithoutConferenceMembershipsInput, UserUncheckedCreateWithoutConferenceMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutConferenceMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutConferenceMembershipsInput, UserUncheckedUpdateWithoutConferenceMembershipsInput>
  }

  export type UserUpdateWithoutConferenceMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeMemberships?: CommitteeMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutConferenceMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeMemberships?: CommitteeMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ConferenceCreateWithoutCommitteesInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationCreateNestedManyWithoutConferenceInput
    members?: ConferenceMemberCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUncheckedCreateWithoutCommitteesInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    delegations?: DelegationUncheckedCreateNestedManyWithoutConferenceInput
    members?: ConferenceMemberUncheckedCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceCreateOrConnectWithoutCommitteesInput = {
    where: ConferenceWhereUniqueInput
    create: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
  }

  export type CommitteeMemberCreateWithoutCommitteeInput = {
    id?: string
    presence?: $Enums.Presence
    user?: UserCreateNestedOneWithoutCommitteeMembershipsInput
    speakerLists?: SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput
    delegation?: DelegationCreateNestedOneWithoutMembersInput
  }

  export type CommitteeMemberUncheckedCreateWithoutCommitteeInput = {
    id?: string
    userId?: string | null
    delegationId?: string | null
    presence?: $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedCreateNestedManyWithoutCommitteeMemberInput
  }

  export type CommitteeMemberCreateOrConnectWithoutCommitteeInput = {
    where: CommitteeMemberWhereUniqueInput
    create: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput>
  }

  export type CommitteeMemberCreateManyCommitteeInputEnvelope = {
    data: CommitteeMemberCreateManyCommitteeInput | CommitteeMemberCreateManyCommitteeInput[]
    skipDuplicates?: boolean
  }

  export type CommitteeCreateWithoutSubCommitteesInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutSubCommitteesInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutSubCommitteesInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutSubCommitteesInput, CommitteeUncheckedCreateWithoutSubCommitteesInput>
  }

  export type CommitteeCreateWithoutParentInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutParentInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput>
  }

  export type CommitteeCreateManyParentInputEnvelope = {
    data: CommitteeCreateManyParentInput | CommitteeCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutCommitteeInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
    author: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutCommitteeInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    authorId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type MessageCreateOrConnectWithoutCommitteeInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput>
  }

  export type MessageCreateManyCommitteeInputEnvelope = {
    data: MessageCreateManyCommitteeInput | MessageCreateManyCommitteeInput[]
    skipDuplicates?: boolean
  }

  export type AgendaItemCreateWithoutCommitteeInput = {
    id?: string
    title: string
    description?: string | null
    isActive?: boolean
    speakerLists?: SpeakersListCreateNestedManyWithoutAgendaItemInput
  }

  export type AgendaItemUncheckedCreateWithoutCommitteeInput = {
    id?: string
    title: string
    description?: string | null
    isActive?: boolean
    speakerLists?: SpeakersListUncheckedCreateNestedManyWithoutAgendaItemInput
  }

  export type AgendaItemCreateOrConnectWithoutCommitteeInput = {
    where: AgendaItemWhereUniqueInput
    create: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput>
  }

  export type AgendaItemCreateManyCommitteeInputEnvelope = {
    data: AgendaItemCreateManyCommitteeInput | AgendaItemCreateManyCommitteeInput[]
    skipDuplicates?: boolean
  }

  export type ConferenceUpsertWithoutCommitteesInput = {
    update: XOR<ConferenceUpdateWithoutCommitteesInput, ConferenceUncheckedUpdateWithoutCommitteesInput>
    create: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
    where?: ConferenceWhereInput
  }

  export type ConferenceUpdateToOneWithWhereWithoutCommitteesInput = {
    where?: ConferenceWhereInput
    data: XOR<ConferenceUpdateWithoutCommitteesInput, ConferenceUncheckedUpdateWithoutCommitteesInput>
  }

  export type ConferenceUpdateWithoutCommitteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUpdateManyWithoutConferenceNestedInput
    members?: ConferenceMemberUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceUncheckedUpdateWithoutCommitteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    delegations?: DelegationUncheckedUpdateManyWithoutConferenceNestedInput
    members?: ConferenceMemberUncheckedUpdateManyWithoutConferenceNestedInput
  }

  export type CommitteeMemberUpsertWithWhereUniqueWithoutCommitteeInput = {
    where: CommitteeMemberWhereUniqueInput
    update: XOR<CommitteeMemberUpdateWithoutCommitteeInput, CommitteeMemberUncheckedUpdateWithoutCommitteeInput>
    create: XOR<CommitteeMemberCreateWithoutCommitteeInput, CommitteeMemberUncheckedCreateWithoutCommitteeInput>
  }

  export type CommitteeMemberUpdateWithWhereUniqueWithoutCommitteeInput = {
    where: CommitteeMemberWhereUniqueInput
    data: XOR<CommitteeMemberUpdateWithoutCommitteeInput, CommitteeMemberUncheckedUpdateWithoutCommitteeInput>
  }

  export type CommitteeMemberUpdateManyWithWhereWithoutCommitteeInput = {
    where: CommitteeMemberScalarWhereInput
    data: XOR<CommitteeMemberUpdateManyMutationInput, CommitteeMemberUncheckedUpdateManyWithoutCommitteeInput>
  }

  export type CommitteeUpsertWithoutSubCommitteesInput = {
    update: XOR<CommitteeUpdateWithoutSubCommitteesInput, CommitteeUncheckedUpdateWithoutSubCommitteesInput>
    create: XOR<CommitteeCreateWithoutSubCommitteesInput, CommitteeUncheckedCreateWithoutSubCommitteesInput>
    where?: CommitteeWhereInput
  }

  export type CommitteeUpdateToOneWithWhereWithoutSubCommitteesInput = {
    where?: CommitteeWhereInput
    data: XOR<CommitteeUpdateWithoutSubCommitteesInput, CommitteeUncheckedUpdateWithoutSubCommitteesInput>
  }

  export type CommitteeUpdateWithoutSubCommitteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutSubCommitteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUpsertWithWhereUniqueWithoutParentInput = {
    where: CommitteeWhereUniqueInput
    update: XOR<CommitteeUpdateWithoutParentInput, CommitteeUncheckedUpdateWithoutParentInput>
    create: XOR<CommitteeCreateWithoutParentInput, CommitteeUncheckedCreateWithoutParentInput>
  }

  export type CommitteeUpdateWithWhereUniqueWithoutParentInput = {
    where: CommitteeWhereUniqueInput
    data: XOR<CommitteeUpdateWithoutParentInput, CommitteeUncheckedUpdateWithoutParentInput>
  }

  export type CommitteeUpdateManyWithWhereWithoutParentInput = {
    where: CommitteeScalarWhereInput
    data: XOR<CommitteeUpdateManyMutationInput, CommitteeUncheckedUpdateManyWithoutParentInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutCommitteeInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutCommitteeInput, MessageUncheckedUpdateWithoutCommitteeInput>
    create: XOR<MessageCreateWithoutCommitteeInput, MessageUncheckedCreateWithoutCommitteeInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutCommitteeInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutCommitteeInput, MessageUncheckedUpdateWithoutCommitteeInput>
  }

  export type MessageUpdateManyWithWhereWithoutCommitteeInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutCommitteeInput>
  }

  export type AgendaItemUpsertWithWhereUniqueWithoutCommitteeInput = {
    where: AgendaItemWhereUniqueInput
    update: XOR<AgendaItemUpdateWithoutCommitteeInput, AgendaItemUncheckedUpdateWithoutCommitteeInput>
    create: XOR<AgendaItemCreateWithoutCommitteeInput, AgendaItemUncheckedCreateWithoutCommitteeInput>
  }

  export type AgendaItemUpdateWithWhereUniqueWithoutCommitteeInput = {
    where: AgendaItemWhereUniqueInput
    data: XOR<AgendaItemUpdateWithoutCommitteeInput, AgendaItemUncheckedUpdateWithoutCommitteeInput>
  }

  export type AgendaItemUpdateManyWithWhereWithoutCommitteeInput = {
    where: AgendaItemScalarWhereInput
    data: XOR<AgendaItemUpdateManyMutationInput, AgendaItemUncheckedUpdateManyWithoutCommitteeInput>
  }

  export type AgendaItemScalarWhereInput = {
    AND?: AgendaItemScalarWhereInput | AgendaItemScalarWhereInput[]
    OR?: AgendaItemScalarWhereInput[]
    NOT?: AgendaItemScalarWhereInput | AgendaItemScalarWhereInput[]
    id?: StringFilter<"AgendaItem"> | string
    committeeId?: StringFilter<"AgendaItem"> | string
    title?: StringFilter<"AgendaItem"> | string
    description?: StringNullableFilter<"AgendaItem"> | string | null
    isActive?: BoolFilter<"AgendaItem"> | boolean
  }

  export type CommitteeCreateWithoutMembersInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutMembersInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutMembersInput, CommitteeUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutCommitteeMembershipsInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutCommitteeMembershipsInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutCommitteeMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommitteeMembershipsInput, UserUncheckedCreateWithoutCommitteeMembershipsInput>
  }

  export type SpeakerOnListCreateWithoutCommitteeMemberInput = {
    id?: string
    position: number
    speakersList: SpeakersListCreateNestedOneWithoutSpeakersInput
  }

  export type SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput = {
    id?: string
    speakersListId: string
    position: number
  }

  export type SpeakerOnListCreateOrConnectWithoutCommitteeMemberInput = {
    where: SpeakerOnListWhereUniqueInput
    create: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput>
  }

  export type SpeakerOnListCreateManyCommitteeMemberInputEnvelope = {
    data: SpeakerOnListCreateManyCommitteeMemberInput | SpeakerOnListCreateManyCommitteeMemberInput[]
    skipDuplicates?: boolean
  }

  export type DelegationCreateWithoutMembersInput = {
    id?: string
    conference: ConferenceCreateNestedOneWithoutDelegationsInput
    nation: NationCreateNestedOneWithoutDelegationsInput
  }

  export type DelegationUncheckedCreateWithoutMembersInput = {
    id?: string
    conferenceId: string
    nationId: string
  }

  export type DelegationCreateOrConnectWithoutMembersInput = {
    where: DelegationWhereUniqueInput
    create: XOR<DelegationCreateWithoutMembersInput, DelegationUncheckedCreateWithoutMembersInput>
  }

  export type CommitteeUpsertWithoutMembersInput = {
    update: XOR<CommitteeUpdateWithoutMembersInput, CommitteeUncheckedUpdateWithoutMembersInput>
    create: XOR<CommitteeCreateWithoutMembersInput, CommitteeUncheckedCreateWithoutMembersInput>
    where?: CommitteeWhereInput
  }

  export type CommitteeUpdateToOneWithWhereWithoutMembersInput = {
    where?: CommitteeWhereInput
    data: XOR<CommitteeUpdateWithoutMembersInput, CommitteeUncheckedUpdateWithoutMembersInput>
  }

  export type CommitteeUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type UserUpsertWithoutCommitteeMembershipsInput = {
    update: XOR<UserUpdateWithoutCommitteeMembershipsInput, UserUncheckedUpdateWithoutCommitteeMembershipsInput>
    create: XOR<UserCreateWithoutCommitteeMembershipsInput, UserUncheckedCreateWithoutCommitteeMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommitteeMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommitteeMembershipsInput, UserUncheckedUpdateWithoutCommitteeMembershipsInput>
  }

  export type UserUpdateWithoutCommitteeMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutCommitteeMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type SpeakerOnListUpsertWithWhereUniqueWithoutCommitteeMemberInput = {
    where: SpeakerOnListWhereUniqueInput
    update: XOR<SpeakerOnListUpdateWithoutCommitteeMemberInput, SpeakerOnListUncheckedUpdateWithoutCommitteeMemberInput>
    create: XOR<SpeakerOnListCreateWithoutCommitteeMemberInput, SpeakerOnListUncheckedCreateWithoutCommitteeMemberInput>
  }

  export type SpeakerOnListUpdateWithWhereUniqueWithoutCommitteeMemberInput = {
    where: SpeakerOnListWhereUniqueInput
    data: XOR<SpeakerOnListUpdateWithoutCommitteeMemberInput, SpeakerOnListUncheckedUpdateWithoutCommitteeMemberInput>
  }

  export type SpeakerOnListUpdateManyWithWhereWithoutCommitteeMemberInput = {
    where: SpeakerOnListScalarWhereInput
    data: XOR<SpeakerOnListUpdateManyMutationInput, SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberInput>
  }

  export type SpeakerOnListScalarWhereInput = {
    AND?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
    OR?: SpeakerOnListScalarWhereInput[]
    NOT?: SpeakerOnListScalarWhereInput | SpeakerOnListScalarWhereInput[]
    id?: StringFilter<"SpeakerOnList"> | string
    speakersListId?: StringFilter<"SpeakerOnList"> | string
    committeeMemberId?: StringFilter<"SpeakerOnList"> | string
    position?: IntFilter<"SpeakerOnList"> | number
  }

  export type DelegationUpsertWithoutMembersInput = {
    update: XOR<DelegationUpdateWithoutMembersInput, DelegationUncheckedUpdateWithoutMembersInput>
    create: XOR<DelegationCreateWithoutMembersInput, DelegationUncheckedCreateWithoutMembersInput>
    where?: DelegationWhereInput
  }

  export type DelegationUpdateToOneWithWhereWithoutMembersInput = {
    where?: DelegationWhereInput
    data: XOR<DelegationUpdateWithoutMembersInput, DelegationUncheckedUpdateWithoutMembersInput>
  }

  export type DelegationUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    conference?: ConferenceUpdateOneRequiredWithoutDelegationsNestedInput
    nation?: NationUpdateOneRequiredWithoutDelegationsNestedInput
  }

  export type DelegationUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    nationId?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeCreateWithoutAgendaItemsInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    messages?: MessageCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutAgendaItemsInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    messages?: MessageUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutAgendaItemsInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutAgendaItemsInput, CommitteeUncheckedCreateWithoutAgendaItemsInput>
  }

  export type SpeakersListCreateWithoutAgendaItemInput = {
    id?: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
    speakers?: SpeakerOnListCreateNestedManyWithoutSpeakersListInput
  }

  export type SpeakersListUncheckedCreateWithoutAgendaItemInput = {
    id?: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
    speakers?: SpeakerOnListUncheckedCreateNestedManyWithoutSpeakersListInput
  }

  export type SpeakersListCreateOrConnectWithoutAgendaItemInput = {
    where: SpeakersListWhereUniqueInput
    create: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput>
  }

  export type SpeakersListCreateManyAgendaItemInputEnvelope = {
    data: SpeakersListCreateManyAgendaItemInput | SpeakersListCreateManyAgendaItemInput[]
    skipDuplicates?: boolean
  }

  export type CommitteeUpsertWithoutAgendaItemsInput = {
    update: XOR<CommitteeUpdateWithoutAgendaItemsInput, CommitteeUncheckedUpdateWithoutAgendaItemsInput>
    create: XOR<CommitteeCreateWithoutAgendaItemsInput, CommitteeUncheckedCreateWithoutAgendaItemsInput>
    where?: CommitteeWhereInput
  }

  export type CommitteeUpdateToOneWithWhereWithoutAgendaItemsInput = {
    where?: CommitteeWhereInput
    data: XOR<CommitteeUpdateWithoutAgendaItemsInput, CommitteeUncheckedUpdateWithoutAgendaItemsInput>
  }

  export type CommitteeUpdateWithoutAgendaItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutAgendaItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type SpeakersListUpsertWithWhereUniqueWithoutAgendaItemInput = {
    where: SpeakersListWhereUniqueInput
    update: XOR<SpeakersListUpdateWithoutAgendaItemInput, SpeakersListUncheckedUpdateWithoutAgendaItemInput>
    create: XOR<SpeakersListCreateWithoutAgendaItemInput, SpeakersListUncheckedCreateWithoutAgendaItemInput>
  }

  export type SpeakersListUpdateWithWhereUniqueWithoutAgendaItemInput = {
    where: SpeakersListWhereUniqueInput
    data: XOR<SpeakersListUpdateWithoutAgendaItemInput, SpeakersListUncheckedUpdateWithoutAgendaItemInput>
  }

  export type SpeakersListUpdateManyWithWhereWithoutAgendaItemInput = {
    where: SpeakersListScalarWhereInput
    data: XOR<SpeakersListUpdateManyMutationInput, SpeakersListUncheckedUpdateManyWithoutAgendaItemInput>
  }

  export type SpeakersListScalarWhereInput = {
    AND?: SpeakersListScalarWhereInput | SpeakersListScalarWhereInput[]
    OR?: SpeakersListScalarWhereInput[]
    NOT?: SpeakersListScalarWhereInput | SpeakersListScalarWhereInput[]
    id?: StringFilter<"SpeakersList"> | string
    agendaItemId?: StringFilter<"SpeakersList"> | string
    type?: EnumSpeakersListCategoryFilter<"SpeakersList"> | $Enums.SpeakersListCategory
    speakingTime?: IntFilter<"SpeakersList"> | number
    timeLeft?: IntNullableFilter<"SpeakersList"> | number | null
    startTimestamp?: DateTimeNullableFilter<"SpeakersList"> | Date | string | null
    isClosed?: BoolFilter<"SpeakersList"> | boolean
  }

  export type AgendaItemCreateWithoutSpeakerListsInput = {
    id?: string
    title: string
    description?: string | null
    isActive?: boolean
    committee: CommitteeCreateNestedOneWithoutAgendaItemsInput
  }

  export type AgendaItemUncheckedCreateWithoutSpeakerListsInput = {
    id?: string
    committeeId: string
    title: string
    description?: string | null
    isActive?: boolean
  }

  export type AgendaItemCreateOrConnectWithoutSpeakerListsInput = {
    where: AgendaItemWhereUniqueInput
    create: XOR<AgendaItemCreateWithoutSpeakerListsInput, AgendaItemUncheckedCreateWithoutSpeakerListsInput>
  }

  export type SpeakerOnListCreateWithoutSpeakersListInput = {
    id?: string
    position: number
    committeeMember: CommitteeMemberCreateNestedOneWithoutSpeakerListsInput
  }

  export type SpeakerOnListUncheckedCreateWithoutSpeakersListInput = {
    id?: string
    committeeMemberId: string
    position: number
  }

  export type SpeakerOnListCreateOrConnectWithoutSpeakersListInput = {
    where: SpeakerOnListWhereUniqueInput
    create: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput>
  }

  export type SpeakerOnListCreateManySpeakersListInputEnvelope = {
    data: SpeakerOnListCreateManySpeakersListInput | SpeakerOnListCreateManySpeakersListInput[]
    skipDuplicates?: boolean
  }

  export type AgendaItemUpsertWithoutSpeakerListsInput = {
    update: XOR<AgendaItemUpdateWithoutSpeakerListsInput, AgendaItemUncheckedUpdateWithoutSpeakerListsInput>
    create: XOR<AgendaItemCreateWithoutSpeakerListsInput, AgendaItemUncheckedCreateWithoutSpeakerListsInput>
    where?: AgendaItemWhereInput
  }

  export type AgendaItemUpdateToOneWithWhereWithoutSpeakerListsInput = {
    where?: AgendaItemWhereInput
    data: XOR<AgendaItemUpdateWithoutSpeakerListsInput, AgendaItemUncheckedUpdateWithoutSpeakerListsInput>
  }

  export type AgendaItemUpdateWithoutSpeakerListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    committee?: CommitteeUpdateOneRequiredWithoutAgendaItemsNestedInput
  }

  export type AgendaItemUncheckedUpdateWithoutSpeakerListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakerOnListUpsertWithWhereUniqueWithoutSpeakersListInput = {
    where: SpeakerOnListWhereUniqueInput
    update: XOR<SpeakerOnListUpdateWithoutSpeakersListInput, SpeakerOnListUncheckedUpdateWithoutSpeakersListInput>
    create: XOR<SpeakerOnListCreateWithoutSpeakersListInput, SpeakerOnListUncheckedCreateWithoutSpeakersListInput>
  }

  export type SpeakerOnListUpdateWithWhereUniqueWithoutSpeakersListInput = {
    where: SpeakerOnListWhereUniqueInput
    data: XOR<SpeakerOnListUpdateWithoutSpeakersListInput, SpeakerOnListUncheckedUpdateWithoutSpeakersListInput>
  }

  export type SpeakerOnListUpdateManyWithWhereWithoutSpeakersListInput = {
    where: SpeakerOnListScalarWhereInput
    data: XOR<SpeakerOnListUpdateManyMutationInput, SpeakerOnListUncheckedUpdateManyWithoutSpeakersListInput>
  }

  export type SpeakersListCreateWithoutSpeakersInput = {
    id?: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
    agendaItem: AgendaItemCreateNestedOneWithoutSpeakerListsInput
  }

  export type SpeakersListUncheckedCreateWithoutSpeakersInput = {
    id?: string
    agendaItemId: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
  }

  export type SpeakersListCreateOrConnectWithoutSpeakersInput = {
    where: SpeakersListWhereUniqueInput
    create: XOR<SpeakersListCreateWithoutSpeakersInput, SpeakersListUncheckedCreateWithoutSpeakersInput>
  }

  export type CommitteeMemberCreateWithoutSpeakerListsInput = {
    id?: string
    presence?: $Enums.Presence
    committee: CommitteeCreateNestedOneWithoutMembersInput
    user?: UserCreateNestedOneWithoutCommitteeMembershipsInput
    delegation?: DelegationCreateNestedOneWithoutMembersInput
  }

  export type CommitteeMemberUncheckedCreateWithoutSpeakerListsInput = {
    id?: string
    committeeId: string
    userId?: string | null
    delegationId?: string | null
    presence?: $Enums.Presence
  }

  export type CommitteeMemberCreateOrConnectWithoutSpeakerListsInput = {
    where: CommitteeMemberWhereUniqueInput
    create: XOR<CommitteeMemberCreateWithoutSpeakerListsInput, CommitteeMemberUncheckedCreateWithoutSpeakerListsInput>
  }

  export type SpeakersListUpsertWithoutSpeakersInput = {
    update: XOR<SpeakersListUpdateWithoutSpeakersInput, SpeakersListUncheckedUpdateWithoutSpeakersInput>
    create: XOR<SpeakersListCreateWithoutSpeakersInput, SpeakersListUncheckedCreateWithoutSpeakersInput>
    where?: SpeakersListWhereInput
  }

  export type SpeakersListUpdateToOneWithWhereWithoutSpeakersInput = {
    where?: SpeakersListWhereInput
    data: XOR<SpeakersListUpdateWithoutSpeakersInput, SpeakersListUncheckedUpdateWithoutSpeakersInput>
  }

  export type SpeakersListUpdateWithoutSpeakersInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    agendaItem?: AgendaItemUpdateOneRequiredWithoutSpeakerListsNestedInput
  }

  export type SpeakersListUncheckedUpdateWithoutSpeakersInput = {
    id?: StringFieldUpdateOperationsInput | string
    agendaItemId?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CommitteeMemberUpsertWithoutSpeakerListsInput = {
    update: XOR<CommitteeMemberUpdateWithoutSpeakerListsInput, CommitteeMemberUncheckedUpdateWithoutSpeakerListsInput>
    create: XOR<CommitteeMemberCreateWithoutSpeakerListsInput, CommitteeMemberUncheckedCreateWithoutSpeakerListsInput>
    where?: CommitteeMemberWhereInput
  }

  export type CommitteeMemberUpdateToOneWithWhereWithoutSpeakerListsInput = {
    where?: CommitteeMemberWhereInput
    data: XOR<CommitteeMemberUpdateWithoutSpeakerListsInput, CommitteeMemberUncheckedUpdateWithoutSpeakerListsInput>
  }

  export type CommitteeMemberUpdateWithoutSpeakerListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    committee?: CommitteeUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneWithoutCommitteeMembershipsNestedInput
    delegation?: DelegationUpdateOneWithoutMembersNestedInput
  }

  export type CommitteeMemberUncheckedUpdateWithoutSpeakerListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type ConferenceCreateWithoutDelegationsInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    members?: ConferenceMemberCreateNestedManyWithoutConferenceInput
    committees?: CommitteeCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUncheckedCreateWithoutDelegationsInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    pressWebsite?: string | null
    feedbackWebsite?: string | null
    members?: ConferenceMemberUncheckedCreateNestedManyWithoutConferenceInput
    committees?: CommitteeUncheckedCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceCreateOrConnectWithoutDelegationsInput = {
    where: ConferenceWhereUniqueInput
    create: XOR<ConferenceCreateWithoutDelegationsInput, ConferenceUncheckedCreateWithoutDelegationsInput>
  }

  export type NationCreateWithoutDelegationsInput = {
    id?: string
    alpha3Code: string
    variant?: $Enums.NationVariant
  }

  export type NationUncheckedCreateWithoutDelegationsInput = {
    id?: string
    alpha3Code: string
    variant?: $Enums.NationVariant
  }

  export type NationCreateOrConnectWithoutDelegationsInput = {
    where: NationWhereUniqueInput
    create: XOR<NationCreateWithoutDelegationsInput, NationUncheckedCreateWithoutDelegationsInput>
  }

  export type CommitteeMemberCreateWithoutDelegationInput = {
    id?: string
    presence?: $Enums.Presence
    committee: CommitteeCreateNestedOneWithoutMembersInput
    user?: UserCreateNestedOneWithoutCommitteeMembershipsInput
    speakerLists?: SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput
  }

  export type CommitteeMemberUncheckedCreateWithoutDelegationInput = {
    id?: string
    committeeId: string
    userId?: string | null
    presence?: $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedCreateNestedManyWithoutCommitteeMemberInput
  }

  export type CommitteeMemberCreateOrConnectWithoutDelegationInput = {
    where: CommitteeMemberWhereUniqueInput
    create: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput>
  }

  export type CommitteeMemberCreateManyDelegationInputEnvelope = {
    data: CommitteeMemberCreateManyDelegationInput | CommitteeMemberCreateManyDelegationInput[]
    skipDuplicates?: boolean
  }

  export type ConferenceUpsertWithoutDelegationsInput = {
    update: XOR<ConferenceUpdateWithoutDelegationsInput, ConferenceUncheckedUpdateWithoutDelegationsInput>
    create: XOR<ConferenceCreateWithoutDelegationsInput, ConferenceUncheckedCreateWithoutDelegationsInput>
    where?: ConferenceWhereInput
  }

  export type ConferenceUpdateToOneWithWhereWithoutDelegationsInput = {
    where?: ConferenceWhereInput
    data: XOR<ConferenceUpdateWithoutDelegationsInput, ConferenceUncheckedUpdateWithoutDelegationsInput>
  }

  export type ConferenceUpdateWithoutDelegationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ConferenceMemberUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceUncheckedUpdateWithoutDelegationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pressWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    feedbackWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ConferenceMemberUncheckedUpdateManyWithoutConferenceNestedInput
    committees?: CommitteeUncheckedUpdateManyWithoutConferenceNestedInput
  }

  export type NationUpsertWithoutDelegationsInput = {
    update: XOR<NationUpdateWithoutDelegationsInput, NationUncheckedUpdateWithoutDelegationsInput>
    create: XOR<NationCreateWithoutDelegationsInput, NationUncheckedCreateWithoutDelegationsInput>
    where?: NationWhereInput
  }

  export type NationUpdateToOneWithWhereWithoutDelegationsInput = {
    where?: NationWhereInput
    data: XOR<NationUpdateWithoutDelegationsInput, NationUncheckedUpdateWithoutDelegationsInput>
  }

  export type NationUpdateWithoutDelegationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
  }

  export type NationUncheckedUpdateWithoutDelegationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    alpha3Code?: StringFieldUpdateOperationsInput | string
    variant?: EnumNationVariantFieldUpdateOperationsInput | $Enums.NationVariant
  }

  export type CommitteeMemberUpsertWithWhereUniqueWithoutDelegationInput = {
    where: CommitteeMemberWhereUniqueInput
    update: XOR<CommitteeMemberUpdateWithoutDelegationInput, CommitteeMemberUncheckedUpdateWithoutDelegationInput>
    create: XOR<CommitteeMemberCreateWithoutDelegationInput, CommitteeMemberUncheckedCreateWithoutDelegationInput>
  }

  export type CommitteeMemberUpdateWithWhereUniqueWithoutDelegationInput = {
    where: CommitteeMemberWhereUniqueInput
    data: XOR<CommitteeMemberUpdateWithoutDelegationInput, CommitteeMemberUncheckedUpdateWithoutDelegationInput>
  }

  export type CommitteeMemberUpdateManyWithWhereWithoutDelegationInput = {
    where: CommitteeMemberScalarWhereInput
    data: XOR<CommitteeMemberUpdateManyMutationInput, CommitteeMemberUncheckedUpdateManyWithoutDelegationInput>
  }

  export type DelegationCreateWithoutNationInput = {
    id?: string
    conference: ConferenceCreateNestedOneWithoutDelegationsInput
    members?: CommitteeMemberCreateNestedManyWithoutDelegationInput
  }

  export type DelegationUncheckedCreateWithoutNationInput = {
    id?: string
    conferenceId: string
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutDelegationInput
  }

  export type DelegationCreateOrConnectWithoutNationInput = {
    where: DelegationWhereUniqueInput
    create: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput>
  }

  export type DelegationCreateManyNationInputEnvelope = {
    data: DelegationCreateManyNationInput | DelegationCreateManyNationInput[]
    skipDuplicates?: boolean
  }

  export type DelegationUpsertWithWhereUniqueWithoutNationInput = {
    where: DelegationWhereUniqueInput
    update: XOR<DelegationUpdateWithoutNationInput, DelegationUncheckedUpdateWithoutNationInput>
    create: XOR<DelegationCreateWithoutNationInput, DelegationUncheckedCreateWithoutNationInput>
  }

  export type DelegationUpdateWithWhereUniqueWithoutNationInput = {
    where: DelegationWhereUniqueInput
    data: XOR<DelegationUpdateWithoutNationInput, DelegationUncheckedUpdateWithoutNationInput>
  }

  export type DelegationUpdateManyWithWhereWithoutNationInput = {
    where: DelegationScalarWhereInput
    data: XOR<DelegationUpdateManyMutationInput, DelegationUncheckedUpdateManyWithoutNationInput>
  }

  export type CommitteeCreateWithoutMessagesInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
    members?: CommitteeMemberCreateNestedManyWithoutCommitteeInput
    parent?: CommitteeCreateNestedOneWithoutSubCommitteesInput
    subCommittees?: CommitteeCreateNestedManyWithoutParentInput
    agendaItems?: AgendaItemCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
    members?: CommitteeMemberUncheckedCreateNestedManyWithoutCommitteeInput
    subCommittees?: CommitteeUncheckedCreateNestedManyWithoutParentInput
    agendaItems?: AgendaItemUncheckedCreateNestedManyWithoutCommitteeInput
  }

  export type CommitteeCreateOrConnectWithoutMessagesInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutMessagesInput, CommitteeUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutMessagesInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberCreateNestedManyWithoutUserInput
    committeeMemberships?: CommitteeMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessagesInput = {
    id?: string
    conferenceMemberships?: ConferenceMemberUncheckedCreateNestedManyWithoutUserInput
    committeeMemberships?: CommitteeMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
  }

  export type CommitteeUpsertWithoutMessagesInput = {
    update: XOR<CommitteeUpdateWithoutMessagesInput, CommitteeUncheckedUpdateWithoutMessagesInput>
    create: XOR<CommitteeCreateWithoutMessagesInput, CommitteeUncheckedCreateWithoutMessagesInput>
    where?: CommitteeWhereInput
  }

  export type CommitteeUpdateToOneWithWhereWithoutMessagesInput = {
    where?: CommitteeWhereInput
    data: XOR<CommitteeUpdateWithoutMessagesInput, CommitteeUncheckedUpdateWithoutMessagesInput>
  }

  export type CommitteeUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUpdateManyWithoutUserNestedInput
    committeeMemberships?: CommitteeMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceMemberships?: ConferenceMemberUncheckedUpdateManyWithoutUserNestedInput
    committeeMemberships?: CommitteeMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ConferenceMemberCreateManyUserInput = {
    id?: string
    conferenceId: string
    role: $Enums.ConferenceRole
  }

  export type CommitteeMemberCreateManyUserInput = {
    id?: string
    committeeId: string
    delegationId?: string | null
    presence?: $Enums.Presence
  }

  export type MessageCreateManyAuthorInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    committeeId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type ConferenceMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
    conference?: ConferenceUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ConferenceMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type ConferenceMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type CommitteeMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    committee?: CommitteeUpdateOneRequiredWithoutMembersNestedInput
    speakerLists?: SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput
    delegation?: DelegationUpdateOneWithoutMembersNestedInput
  }

  export type CommitteeMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberNestedInput
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type MessageUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
    committee?: CommitteeUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DelegationCreateManyConferenceInput = {
    id?: string
    nationId: string
  }

  export type ConferenceMemberCreateManyConferenceInput = {
    id?: string
    userId?: string | null
    role: $Enums.ConferenceRole
  }

  export type CommitteeCreateManyConferenceInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    parentId?: string | null
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
  }

  export type DelegationUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    nation?: NationUpdateOneRequiredWithoutDelegationsNestedInput
    members?: CommitteeMemberUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationUncheckedUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    nationId?: StringFieldUpdateOperationsInput | string
    members?: CommitteeMemberUncheckedUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationUncheckedUpdateManyWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    nationId?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceMemberUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
    user?: UserUpdateOneWithoutConferenceMembershipsNestedInput
  }

  export type ConferenceMemberUncheckedUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type ConferenceMemberUncheckedUpdateManyWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumConferenceRoleFieldUpdateOperationsInput | $Enums.ConferenceRole
  }

  export type CommitteeUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    parent?: CommitteeUpdateOneWithoutSubCommitteesNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateManyWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CommitteeMemberCreateManyCommitteeInput = {
    id?: string
    userId?: string | null
    delegationId?: string | null
    presence?: $Enums.Presence
  }

  export type CommitteeCreateManyParentInput = {
    id?: string
    name: string
    abbreviation: string
    category: $Enums.CommitteeCategory
    conferenceId: string
    whiteboardContent?: string
    status?: $Enums.CommitteeStatus
    stateOfDebate?: string | null
    statusHeadline?: string | null
    statusUntil?: Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: boolean
  }

  export type MessageCreateManyCommitteeInput = {
    id?: string
    subject: string
    category?: $Enums.MessageCategory
    message: string
    authorId: string
    timestamp: Date | string
    status?: MessageCreatestatusInput | $Enums.MessageStatus[]
    forwarded?: boolean
    metaEmail?: string | null
    metaDelegation?: string | null
    metaCommittee?: string | null
    metaAgendaItem?: string | null
  }

  export type AgendaItemCreateManyCommitteeInput = {
    id?: string
    title: string
    description?: string | null
    isActive?: boolean
  }

  export type CommitteeMemberUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    user?: UserUpdateOneWithoutCommitteeMembershipsNestedInput
    speakerLists?: SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput
    delegation?: DelegationUpdateOneWithoutMembersNestedInput
  }

  export type CommitteeMemberUncheckedUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberNestedInput
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    delegationId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type CommitteeUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
    members?: CommitteeMemberUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUpdateManyWithoutParentNestedInput
    messages?: MessageUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
    members?: CommitteeMemberUncheckedUpdateManyWithoutCommitteeNestedInput
    subCommittees?: CommitteeUncheckedUpdateManyWithoutParentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutCommitteeNestedInput
    agendaItems?: AgendaItemUncheckedUpdateManyWithoutCommitteeNestedInput
  }

  export type CommitteeUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    category?: EnumCommitteeCategoryFieldUpdateOperationsInput | $Enums.CommitteeCategory
    conferenceId?: StringFieldUpdateOperationsInput | string
    whiteboardContent?: StringFieldUpdateOperationsInput | string
    status?: EnumCommitteeStatusFieldUpdateOperationsInput | $Enums.CommitteeStatus
    stateOfDebate?: NullableStringFieldUpdateOperationsInput | string | null
    statusHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    statusUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowDelegationsToAddThemselvesToSpeakersList?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
    author?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUncheckedUpdateManyWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    category?: EnumMessageCategoryFieldUpdateOperationsInput | $Enums.MessageCategory
    message?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: MessageUpdatestatusInput | $Enums.MessageStatus[]
    forwarded?: BoolFieldUpdateOperationsInput | boolean
    metaEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metaDelegation?: NullableStringFieldUpdateOperationsInput | string | null
    metaCommittee?: NullableStringFieldUpdateOperationsInput | string | null
    metaAgendaItem?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgendaItemUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    speakerLists?: SpeakersListUpdateManyWithoutAgendaItemNestedInput
  }

  export type AgendaItemUncheckedUpdateWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    speakerLists?: SpeakersListUncheckedUpdateManyWithoutAgendaItemNestedInput
  }

  export type AgendaItemUncheckedUpdateManyWithoutCommitteeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakerOnListCreateManyCommitteeMemberInput = {
    id?: string
    speakersListId: string
    position: number
  }

  export type SpeakerOnListUpdateWithoutCommitteeMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    speakersList?: SpeakersListUpdateOneRequiredWithoutSpeakersNestedInput
  }

  export type SpeakerOnListUncheckedUpdateWithoutCommitteeMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    speakersListId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    speakersListId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakersListCreateManyAgendaItemInput = {
    id?: string
    type: $Enums.SpeakersListCategory
    speakingTime: number
    timeLeft?: number | null
    startTimestamp?: Date | string | null
    isClosed?: boolean
  }

  export type SpeakersListUpdateWithoutAgendaItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    speakers?: SpeakerOnListUpdateManyWithoutSpeakersListNestedInput
  }

  export type SpeakersListUncheckedUpdateWithoutAgendaItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    speakers?: SpeakerOnListUncheckedUpdateManyWithoutSpeakersListNestedInput
  }

  export type SpeakersListUncheckedUpdateManyWithoutAgendaItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumSpeakersListCategoryFieldUpdateOperationsInput | $Enums.SpeakersListCategory
    speakingTime?: IntFieldUpdateOperationsInput | number
    timeLeft?: NullableIntFieldUpdateOperationsInput | number | null
    startTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpeakerOnListCreateManySpeakersListInput = {
    id?: string
    committeeMemberId: string
    position: number
  }

  export type SpeakerOnListUpdateWithoutSpeakersListInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    committeeMember?: CommitteeMemberUpdateOneRequiredWithoutSpeakerListsNestedInput
  }

  export type SpeakerOnListUncheckedUpdateWithoutSpeakersListInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeMemberId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakerOnListUncheckedUpdateManyWithoutSpeakersListInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeMemberId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
  }

  export type CommitteeMemberCreateManyDelegationInput = {
    id?: string
    committeeId: string
    userId?: string | null
    presence?: $Enums.Presence
  }

  export type CommitteeMemberUpdateWithoutDelegationInput = {
    id?: StringFieldUpdateOperationsInput | string
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    committee?: CommitteeUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneWithoutCommitteeMembershipsNestedInput
    speakerLists?: SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput
  }

  export type CommitteeMemberUncheckedUpdateWithoutDelegationInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
    speakerLists?: SpeakerOnListUncheckedUpdateManyWithoutCommitteeMemberNestedInput
  }

  export type CommitteeMemberUncheckedUpdateManyWithoutDelegationInput = {
    id?: StringFieldUpdateOperationsInput | string
    committeeId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    presence?: EnumPresenceFieldUpdateOperationsInput | $Enums.Presence
  }

  export type DelegationCreateManyNationInput = {
    id?: string
    conferenceId: string
  }

  export type DelegationUpdateWithoutNationInput = {
    id?: StringFieldUpdateOperationsInput | string
    conference?: ConferenceUpdateOneRequiredWithoutDelegationsNestedInput
    members?: CommitteeMemberUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationUncheckedUpdateWithoutNationInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
    members?: CommitteeMemberUncheckedUpdateManyWithoutDelegationNestedInput
  }

  export type DelegationUncheckedUpdateManyWithoutNationInput = {
    id?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceCountOutputTypeDefaultArgs instead
     */
    export type ConferenceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConferenceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitteeCountOutputTypeDefaultArgs instead
     */
    export type CommitteeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommitteeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitteeMemberCountOutputTypeDefaultArgs instead
     */
    export type CommitteeMemberCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommitteeMemberCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgendaItemCountOutputTypeDefaultArgs instead
     */
    export type AgendaItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgendaItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SpeakersListCountOutputTypeDefaultArgs instead
     */
    export type SpeakersListCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SpeakersListCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DelegationCountOutputTypeDefaultArgs instead
     */
    export type DelegationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DelegationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NationCountOutputTypeDefaultArgs instead
     */
    export type NationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceCreationTokenDefaultArgs instead
     */
    export type ConferenceCreationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConferenceCreationTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceDefaultArgs instead
     */
    export type ConferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConferenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceMemberDefaultArgs instead
     */
    export type ConferenceMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConferenceMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitteeDefaultArgs instead
     */
    export type CommitteeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommitteeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitteeMemberDefaultArgs instead
     */
    export type CommitteeMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommitteeMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgendaItemDefaultArgs instead
     */
    export type AgendaItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgendaItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SpeakersListDefaultArgs instead
     */
    export type SpeakersListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SpeakersListDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SpeakerOnListDefaultArgs instead
     */
    export type SpeakerOnListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SpeakerOnListDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DelegationDefaultArgs instead
     */
    export type DelegationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DelegationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NationDefaultArgs instead
     */
    export type NationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageDefaultArgs instead
     */
    export type MessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}