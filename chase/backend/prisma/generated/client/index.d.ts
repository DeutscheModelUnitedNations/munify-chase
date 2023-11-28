
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Conference
 * A conference entity
 */
export type Conference = $Result.DefaultSelection<Prisma.$ConferencePayload>
/**
 * Model ConferenceCreateToken
 * Consumeable token which grants the creation of a conference
 */
export type ConferenceCreateToken = $Result.DefaultSelection<Prisma.$ConferenceCreateTokenPayload>
/**
 * Model Committee
 * 
 */
export type Committee = $Result.DefaultSelection<Prisma.$CommitteePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Conferences
 * const conferences = await prisma.conference.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Conferences
   * const conferences = await prisma.conference.findMany()
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
   * `prisma.conference`: Exposes CRUD operations for the **Conference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conferences
    * const conferences = await prisma.conference.findMany()
    * ```
    */
  get conference(): Prisma.ConferenceDelegate<ExtArgs>;

  /**
   * `prisma.conferenceCreateToken`: Exposes CRUD operations for the **ConferenceCreateToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConferenceCreateTokens
    * const conferenceCreateTokens = await prisma.conferenceCreateToken.findMany()
    * ```
    */
  get conferenceCreateToken(): Prisma.ConferenceCreateTokenDelegate<ExtArgs>;

  /**
   * `prisma.committee`: Exposes CRUD operations for the **Committee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Committees
    * const committees = await prisma.committee.findMany()
    * ```
    */
  get committee(): Prisma.CommitteeDelegate<ExtArgs>;
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
   * Prisma Client JS version: 5.3.1
   * Query Engine version: e95e739751f42d8ca026f6b910f5a2dc5adeaeee
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
    Conference: 'Conference',
    ConferenceCreateToken: 'ConferenceCreateToken',
    Committee: 'Committee'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'conference' | 'conferenceCreateToken' | 'committee'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
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
      ConferenceCreateToken: {
        payload: Prisma.$ConferenceCreateTokenPayload<ExtArgs>
        fields: Prisma.ConferenceCreateTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConferenceCreateTokenFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConferenceCreateTokenFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          findFirst: {
            args: Prisma.ConferenceCreateTokenFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConferenceCreateTokenFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          findMany: {
            args: Prisma.ConferenceCreateTokenFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>[]
          }
          create: {
            args: Prisma.ConferenceCreateTokenCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          createMany: {
            args: Prisma.ConferenceCreateTokenCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ConferenceCreateTokenDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          update: {
            args: Prisma.ConferenceCreateTokenUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          deleteMany: {
            args: Prisma.ConferenceCreateTokenDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ConferenceCreateTokenUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ConferenceCreateTokenUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$ConferenceCreateTokenPayload>
          }
          aggregate: {
            args: Prisma.ConferenceCreateTokenAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateConferenceCreateToken>
          }
          groupBy: {
            args: Prisma.ConferenceCreateTokenGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceCreateTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConferenceCreateTokenCountArgs<ExtArgs>,
            result: $Utils.Optional<ConferenceCreateTokenCountAggregateOutputType> | number
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
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
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
   * Count Type ConferenceCountOutputType
   */

  export type ConferenceCountOutputType = {
    committees: number
  }

  export type ConferenceCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    committees?: boolean | ConferenceCountOutputTypeCountCommitteesArgs
  }

  // Custom InputTypes

  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCountOutputType
     */
    select?: ConferenceCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ConferenceCountOutputType without action
   */
  export type ConferenceCountOutputTypeCountCommitteesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CommitteeWhereInput
  }



  /**
   * Models
   */

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
  }

  export type ConferenceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    start: Date | null
    end: Date | null
  }

  export type ConferenceCountAggregateOutputType = {
    id: number
    name: number
    start: number
    end: number
    _all: number
  }


  export type ConferenceMinAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
  }

  export type ConferenceMaxAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
  }

  export type ConferenceCountAggregateInputType = {
    id?: true
    name?: true
    start?: true
    end?: true
    _all?: true
  }

  export type ConferenceAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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




  export type ConferenceGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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


  export type ConferenceSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    start?: boolean
    end?: boolean
    committees?: boolean | Conference$committeesArgs<ExtArgs>
    _count?: boolean | ConferenceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conference"]>

  export type ConferenceSelectScalar = {
    id?: boolean
    name?: boolean
    start?: boolean
    end?: boolean
  }

  export type ConferenceInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    committees?: boolean | Conference$committeesArgs<ExtArgs>
    _count?: boolean | ConferenceCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $ConferencePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "Conference"
    objects: {
      committees: Prisma.$CommitteePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetResult<{
      id: string
      name: string
      start: Date | null
      end: Date | null
    }, ExtArgs["result"]["conference"]>
    composites: {}
  }


  type ConferenceGetPayload<S extends boolean | null | undefined | ConferenceDefaultArgs> = $Result.GetResult<Prisma.$ConferencePayload, S>

  type ConferenceCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ConferenceFindManyArgs, 'select' | 'include'> & {
      select?: ConferenceCountAggregateInputType | true
    }

  export interface ConferenceDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
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
     * Find one Conference that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
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
     * @param {ConferenceFindManyArgs=} args - Arguments to filter and select certain fields only.
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
     *     @param {ConferenceCreateManyArgs} args - Arguments to create many Conferences.
     *     @example
     *     // Create many Conferences
     *     const conference = await prisma.conference.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ConferenceCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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
  export interface Prisma__ConferenceClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

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
  }
    

  // Custom InputTypes

  /**
   * Conference findUnique
   */
  export type ConferenceFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conferences.
     */
    data: ConferenceCreateManyInput | ConferenceCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * Conference update
   */
  export type ConferenceUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
  export type ConferenceUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conferences to delete
     */
    where?: ConferenceWhereInput
  }


  /**
   * Conference.committees
   */
  export type Conference$committeesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type ConferenceDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conference
     */
    select?: ConferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ConferenceInclude<ExtArgs> | null
  }



  /**
   * Model ConferenceCreateToken
   */

  export type AggregateConferenceCreateToken = {
    _count: ConferenceCreateTokenCountAggregateOutputType | null
    _min: ConferenceCreateTokenMinAggregateOutputType | null
    _max: ConferenceCreateTokenMaxAggregateOutputType | null
  }

  export type ConferenceCreateTokenMinAggregateOutputType = {
    token: string | null
  }

  export type ConferenceCreateTokenMaxAggregateOutputType = {
    token: string | null
  }

  export type ConferenceCreateTokenCountAggregateOutputType = {
    token: number
    _all: number
  }


  export type ConferenceCreateTokenMinAggregateInputType = {
    token?: true
  }

  export type ConferenceCreateTokenMaxAggregateInputType = {
    token?: true
  }

  export type ConferenceCreateTokenCountAggregateInputType = {
    token?: true
    _all?: true
  }

  export type ConferenceCreateTokenAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceCreateToken to aggregate.
     */
    where?: ConferenceCreateTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreateTokens to fetch.
     */
    orderBy?: ConferenceCreateTokenOrderByWithRelationInput | ConferenceCreateTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConferenceCreateTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreateTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreateTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConferenceCreateTokens
    **/
    _count?: true | ConferenceCreateTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConferenceCreateTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConferenceCreateTokenMaxAggregateInputType
  }

  export type GetConferenceCreateTokenAggregateType<T extends ConferenceCreateTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateConferenceCreateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConferenceCreateToken[P]>
      : GetScalarType<T[P], AggregateConferenceCreateToken[P]>
  }




  export type ConferenceCreateTokenGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ConferenceCreateTokenWhereInput
    orderBy?: ConferenceCreateTokenOrderByWithAggregationInput | ConferenceCreateTokenOrderByWithAggregationInput[]
    by: ConferenceCreateTokenScalarFieldEnum[] | ConferenceCreateTokenScalarFieldEnum
    having?: ConferenceCreateTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConferenceCreateTokenCountAggregateInputType | true
    _min?: ConferenceCreateTokenMinAggregateInputType
    _max?: ConferenceCreateTokenMaxAggregateInputType
  }

  export type ConferenceCreateTokenGroupByOutputType = {
    token: string
    _count: ConferenceCreateTokenCountAggregateOutputType | null
    _min: ConferenceCreateTokenMinAggregateOutputType | null
    _max: ConferenceCreateTokenMaxAggregateOutputType | null
  }

  type GetConferenceCreateTokenGroupByPayload<T extends ConferenceCreateTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConferenceCreateTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConferenceCreateTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConferenceCreateTokenGroupByOutputType[P]>
            : GetScalarType<T[P], ConferenceCreateTokenGroupByOutputType[P]>
        }
      >
    >


  export type ConferenceCreateTokenSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
  }, ExtArgs["result"]["conferenceCreateToken"]>

  export type ConferenceCreateTokenSelectScalar = {
    token?: boolean
  }


  export type $ConferenceCreateTokenPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "ConferenceCreateToken"
    objects: {}
    scalars: $Extensions.GetResult<{
      token: string
    }, ExtArgs["result"]["conferenceCreateToken"]>
    composites: {}
  }


  type ConferenceCreateTokenGetPayload<S extends boolean | null | undefined | ConferenceCreateTokenDefaultArgs> = $Result.GetResult<Prisma.$ConferenceCreateTokenPayload, S>

  type ConferenceCreateTokenCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ConferenceCreateTokenFindManyArgs, 'select' | 'include'> & {
      select?: ConferenceCreateTokenCountAggregateInputType | true
    }

  export interface ConferenceCreateTokenDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConferenceCreateToken'], meta: { name: 'ConferenceCreateToken' } }
    /**
     * Find zero or one ConferenceCreateToken that matches the filter.
     * @param {ConferenceCreateTokenFindUniqueArgs} args - Arguments to find a ConferenceCreateToken
     * @example
     * // Get one ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ConferenceCreateTokenFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenFindUniqueArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one ConferenceCreateToken that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ConferenceCreateTokenFindUniqueOrThrowArgs} args - Arguments to find a ConferenceCreateToken
     * @example
     * // Get one ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ConferenceCreateTokenFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first ConferenceCreateToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenFindFirstArgs} args - Arguments to find a ConferenceCreateToken
     * @example
     * // Get one ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ConferenceCreateTokenFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenFindFirstArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first ConferenceCreateToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenFindFirstOrThrowArgs} args - Arguments to find a ConferenceCreateToken
     * @example
     * // Get one ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ConferenceCreateTokenFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more ConferenceCreateTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConferenceCreateTokens
     * const conferenceCreateTokens = await prisma.conferenceCreateToken.findMany()
     * 
     * // Get first 10 ConferenceCreateTokens
     * const conferenceCreateTokens = await prisma.conferenceCreateToken.findMany({ take: 10 })
     * 
     * // Only select the `token`
     * const conferenceCreateTokenWithTokenOnly = await prisma.conferenceCreateToken.findMany({ select: { token: true } })
     * 
    **/
    findMany<T extends ConferenceCreateTokenFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a ConferenceCreateToken.
     * @param {ConferenceCreateTokenCreateArgs} args - Arguments to create a ConferenceCreateToken.
     * @example
     * // Create one ConferenceCreateToken
     * const ConferenceCreateToken = await prisma.conferenceCreateToken.create({
     *   data: {
     *     // ... data to create a ConferenceCreateToken
     *   }
     * })
     * 
    **/
    create<T extends ConferenceCreateTokenCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenCreateArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many ConferenceCreateTokens.
     *     @param {ConferenceCreateTokenCreateManyArgs} args - Arguments to create many ConferenceCreateTokens.
     *     @example
     *     // Create many ConferenceCreateTokens
     *     const conferenceCreateToken = await prisma.conferenceCreateToken.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ConferenceCreateTokenCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ConferenceCreateToken.
     * @param {ConferenceCreateTokenDeleteArgs} args - Arguments to delete one ConferenceCreateToken.
     * @example
     * // Delete one ConferenceCreateToken
     * const ConferenceCreateToken = await prisma.conferenceCreateToken.delete({
     *   where: {
     *     // ... filter to delete one ConferenceCreateToken
     *   }
     * })
     * 
    **/
    delete<T extends ConferenceCreateTokenDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenDeleteArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one ConferenceCreateToken.
     * @param {ConferenceCreateTokenUpdateArgs} args - Arguments to update one ConferenceCreateToken.
     * @example
     * // Update one ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ConferenceCreateTokenUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenUpdateArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more ConferenceCreateTokens.
     * @param {ConferenceCreateTokenDeleteManyArgs} args - Arguments to filter ConferenceCreateTokens to delete.
     * @example
     * // Delete a few ConferenceCreateTokens
     * const { count } = await prisma.conferenceCreateToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ConferenceCreateTokenDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ConferenceCreateTokenDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConferenceCreateTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConferenceCreateTokens
     * const conferenceCreateToken = await prisma.conferenceCreateToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ConferenceCreateTokenUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConferenceCreateToken.
     * @param {ConferenceCreateTokenUpsertArgs} args - Arguments to update or create a ConferenceCreateToken.
     * @example
     * // Update or create a ConferenceCreateToken
     * const conferenceCreateToken = await prisma.conferenceCreateToken.upsert({
     *   create: {
     *     // ... data to create a ConferenceCreateToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConferenceCreateToken we want to update
     *   }
     * })
    **/
    upsert<T extends ConferenceCreateTokenUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ConferenceCreateTokenUpsertArgs<ExtArgs>>
    ): Prisma__ConferenceCreateTokenClient<$Result.GetResult<Prisma.$ConferenceCreateTokenPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of ConferenceCreateTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenCountArgs} args - Arguments to filter ConferenceCreateTokens to count.
     * @example
     * // Count the number of ConferenceCreateTokens
     * const count = await prisma.conferenceCreateToken.count({
     *   where: {
     *     // ... the filter for the ConferenceCreateTokens we want to count
     *   }
     * })
    **/
    count<T extends ConferenceCreateTokenCountArgs>(
      args?: Subset<T, ConferenceCreateTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConferenceCreateTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConferenceCreateToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConferenceCreateTokenAggregateArgs>(args: Subset<T, ConferenceCreateTokenAggregateArgs>): Prisma.PrismaPromise<GetConferenceCreateTokenAggregateType<T>>

    /**
     * Group by ConferenceCreateToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConferenceCreateTokenGroupByArgs} args - Group by arguments.
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
      T extends ConferenceCreateTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConferenceCreateTokenGroupByArgs['orderBy'] }
        : { orderBy?: ConferenceCreateTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConferenceCreateTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConferenceCreateTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConferenceCreateToken model
   */
  readonly fields: ConferenceCreateTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConferenceCreateToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConferenceCreateTokenClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ConferenceCreateToken model
   */ 
  interface ConferenceCreateTokenFieldRefs {
    readonly token: FieldRef<"ConferenceCreateToken", 'String'>
  }
    

  // Custom InputTypes

  /**
   * ConferenceCreateToken findUnique
   */
  export type ConferenceCreateTokenFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreateToken to fetch.
     */
    where: ConferenceCreateTokenWhereUniqueInput
  }


  /**
   * ConferenceCreateToken findUniqueOrThrow
   */
  export type ConferenceCreateTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreateToken to fetch.
     */
    where: ConferenceCreateTokenWhereUniqueInput
  }


  /**
   * ConferenceCreateToken findFirst
   */
  export type ConferenceCreateTokenFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreateToken to fetch.
     */
    where?: ConferenceCreateTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreateTokens to fetch.
     */
    orderBy?: ConferenceCreateTokenOrderByWithRelationInput | ConferenceCreateTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceCreateTokens.
     */
    cursor?: ConferenceCreateTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreateTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreateTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceCreateTokens.
     */
    distinct?: ConferenceCreateTokenScalarFieldEnum | ConferenceCreateTokenScalarFieldEnum[]
  }


  /**
   * ConferenceCreateToken findFirstOrThrow
   */
  export type ConferenceCreateTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreateToken to fetch.
     */
    where?: ConferenceCreateTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreateTokens to fetch.
     */
    orderBy?: ConferenceCreateTokenOrderByWithRelationInput | ConferenceCreateTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConferenceCreateTokens.
     */
    cursor?: ConferenceCreateTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreateTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreateTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConferenceCreateTokens.
     */
    distinct?: ConferenceCreateTokenScalarFieldEnum | ConferenceCreateTokenScalarFieldEnum[]
  }


  /**
   * ConferenceCreateToken findMany
   */
  export type ConferenceCreateTokenFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter, which ConferenceCreateTokens to fetch.
     */
    where?: ConferenceCreateTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConferenceCreateTokens to fetch.
     */
    orderBy?: ConferenceCreateTokenOrderByWithRelationInput | ConferenceCreateTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConferenceCreateTokens.
     */
    cursor?: ConferenceCreateTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConferenceCreateTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConferenceCreateTokens.
     */
    skip?: number
    distinct?: ConferenceCreateTokenScalarFieldEnum | ConferenceCreateTokenScalarFieldEnum[]
  }


  /**
   * ConferenceCreateToken create
   */
  export type ConferenceCreateTokenCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a ConferenceCreateToken.
     */
    data: XOR<ConferenceCreateTokenCreateInput, ConferenceCreateTokenUncheckedCreateInput>
  }


  /**
   * ConferenceCreateToken createMany
   */
  export type ConferenceCreateTokenCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConferenceCreateTokens.
     */
    data: ConferenceCreateTokenCreateManyInput | ConferenceCreateTokenCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * ConferenceCreateToken update
   */
  export type ConferenceCreateTokenUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a ConferenceCreateToken.
     */
    data: XOR<ConferenceCreateTokenUpdateInput, ConferenceCreateTokenUncheckedUpdateInput>
    /**
     * Choose, which ConferenceCreateToken to update.
     */
    where: ConferenceCreateTokenWhereUniqueInput
  }


  /**
   * ConferenceCreateToken updateMany
   */
  export type ConferenceCreateTokenUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConferenceCreateTokens.
     */
    data: XOR<ConferenceCreateTokenUpdateManyMutationInput, ConferenceCreateTokenUncheckedUpdateManyInput>
    /**
     * Filter which ConferenceCreateTokens to update
     */
    where?: ConferenceCreateTokenWhereInput
  }


  /**
   * ConferenceCreateToken upsert
   */
  export type ConferenceCreateTokenUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the ConferenceCreateToken to update in case it exists.
     */
    where: ConferenceCreateTokenWhereUniqueInput
    /**
     * In case the ConferenceCreateToken found by the `where` argument doesn't exist, create a new ConferenceCreateToken with this data.
     */
    create: XOR<ConferenceCreateTokenCreateInput, ConferenceCreateTokenUncheckedCreateInput>
    /**
     * In case the ConferenceCreateToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConferenceCreateTokenUpdateInput, ConferenceCreateTokenUncheckedUpdateInput>
  }


  /**
   * ConferenceCreateToken delete
   */
  export type ConferenceCreateTokenDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
    /**
     * Filter which ConferenceCreateToken to delete.
     */
    where: ConferenceCreateTokenWhereUniqueInput
  }


  /**
   * ConferenceCreateToken deleteMany
   */
  export type ConferenceCreateTokenDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConferenceCreateTokens to delete
     */
    where?: ConferenceCreateTokenWhereInput
  }


  /**
   * ConferenceCreateToken without action
   */
  export type ConferenceCreateTokenDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConferenceCreateToken
     */
    select?: ConferenceCreateTokenSelect<ExtArgs> | null
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
    conferenceId: string | null
  }

  export type CommitteeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    abbreviation: string | null
    conferenceId: string | null
  }

  export type CommitteeCountAggregateOutputType = {
    id: number
    name: number
    abbreviation: number
    conferenceId: number
    _all: number
  }


  export type CommitteeMinAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    conferenceId?: true
  }

  export type CommitteeMaxAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    conferenceId?: true
  }

  export type CommitteeCountAggregateInputType = {
    id?: true
    name?: true
    abbreviation?: true
    conferenceId?: true
    _all?: true
  }

  export type CommitteeAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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




  export type CommitteeGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
    conferenceId: string
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


  export type CommitteeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    abbreviation?: boolean
    conferenceId?: boolean
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["committee"]>

  export type CommitteeSelectScalar = {
    id?: boolean
    name?: boolean
    abbreviation?: boolean
    conferenceId?: boolean
  }

  export type CommitteeInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    conference?: boolean | ConferenceDefaultArgs<ExtArgs>
  }


  export type $CommitteePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    name: "Committee"
    objects: {
      conference: Prisma.$ConferencePayload<ExtArgs>
    }
    scalars: $Extensions.GetResult<{
      id: string
      name: string
      abbreviation: string
      conferenceId: string
    }, ExtArgs["result"]["committee"]>
    composites: {}
  }


  type CommitteeGetPayload<S extends boolean | null | undefined | CommitteeDefaultArgs> = $Result.GetResult<Prisma.$CommitteePayload, S>

  type CommitteeCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<CommitteeFindManyArgs, 'select' | 'include'> & {
      select?: CommitteeCountAggregateInputType | true
    }

  export interface CommitteeDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
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
     * Find one Committee that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
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
     * @param {CommitteeFindManyArgs=} args - Arguments to filter and select certain fields only.
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
     *     @param {CommitteeCreateManyArgs} args - Arguments to create many Committees.
     *     @example
     *     // Create many Committees
     *     const committee = await prisma.committee.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CommitteeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommitteeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

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
  export interface Prisma__CommitteeClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    conference<T extends ConferenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConferenceDefaultArgs<ExtArgs>>): Prisma__ConferenceClient<$Result.GetResult<Prisma.$ConferencePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

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
    readonly conferenceId: FieldRef<"Committee", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Committee findUnique
   */
  export type CommitteeFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Committees.
     */
    data: CommitteeCreateManyInput | CommitteeCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * Committee update
   */
  export type CommitteeUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
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
  export type CommitteeUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
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
  export type CommitteeDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Committees to delete
     */
    where?: CommitteeWhereInput
  }


  /**
   * Committee without action
   */
  export type CommitteeDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Committee
     */
    select?: CommitteeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CommitteeInclude<ExtArgs> | null
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


  export const ConferenceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    start: 'start',
    end: 'end'
  };

  export type ConferenceScalarFieldEnum = (typeof ConferenceScalarFieldEnum)[keyof typeof ConferenceScalarFieldEnum]


  export const ConferenceCreateTokenScalarFieldEnum: {
    token: 'token'
  };

  export type ConferenceCreateTokenScalarFieldEnum = (typeof ConferenceCreateTokenScalarFieldEnum)[keyof typeof ConferenceCreateTokenScalarFieldEnum]


  export const CommitteeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    abbreviation: 'abbreviation',
    conferenceId: 'conferenceId'
  };

  export type CommitteeScalarFieldEnum = (typeof CommitteeScalarFieldEnum)[keyof typeof CommitteeScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ConferenceWhereInput = {
    AND?: ConferenceWhereInput | ConferenceWhereInput[]
    OR?: ConferenceWhereInput[]
    NOT?: ConferenceWhereInput | ConferenceWhereInput[]
    id?: StringFilter<"Conference"> | string
    name?: StringFilter<"Conference"> | string
    start?: DateTimeNullableFilter<"Conference"> | Date | string | null
    end?: DateTimeNullableFilter<"Conference"> | Date | string | null
    committees?: CommitteeListRelationFilter
  }

  export type ConferenceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrderInput | SortOrder
    end?: SortOrderInput | SortOrder
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
    committees?: CommitteeListRelationFilter
  }, "id" | "name">

  export type ConferenceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrderInput | SortOrder
    end?: SortOrderInput | SortOrder
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
  }

  export type ConferenceCreateTokenWhereInput = {
    AND?: ConferenceCreateTokenWhereInput | ConferenceCreateTokenWhereInput[]
    OR?: ConferenceCreateTokenWhereInput[]
    NOT?: ConferenceCreateTokenWhereInput | ConferenceCreateTokenWhereInput[]
    token?: StringFilter<"ConferenceCreateToken"> | string
  }

  export type ConferenceCreateTokenOrderByWithRelationInput = {
    token?: SortOrder
  }

  export type ConferenceCreateTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    AND?: ConferenceCreateTokenWhereInput | ConferenceCreateTokenWhereInput[]
    OR?: ConferenceCreateTokenWhereInput[]
    NOT?: ConferenceCreateTokenWhereInput | ConferenceCreateTokenWhereInput[]
  }, "token">

  export type ConferenceCreateTokenOrderByWithAggregationInput = {
    token?: SortOrder
    _count?: ConferenceCreateTokenCountOrderByAggregateInput
    _max?: ConferenceCreateTokenMaxOrderByAggregateInput
    _min?: ConferenceCreateTokenMinOrderByAggregateInput
  }

  export type ConferenceCreateTokenScalarWhereWithAggregatesInput = {
    AND?: ConferenceCreateTokenScalarWhereWithAggregatesInput | ConferenceCreateTokenScalarWhereWithAggregatesInput[]
    OR?: ConferenceCreateTokenScalarWhereWithAggregatesInput[]
    NOT?: ConferenceCreateTokenScalarWhereWithAggregatesInput | ConferenceCreateTokenScalarWhereWithAggregatesInput[]
    token?: StringWithAggregatesFilter<"ConferenceCreateToken"> | string
  }

  export type CommitteeWhereInput = {
    AND?: CommitteeWhereInput | CommitteeWhereInput[]
    OR?: CommitteeWhereInput[]
    NOT?: CommitteeWhereInput | CommitteeWhereInput[]
    id?: StringFilter<"Committee"> | string
    name?: StringFilter<"Committee"> | string
    abbreviation?: StringFilter<"Committee"> | string
    conferenceId?: StringFilter<"Committee"> | string
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
  }

  export type CommitteeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    conferenceId?: SortOrder
    conference?: ConferenceOrderByWithRelationInput
  }

  export type CommitteeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_conferenceId?: CommitteeNameConferenceIdCompoundUniqueInput
    AND?: CommitteeWhereInput | CommitteeWhereInput[]
    OR?: CommitteeWhereInput[]
    NOT?: CommitteeWhereInput | CommitteeWhereInput[]
    name?: StringFilter<"Committee"> | string
    abbreviation?: StringFilter<"Committee"> | string
    conferenceId?: StringFilter<"Committee"> | string
    conference?: XOR<ConferenceRelationFilter, ConferenceWhereInput>
  }, "id" | "name_conferenceId">

  export type CommitteeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    conferenceId?: SortOrder
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
    conferenceId?: StringWithAggregatesFilter<"Committee"> | string
  }

  export type ConferenceCreateInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    committees?: CommitteeCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUncheckedCreateInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
    committees?: CommitteeUncheckedCreateNestedManyWithoutConferenceInput
  }

  export type ConferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    committees?: CommitteeUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    committees?: CommitteeUncheckedUpdateManyWithoutConferenceNestedInput
  }

  export type ConferenceCreateManyInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
  }

  export type ConferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConferenceCreateTokenCreateInput = {
    token: string
  }

  export type ConferenceCreateTokenUncheckedCreateInput = {
    token: string
  }

  export type ConferenceCreateTokenUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreateTokenUncheckedUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreateTokenCreateManyInput = {
    token: string
  }

  export type ConferenceCreateTokenUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type ConferenceCreateTokenUncheckedUpdateManyInput = {
    token?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeCreateInput = {
    id?: string
    name: string
    abbreviation: string
    conference: ConferenceCreateNestedOneWithoutCommitteesInput
  }

  export type CommitteeUncheckedCreateInput = {
    id?: string
    name: string
    abbreviation: string
    conferenceId: string
  }

  export type CommitteeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    conference?: ConferenceUpdateOneRequiredWithoutCommitteesNestedInput
  }

  export type CommitteeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeCreateManyInput = {
    id?: string
    name: string
    abbreviation: string
    conferenceId: string
  }

  export type CommitteeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    conferenceId?: StringFieldUpdateOperationsInput | string
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

  export type CommitteeListRelationFilter = {
    every?: CommitteeWhereInput
    some?: CommitteeWhereInput
    none?: CommitteeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CommitteeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConferenceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
  }

  export type ConferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
  }

  export type ConferenceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    start?: SortOrder
    end?: SortOrder
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

  export type ConferenceCreateTokenCountOrderByAggregateInput = {
    token?: SortOrder
  }

  export type ConferenceCreateTokenMaxOrderByAggregateInput = {
    token?: SortOrder
  }

  export type ConferenceCreateTokenMinOrderByAggregateInput = {
    token?: SortOrder
  }

  export type ConferenceRelationFilter = {
    is?: ConferenceWhereInput
    isNot?: ConferenceWhereInput
  }

  export type CommitteeNameConferenceIdCompoundUniqueInput = {
    name: string
    conferenceId: string
  }

  export type CommitteeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    conferenceId?: SortOrder
  }

  export type CommitteeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    conferenceId?: SortOrder
  }

  export type CommitteeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    abbreviation?: SortOrder
    conferenceId?: SortOrder
  }

  export type CommitteeCreateNestedManyWithoutConferenceInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type CommitteeUncheckedCreateNestedManyWithoutConferenceInput = {
    create?: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput> | CommitteeCreateWithoutConferenceInput[] | CommitteeUncheckedCreateWithoutConferenceInput[]
    connectOrCreate?: CommitteeCreateOrConnectWithoutConferenceInput | CommitteeCreateOrConnectWithoutConferenceInput[]
    createMany?: CommitteeCreateManyConferenceInputEnvelope
    connect?: CommitteeWhereUniqueInput | CommitteeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type ConferenceCreateNestedOneWithoutCommitteesInput = {
    create?: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutCommitteesInput
    connect?: ConferenceWhereUniqueInput
  }

  export type ConferenceUpdateOneRequiredWithoutCommitteesNestedInput = {
    create?: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
    connectOrCreate?: ConferenceCreateOrConnectWithoutCommitteesInput
    upsert?: ConferenceUpsertWithoutCommitteesInput
    connect?: ConferenceWhereUniqueInput
    update?: XOR<XOR<ConferenceUpdateToOneWithWhereWithoutCommitteesInput, ConferenceUpdateWithoutCommitteesInput>, ConferenceUncheckedUpdateWithoutCommitteesInput>
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

  export type CommitteeCreateWithoutConferenceInput = {
    id?: string
    name: string
    abbreviation: string
  }

  export type CommitteeUncheckedCreateWithoutConferenceInput = {
    id?: string
    name: string
    abbreviation: string
  }

  export type CommitteeCreateOrConnectWithoutConferenceInput = {
    where: CommitteeWhereUniqueInput
    create: XOR<CommitteeCreateWithoutConferenceInput, CommitteeUncheckedCreateWithoutConferenceInput>
  }

  export type CommitteeCreateManyConferenceInputEnvelope = {
    data: CommitteeCreateManyConferenceInput | CommitteeCreateManyConferenceInput[]
    skipDuplicates?: boolean
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
    conferenceId?: StringFilter<"Committee"> | string
  }

  export type ConferenceCreateWithoutCommitteesInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
  }

  export type ConferenceUncheckedCreateWithoutCommitteesInput = {
    id?: string
    name: string
    start?: Date | string | null
    end?: Date | string | null
  }

  export type ConferenceCreateOrConnectWithoutCommitteesInput = {
    where: ConferenceWhereUniqueInput
    create: XOR<ConferenceCreateWithoutCommitteesInput, ConferenceUncheckedCreateWithoutCommitteesInput>
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
  }

  export type ConferenceUncheckedUpdateWithoutCommitteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CommitteeCreateManyConferenceInput = {
    id?: string
    name: string
    abbreviation: string
  }

  export type CommitteeUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeUncheckedUpdateWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }

  export type CommitteeUncheckedUpdateManyWithoutConferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ConferenceCountOutputTypeDefaultArgs instead
     */
    export type ConferenceCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = ConferenceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceDefaultArgs instead
     */
    export type ConferenceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = ConferenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConferenceCreateTokenDefaultArgs instead
     */
    export type ConferenceCreateTokenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = ConferenceCreateTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitteeDefaultArgs instead
     */
    export type CommitteeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = CommitteeDefaultArgs<ExtArgs>

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