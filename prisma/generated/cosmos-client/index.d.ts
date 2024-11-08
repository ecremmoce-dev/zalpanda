
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
 * Model Qoo10NormalProduct
 * 
 */
export type Qoo10NormalProduct = $Result.DefaultSelection<Prisma.$Qoo10NormalProductPayload>
/**
 * Model Qoo10MoveProduct
 * 
 */
export type Qoo10MoveProduct = $Result.DefaultSelection<Prisma.$Qoo10MoveProductPayload>
/**
 * Model NormalOption
 * 
 */
export type NormalOption = $Result.DefaultSelection<Prisma.$NormalOptionPayload>
/**
 * Model MoveOption
 * 
 */
export type MoveOption = $Result.DefaultSelection<Prisma.$MoveOptionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Qoo10NormalProducts
 * const qoo10NormalProducts = await prisma.qoo10NormalProduct.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Qoo10NormalProducts
   * const qoo10NormalProducts = await prisma.qoo10NormalProduct.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.qoo10NormalProduct`: Exposes CRUD operations for the **Qoo10NormalProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Qoo10NormalProducts
    * const qoo10NormalProducts = await prisma.qoo10NormalProduct.findMany()
    * ```
    */
  get qoo10NormalProduct(): Prisma.Qoo10NormalProductDelegate<ExtArgs>;

  /**
   * `prisma.qoo10MoveProduct`: Exposes CRUD operations for the **Qoo10MoveProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Qoo10MoveProducts
    * const qoo10MoveProducts = await prisma.qoo10MoveProduct.findMany()
    * ```
    */
  get qoo10MoveProduct(): Prisma.Qoo10MoveProductDelegate<ExtArgs>;

  /**
   * `prisma.normalOption`: Exposes CRUD operations for the **NormalOption** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NormalOptions
    * const normalOptions = await prisma.normalOption.findMany()
    * ```
    */
  get normalOption(): Prisma.NormalOptionDelegate<ExtArgs>;

  /**
   * `prisma.moveOption`: Exposes CRUD operations for the **MoveOption** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MoveOptions
    * const moveOptions = await prisma.moveOption.findMany()
    * ```
    */
  get moveOption(): Prisma.MoveOptionDelegate<ExtArgs>;
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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
    Qoo10NormalProduct: 'Qoo10NormalProduct',
    Qoo10MoveProduct: 'Qoo10MoveProduct',
    NormalOption: 'NormalOption',
    MoveOption: 'MoveOption'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "qoo10NormalProduct" | "qoo10MoveProduct" | "normalOption" | "moveOption"
      txIsolationLevel: never
    }
    model: {
      Qoo10NormalProduct: {
        payload: Prisma.$Qoo10NormalProductPayload<ExtArgs>
        fields: Prisma.Qoo10NormalProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Qoo10NormalProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Qoo10NormalProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          findFirst: {
            args: Prisma.Qoo10NormalProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Qoo10NormalProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          findMany: {
            args: Prisma.Qoo10NormalProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>[]
          }
          create: {
            args: Prisma.Qoo10NormalProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          createMany: {
            args: Prisma.Qoo10NormalProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.Qoo10NormalProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          update: {
            args: Prisma.Qoo10NormalProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          deleteMany: {
            args: Prisma.Qoo10NormalProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Qoo10NormalProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.Qoo10NormalProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10NormalProductPayload>
          }
          aggregate: {
            args: Prisma.Qoo10NormalProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQoo10NormalProduct>
          }
          groupBy: {
            args: Prisma.Qoo10NormalProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<Qoo10NormalProductGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.Qoo10NormalProductFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.Qoo10NormalProductAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.Qoo10NormalProductCountArgs<ExtArgs>
            result: $Utils.Optional<Qoo10NormalProductCountAggregateOutputType> | number
          }
        }
      }
      Qoo10MoveProduct: {
        payload: Prisma.$Qoo10MoveProductPayload<ExtArgs>
        fields: Prisma.Qoo10MoveProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Qoo10MoveProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Qoo10MoveProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          findFirst: {
            args: Prisma.Qoo10MoveProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Qoo10MoveProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          findMany: {
            args: Prisma.Qoo10MoveProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>[]
          }
          create: {
            args: Prisma.Qoo10MoveProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          createMany: {
            args: Prisma.Qoo10MoveProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.Qoo10MoveProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          update: {
            args: Prisma.Qoo10MoveProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          deleteMany: {
            args: Prisma.Qoo10MoveProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Qoo10MoveProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.Qoo10MoveProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Qoo10MoveProductPayload>
          }
          aggregate: {
            args: Prisma.Qoo10MoveProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQoo10MoveProduct>
          }
          groupBy: {
            args: Prisma.Qoo10MoveProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<Qoo10MoveProductGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.Qoo10MoveProductFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.Qoo10MoveProductAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.Qoo10MoveProductCountArgs<ExtArgs>
            result: $Utils.Optional<Qoo10MoveProductCountAggregateOutputType> | number
          }
        }
      }
      NormalOption: {
        payload: Prisma.$NormalOptionPayload<ExtArgs>
        fields: Prisma.NormalOptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NormalOptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NormalOptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          findFirst: {
            args: Prisma.NormalOptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NormalOptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          findMany: {
            args: Prisma.NormalOptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>[]
          }
          create: {
            args: Prisma.NormalOptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          createMany: {
            args: Prisma.NormalOptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NormalOptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          update: {
            args: Prisma.NormalOptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          deleteMany: {
            args: Prisma.NormalOptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NormalOptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NormalOptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NormalOptionPayload>
          }
          aggregate: {
            args: Prisma.NormalOptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNormalOption>
          }
          groupBy: {
            args: Prisma.NormalOptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<NormalOptionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.NormalOptionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.NormalOptionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.NormalOptionCountArgs<ExtArgs>
            result: $Utils.Optional<NormalOptionCountAggregateOutputType> | number
          }
        }
      }
      MoveOption: {
        payload: Prisma.$MoveOptionPayload<ExtArgs>
        fields: Prisma.MoveOptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MoveOptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MoveOptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          findFirst: {
            args: Prisma.MoveOptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MoveOptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          findMany: {
            args: Prisma.MoveOptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>[]
          }
          create: {
            args: Prisma.MoveOptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          createMany: {
            args: Prisma.MoveOptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MoveOptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          update: {
            args: Prisma.MoveOptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          deleteMany: {
            args: Prisma.MoveOptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MoveOptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MoveOptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoveOptionPayload>
          }
          aggregate: {
            args: Prisma.MoveOptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMoveOption>
          }
          groupBy: {
            args: Prisma.MoveOptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MoveOptionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MoveOptionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.MoveOptionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.MoveOptionCountArgs<ExtArgs>
            result: $Utils.Optional<MoveOptionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
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
   * Count Type Qoo10NormalProductCountOutputType
   */

  export type Qoo10NormalProductCountOutputType = {
    options: number
  }

  export type Qoo10NormalProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    options?: boolean | Qoo10NormalProductCountOutputTypeCountOptionsArgs
  }

  // Custom InputTypes
  /**
   * Qoo10NormalProductCountOutputType without action
   */
  export type Qoo10NormalProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProductCountOutputType
     */
    select?: Qoo10NormalProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Qoo10NormalProductCountOutputType without action
   */
  export type Qoo10NormalProductCountOutputTypeCountOptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NormalOptionWhereInput
  }


  /**
   * Count Type Qoo10MoveProductCountOutputType
   */

  export type Qoo10MoveProductCountOutputType = {
    MoveOption: number
  }

  export type Qoo10MoveProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    MoveOption?: boolean | Qoo10MoveProductCountOutputTypeCountMoveOptionArgs
  }

  // Custom InputTypes
  /**
   * Qoo10MoveProductCountOutputType without action
   */
  export type Qoo10MoveProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProductCountOutputType
     */
    select?: Qoo10MoveProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Qoo10MoveProductCountOutputType without action
   */
  export type Qoo10MoveProductCountOutputTypeCountMoveOptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoveOptionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Qoo10NormalProduct
   */

  export type AggregateQoo10NormalProduct = {
    _count: Qoo10NormalProductCountAggregateOutputType | null
    _avg: Qoo10NormalProductAvgAggregateOutputType | null
    _sum: Qoo10NormalProductSumAggregateOutputType | null
    _min: Qoo10NormalProductMinAggregateOutputType | null
    _max: Qoo10NormalProductMaxAggregateOutputType | null
  }

  export type Qoo10NormalProductAvgAggregateOutputType = {
    retailPrice: number | null
    itemPrice: number | null
    taxRate: number | null
    settlePrice: number | null
    itemQty: number | null
    desiredShippingDate: number | null
    weight: number | null
  }

  export type Qoo10NormalProductSumAggregateOutputType = {
    retailPrice: number | null
    itemPrice: number | null
    taxRate: number | null
    settlePrice: number | null
    itemQty: number | null
    desiredShippingDate: number | null
    weight: number | null
  }

  export type Qoo10NormalProductMinAggregateOutputType = {
    id: string | null
    itemCode: string | null
    companyId: string | null
    platformId: string | null
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string | null
    sellerCode: string | null
    itemStatus: string | null
    itemTitle: string | null
    promotionName: string | null
    mainCatCd: string | null
    mainCatNm: string | null
    firstSubCatCd: string | null
    firstSubCatNm: string | null
    secondSubCatCd: string | null
    secondSubCatNm: string | null
    drugType: string | null
    productionPlaceType: string | null
    productionPlace: string | null
    industrialCodeType: string | null
    industrialCode: string | null
    retailPrice: number | null
    itemPrice: number | null
    taxRate: number | null
    settlePrice: number | null
    itemQty: number | null
    expireDate: Date | null
    shippingNo: string | null
    modelNM: string | null
    manufacturerDate: string | null
    brandNo: string | null
    material: string | null
    adultYN: string | null
    contactInfo: string | null
    itemDetail: string | null
    imageUrl: string | null
    videoURL: string | null
    keyword: string | null
    listedDate: Date | null
    changedDate: Date | null
    lastFetchDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    availableDateType: string | null
    availableDateValue: string | null
    desiredShippingDate: number | null
    weight: number | null
    optionShippingNo1: string | null
    optionShippingNo2: string | null
  }

  export type Qoo10NormalProductMaxAggregateOutputType = {
    id: string | null
    itemCode: string | null
    companyId: string | null
    platformId: string | null
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string | null
    sellerCode: string | null
    itemStatus: string | null
    itemTitle: string | null
    promotionName: string | null
    mainCatCd: string | null
    mainCatNm: string | null
    firstSubCatCd: string | null
    firstSubCatNm: string | null
    secondSubCatCd: string | null
    secondSubCatNm: string | null
    drugType: string | null
    productionPlaceType: string | null
    productionPlace: string | null
    industrialCodeType: string | null
    industrialCode: string | null
    retailPrice: number | null
    itemPrice: number | null
    taxRate: number | null
    settlePrice: number | null
    itemQty: number | null
    expireDate: Date | null
    shippingNo: string | null
    modelNM: string | null
    manufacturerDate: string | null
    brandNo: string | null
    material: string | null
    adultYN: string | null
    contactInfo: string | null
    itemDetail: string | null
    imageUrl: string | null
    videoURL: string | null
    keyword: string | null
    listedDate: Date | null
    changedDate: Date | null
    lastFetchDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    availableDateType: string | null
    availableDateValue: string | null
    desiredShippingDate: number | null
    weight: number | null
    optionShippingNo1: string | null
    optionShippingNo2: string | null
  }

  export type Qoo10NormalProductCountAggregateOutputType = {
    id: number
    itemCode: number
    companyId: number
    platformId: number
    sellerId: number
    sellerAuthKey: number
    flag: number
    sellerCode: number
    itemStatus: number
    itemTitle: number
    promotionName: number
    mainCatCd: number
    mainCatNm: number
    firstSubCatCd: number
    firstSubCatNm: number
    secondSubCatCd: number
    secondSubCatNm: number
    drugType: number
    productionPlaceType: number
    productionPlace: number
    industrialCodeType: number
    industrialCode: number
    retailPrice: number
    itemPrice: number
    taxRate: number
    settlePrice: number
    itemQty: number
    expireDate: number
    shippingNo: number
    modelNM: number
    manufacturerDate: number
    brandNo: number
    material: number
    adultYN: number
    contactInfo: number
    itemDetail: number
    imageUrl: number
    videoURL: number
    keyword: number
    listedDate: number
    changedDate: number
    lastFetchDate: number
    createdAt: number
    updatedAt: number
    availableDateType: number
    availableDateValue: number
    desiredShippingDate: number
    weight: number
    optionShippingNo1: number
    optionShippingNo2: number
    _all: number
  }


  export type Qoo10NormalProductAvgAggregateInputType = {
    retailPrice?: true
    itemPrice?: true
    taxRate?: true
    settlePrice?: true
    itemQty?: true
    desiredShippingDate?: true
    weight?: true
  }

  export type Qoo10NormalProductSumAggregateInputType = {
    retailPrice?: true
    itemPrice?: true
    taxRate?: true
    settlePrice?: true
    itemQty?: true
    desiredShippingDate?: true
    weight?: true
  }

  export type Qoo10NormalProductMinAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    sellerCode?: true
    itemStatus?: true
    itemTitle?: true
    promotionName?: true
    mainCatCd?: true
    mainCatNm?: true
    firstSubCatCd?: true
    firstSubCatNm?: true
    secondSubCatCd?: true
    secondSubCatNm?: true
    drugType?: true
    productionPlaceType?: true
    productionPlace?: true
    industrialCodeType?: true
    industrialCode?: true
    retailPrice?: true
    itemPrice?: true
    taxRate?: true
    settlePrice?: true
    itemQty?: true
    expireDate?: true
    shippingNo?: true
    modelNM?: true
    manufacturerDate?: true
    brandNo?: true
    material?: true
    adultYN?: true
    contactInfo?: true
    itemDetail?: true
    imageUrl?: true
    videoURL?: true
    keyword?: true
    listedDate?: true
    changedDate?: true
    lastFetchDate?: true
    createdAt?: true
    updatedAt?: true
    availableDateType?: true
    availableDateValue?: true
    desiredShippingDate?: true
    weight?: true
    optionShippingNo1?: true
    optionShippingNo2?: true
  }

  export type Qoo10NormalProductMaxAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    sellerCode?: true
    itemStatus?: true
    itemTitle?: true
    promotionName?: true
    mainCatCd?: true
    mainCatNm?: true
    firstSubCatCd?: true
    firstSubCatNm?: true
    secondSubCatCd?: true
    secondSubCatNm?: true
    drugType?: true
    productionPlaceType?: true
    productionPlace?: true
    industrialCodeType?: true
    industrialCode?: true
    retailPrice?: true
    itemPrice?: true
    taxRate?: true
    settlePrice?: true
    itemQty?: true
    expireDate?: true
    shippingNo?: true
    modelNM?: true
    manufacturerDate?: true
    brandNo?: true
    material?: true
    adultYN?: true
    contactInfo?: true
    itemDetail?: true
    imageUrl?: true
    videoURL?: true
    keyword?: true
    listedDate?: true
    changedDate?: true
    lastFetchDate?: true
    createdAt?: true
    updatedAt?: true
    availableDateType?: true
    availableDateValue?: true
    desiredShippingDate?: true
    weight?: true
    optionShippingNo1?: true
    optionShippingNo2?: true
  }

  export type Qoo10NormalProductCountAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    sellerCode?: true
    itemStatus?: true
    itemTitle?: true
    promotionName?: true
    mainCatCd?: true
    mainCatNm?: true
    firstSubCatCd?: true
    firstSubCatNm?: true
    secondSubCatCd?: true
    secondSubCatNm?: true
    drugType?: true
    productionPlaceType?: true
    productionPlace?: true
    industrialCodeType?: true
    industrialCode?: true
    retailPrice?: true
    itemPrice?: true
    taxRate?: true
    settlePrice?: true
    itemQty?: true
    expireDate?: true
    shippingNo?: true
    modelNM?: true
    manufacturerDate?: true
    brandNo?: true
    material?: true
    adultYN?: true
    contactInfo?: true
    itemDetail?: true
    imageUrl?: true
    videoURL?: true
    keyword?: true
    listedDate?: true
    changedDate?: true
    lastFetchDate?: true
    createdAt?: true
    updatedAt?: true
    availableDateType?: true
    availableDateValue?: true
    desiredShippingDate?: true
    weight?: true
    optionShippingNo1?: true
    optionShippingNo2?: true
    _all?: true
  }

  export type Qoo10NormalProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Qoo10NormalProduct to aggregate.
     */
    where?: Qoo10NormalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10NormalProducts to fetch.
     */
    orderBy?: Qoo10NormalProductOrderByWithRelationInput | Qoo10NormalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Qoo10NormalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10NormalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10NormalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Qoo10NormalProducts
    **/
    _count?: true | Qoo10NormalProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Qoo10NormalProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Qoo10NormalProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Qoo10NormalProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Qoo10NormalProductMaxAggregateInputType
  }

  export type GetQoo10NormalProductAggregateType<T extends Qoo10NormalProductAggregateArgs> = {
        [P in keyof T & keyof AggregateQoo10NormalProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQoo10NormalProduct[P]>
      : GetScalarType<T[P], AggregateQoo10NormalProduct[P]>
  }




  export type Qoo10NormalProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Qoo10NormalProductWhereInput
    orderBy?: Qoo10NormalProductOrderByWithAggregationInput | Qoo10NormalProductOrderByWithAggregationInput[]
    by: Qoo10NormalProductScalarFieldEnum[] | Qoo10NormalProductScalarFieldEnum
    having?: Qoo10NormalProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Qoo10NormalProductCountAggregateInputType | true
    _avg?: Qoo10NormalProductAvgAggregateInputType
    _sum?: Qoo10NormalProductSumAggregateInputType
    _min?: Qoo10NormalProductMinAggregateInputType
    _max?: Qoo10NormalProductMaxAggregateInputType
  }

  export type Qoo10NormalProductGroupByOutputType = {
    id: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string
    sellerCode: string | null
    itemStatus: string | null
    itemTitle: string | null
    promotionName: string | null
    mainCatCd: string | null
    mainCatNm: string | null
    firstSubCatCd: string | null
    firstSubCatNm: string | null
    secondSubCatCd: string | null
    secondSubCatNm: string | null
    drugType: string | null
    productionPlaceType: string | null
    productionPlace: string | null
    industrialCodeType: string | null
    industrialCode: string | null
    retailPrice: number | null
    itemPrice: number | null
    taxRate: number | null
    settlePrice: number | null
    itemQty: number | null
    expireDate: Date | null
    shippingNo: string | null
    modelNM: string | null
    manufacturerDate: string | null
    brandNo: string | null
    material: string | null
    adultYN: string | null
    contactInfo: string | null
    itemDetail: string | null
    imageUrl: string | null
    videoURL: string | null
    keyword: string | null
    listedDate: Date | null
    changedDate: Date | null
    lastFetchDate: Date | null
    createdAt: Date
    updatedAt: Date
    availableDateType: string | null
    availableDateValue: string | null
    desiredShippingDate: number | null
    weight: number | null
    optionShippingNo1: string | null
    optionShippingNo2: string | null
    _count: Qoo10NormalProductCountAggregateOutputType | null
    _avg: Qoo10NormalProductAvgAggregateOutputType | null
    _sum: Qoo10NormalProductSumAggregateOutputType | null
    _min: Qoo10NormalProductMinAggregateOutputType | null
    _max: Qoo10NormalProductMaxAggregateOutputType | null
  }

  type GetQoo10NormalProductGroupByPayload<T extends Qoo10NormalProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Qoo10NormalProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Qoo10NormalProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Qoo10NormalProductGroupByOutputType[P]>
            : GetScalarType<T[P], Qoo10NormalProductGroupByOutputType[P]>
        }
      >
    >


  export type Qoo10NormalProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemCode?: boolean
    companyId?: boolean
    platformId?: boolean
    sellerId?: boolean
    sellerAuthKey?: boolean
    flag?: boolean
    sellerCode?: boolean
    itemStatus?: boolean
    itemTitle?: boolean
    promotionName?: boolean
    mainCatCd?: boolean
    mainCatNm?: boolean
    firstSubCatCd?: boolean
    firstSubCatNm?: boolean
    secondSubCatCd?: boolean
    secondSubCatNm?: boolean
    drugType?: boolean
    productionPlaceType?: boolean
    productionPlace?: boolean
    industrialCodeType?: boolean
    industrialCode?: boolean
    retailPrice?: boolean
    itemPrice?: boolean
    taxRate?: boolean
    settlePrice?: boolean
    itemQty?: boolean
    expireDate?: boolean
    shippingNo?: boolean
    modelNM?: boolean
    manufacturerDate?: boolean
    brandNo?: boolean
    material?: boolean
    adultYN?: boolean
    contactInfo?: boolean
    itemDetail?: boolean
    imageUrl?: boolean
    videoURL?: boolean
    keyword?: boolean
    listedDate?: boolean
    changedDate?: boolean
    lastFetchDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    availableDateType?: boolean
    availableDateValue?: boolean
    desiredShippingDate?: boolean
    weight?: boolean
    optionShippingNo1?: boolean
    optionShippingNo2?: boolean
    options?: boolean | Qoo10NormalProduct$optionsArgs<ExtArgs>
    _count?: boolean | Qoo10NormalProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qoo10NormalProduct"]>


  export type Qoo10NormalProductSelectScalar = {
    id?: boolean
    itemCode?: boolean
    companyId?: boolean
    platformId?: boolean
    sellerId?: boolean
    sellerAuthKey?: boolean
    flag?: boolean
    sellerCode?: boolean
    itemStatus?: boolean
    itemTitle?: boolean
    promotionName?: boolean
    mainCatCd?: boolean
    mainCatNm?: boolean
    firstSubCatCd?: boolean
    firstSubCatNm?: boolean
    secondSubCatCd?: boolean
    secondSubCatNm?: boolean
    drugType?: boolean
    productionPlaceType?: boolean
    productionPlace?: boolean
    industrialCodeType?: boolean
    industrialCode?: boolean
    retailPrice?: boolean
    itemPrice?: boolean
    taxRate?: boolean
    settlePrice?: boolean
    itemQty?: boolean
    expireDate?: boolean
    shippingNo?: boolean
    modelNM?: boolean
    manufacturerDate?: boolean
    brandNo?: boolean
    material?: boolean
    adultYN?: boolean
    contactInfo?: boolean
    itemDetail?: boolean
    imageUrl?: boolean
    videoURL?: boolean
    keyword?: boolean
    listedDate?: boolean
    changedDate?: boolean
    lastFetchDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    availableDateType?: boolean
    availableDateValue?: boolean
    desiredShippingDate?: boolean
    weight?: boolean
    optionShippingNo1?: boolean
    optionShippingNo2?: boolean
  }

  export type Qoo10NormalProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    options?: boolean | Qoo10NormalProduct$optionsArgs<ExtArgs>
    _count?: boolean | Qoo10NormalProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $Qoo10NormalProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Qoo10NormalProduct"
    objects: {
      options: Prisma.$NormalOptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemCode: string
      companyId: string
      platformId: string
      sellerId: string | null
      sellerAuthKey: string | null
      flag: string
      sellerCode: string | null
      itemStatus: string | null
      itemTitle: string | null
      promotionName: string | null
      mainCatCd: string | null
      mainCatNm: string | null
      firstSubCatCd: string | null
      firstSubCatNm: string | null
      secondSubCatCd: string | null
      secondSubCatNm: string | null
      drugType: string | null
      productionPlaceType: string | null
      productionPlace: string | null
      industrialCodeType: string | null
      industrialCode: string | null
      retailPrice: number | null
      itemPrice: number | null
      taxRate: number | null
      settlePrice: number | null
      itemQty: number | null
      expireDate: Date | null
      shippingNo: string | null
      modelNM: string | null
      manufacturerDate: string | null
      brandNo: string | null
      material: string | null
      adultYN: string | null
      contactInfo: string | null
      itemDetail: string | null
      imageUrl: string | null
      videoURL: string | null
      keyword: string | null
      listedDate: Date | null
      changedDate: Date | null
      lastFetchDate: Date | null
      createdAt: Date
      updatedAt: Date
      availableDateType: string | null
      availableDateValue: string | null
      desiredShippingDate: number | null
      weight: number | null
      optionShippingNo1: string | null
      optionShippingNo2: string | null
    }, ExtArgs["result"]["qoo10NormalProduct"]>
    composites: {}
  }

  type Qoo10NormalProductGetPayload<S extends boolean | null | undefined | Qoo10NormalProductDefaultArgs> = $Result.GetResult<Prisma.$Qoo10NormalProductPayload, S>

  type Qoo10NormalProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<Qoo10NormalProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Qoo10NormalProductCountAggregateInputType | true
    }

  export interface Qoo10NormalProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Qoo10NormalProduct'], meta: { name: 'Qoo10NormalProduct' } }
    /**
     * Find zero or one Qoo10NormalProduct that matches the filter.
     * @param {Qoo10NormalProductFindUniqueArgs} args - Arguments to find a Qoo10NormalProduct
     * @example
     * // Get one Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Qoo10NormalProductFindUniqueArgs>(args: SelectSubset<T, Qoo10NormalProductFindUniqueArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Qoo10NormalProduct that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {Qoo10NormalProductFindUniqueOrThrowArgs} args - Arguments to find a Qoo10NormalProduct
     * @example
     * // Get one Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Qoo10NormalProductFindUniqueOrThrowArgs>(args: SelectSubset<T, Qoo10NormalProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Qoo10NormalProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductFindFirstArgs} args - Arguments to find a Qoo10NormalProduct
     * @example
     * // Get one Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Qoo10NormalProductFindFirstArgs>(args?: SelectSubset<T, Qoo10NormalProductFindFirstArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Qoo10NormalProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductFindFirstOrThrowArgs} args - Arguments to find a Qoo10NormalProduct
     * @example
     * // Get one Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Qoo10NormalProductFindFirstOrThrowArgs>(args?: SelectSubset<T, Qoo10NormalProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Qoo10NormalProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Qoo10NormalProducts
     * const qoo10NormalProducts = await prisma.qoo10NormalProduct.findMany()
     * 
     * // Get first 10 Qoo10NormalProducts
     * const qoo10NormalProducts = await prisma.qoo10NormalProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qoo10NormalProductWithIdOnly = await prisma.qoo10NormalProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends Qoo10NormalProductFindManyArgs>(args?: SelectSubset<T, Qoo10NormalProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Qoo10NormalProduct.
     * @param {Qoo10NormalProductCreateArgs} args - Arguments to create a Qoo10NormalProduct.
     * @example
     * // Create one Qoo10NormalProduct
     * const Qoo10NormalProduct = await prisma.qoo10NormalProduct.create({
     *   data: {
     *     // ... data to create a Qoo10NormalProduct
     *   }
     * })
     * 
     */
    create<T extends Qoo10NormalProductCreateArgs>(args: SelectSubset<T, Qoo10NormalProductCreateArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Qoo10NormalProducts.
     * @param {Qoo10NormalProductCreateManyArgs} args - Arguments to create many Qoo10NormalProducts.
     * @example
     * // Create many Qoo10NormalProducts
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Qoo10NormalProductCreateManyArgs>(args?: SelectSubset<T, Qoo10NormalProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Qoo10NormalProduct.
     * @param {Qoo10NormalProductDeleteArgs} args - Arguments to delete one Qoo10NormalProduct.
     * @example
     * // Delete one Qoo10NormalProduct
     * const Qoo10NormalProduct = await prisma.qoo10NormalProduct.delete({
     *   where: {
     *     // ... filter to delete one Qoo10NormalProduct
     *   }
     * })
     * 
     */
    delete<T extends Qoo10NormalProductDeleteArgs>(args: SelectSubset<T, Qoo10NormalProductDeleteArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Qoo10NormalProduct.
     * @param {Qoo10NormalProductUpdateArgs} args - Arguments to update one Qoo10NormalProduct.
     * @example
     * // Update one Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Qoo10NormalProductUpdateArgs>(args: SelectSubset<T, Qoo10NormalProductUpdateArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Qoo10NormalProducts.
     * @param {Qoo10NormalProductDeleteManyArgs} args - Arguments to filter Qoo10NormalProducts to delete.
     * @example
     * // Delete a few Qoo10NormalProducts
     * const { count } = await prisma.qoo10NormalProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Qoo10NormalProductDeleteManyArgs>(args?: SelectSubset<T, Qoo10NormalProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Qoo10NormalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Qoo10NormalProducts
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Qoo10NormalProductUpdateManyArgs>(args: SelectSubset<T, Qoo10NormalProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Qoo10NormalProduct.
     * @param {Qoo10NormalProductUpsertArgs} args - Arguments to update or create a Qoo10NormalProduct.
     * @example
     * // Update or create a Qoo10NormalProduct
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.upsert({
     *   create: {
     *     // ... data to create a Qoo10NormalProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Qoo10NormalProduct we want to update
     *   }
     * })
     */
    upsert<T extends Qoo10NormalProductUpsertArgs>(args: SelectSubset<T, Qoo10NormalProductUpsertArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Qoo10NormalProducts that matches the filter.
     * @param {Qoo10NormalProductFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: Qoo10NormalProductFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Qoo10NormalProduct.
     * @param {Qoo10NormalProductAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const qoo10NormalProduct = await prisma.qoo10NormalProduct.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Qoo10NormalProductAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Qoo10NormalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductCountArgs} args - Arguments to filter Qoo10NormalProducts to count.
     * @example
     * // Count the number of Qoo10NormalProducts
     * const count = await prisma.qoo10NormalProduct.count({
     *   where: {
     *     // ... the filter for the Qoo10NormalProducts we want to count
     *   }
     * })
    **/
    count<T extends Qoo10NormalProductCountArgs>(
      args?: Subset<T, Qoo10NormalProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Qoo10NormalProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Qoo10NormalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Qoo10NormalProductAggregateArgs>(args: Subset<T, Qoo10NormalProductAggregateArgs>): Prisma.PrismaPromise<GetQoo10NormalProductAggregateType<T>>

    /**
     * Group by Qoo10NormalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10NormalProductGroupByArgs} args - Group by arguments.
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
      T extends Qoo10NormalProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Qoo10NormalProductGroupByArgs['orderBy'] }
        : { orderBy?: Qoo10NormalProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Qoo10NormalProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQoo10NormalProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Qoo10NormalProduct model
   */
  readonly fields: Qoo10NormalProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Qoo10NormalProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Qoo10NormalProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    options<T extends Qoo10NormalProduct$optionsArgs<ExtArgs> = {}>(args?: Subset<T, Qoo10NormalProduct$optionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Qoo10NormalProduct model
   */ 
  interface Qoo10NormalProductFieldRefs {
    readonly id: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly itemCode: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly companyId: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly platformId: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly sellerId: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly sellerAuthKey: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly flag: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly sellerCode: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly itemStatus: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly itemTitle: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly promotionName: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly mainCatCd: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly mainCatNm: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly firstSubCatCd: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly firstSubCatNm: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly secondSubCatCd: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly secondSubCatNm: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly drugType: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly productionPlaceType: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly productionPlace: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly industrialCodeType: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly industrialCode: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly retailPrice: FieldRef<"Qoo10NormalProduct", 'Float'>
    readonly itemPrice: FieldRef<"Qoo10NormalProduct", 'Float'>
    readonly taxRate: FieldRef<"Qoo10NormalProduct", 'Float'>
    readonly settlePrice: FieldRef<"Qoo10NormalProduct", 'Float'>
    readonly itemQty: FieldRef<"Qoo10NormalProduct", 'Int'>
    readonly expireDate: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly shippingNo: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly modelNM: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly manufacturerDate: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly brandNo: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly material: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly adultYN: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly contactInfo: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly itemDetail: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly imageUrl: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly videoURL: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly keyword: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly listedDate: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly changedDate: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly lastFetchDate: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly createdAt: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"Qoo10NormalProduct", 'DateTime'>
    readonly availableDateType: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly availableDateValue: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly desiredShippingDate: FieldRef<"Qoo10NormalProduct", 'Int'>
    readonly weight: FieldRef<"Qoo10NormalProduct", 'Float'>
    readonly optionShippingNo1: FieldRef<"Qoo10NormalProduct", 'String'>
    readonly optionShippingNo2: FieldRef<"Qoo10NormalProduct", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Qoo10NormalProduct findUnique
   */
  export type Qoo10NormalProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10NormalProduct to fetch.
     */
    where: Qoo10NormalProductWhereUniqueInput
  }

  /**
   * Qoo10NormalProduct findUniqueOrThrow
   */
  export type Qoo10NormalProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10NormalProduct to fetch.
     */
    where: Qoo10NormalProductWhereUniqueInput
  }

  /**
   * Qoo10NormalProduct findFirst
   */
  export type Qoo10NormalProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10NormalProduct to fetch.
     */
    where?: Qoo10NormalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10NormalProducts to fetch.
     */
    orderBy?: Qoo10NormalProductOrderByWithRelationInput | Qoo10NormalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Qoo10NormalProducts.
     */
    cursor?: Qoo10NormalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10NormalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10NormalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Qoo10NormalProducts.
     */
    distinct?: Qoo10NormalProductScalarFieldEnum | Qoo10NormalProductScalarFieldEnum[]
  }

  /**
   * Qoo10NormalProduct findFirstOrThrow
   */
  export type Qoo10NormalProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10NormalProduct to fetch.
     */
    where?: Qoo10NormalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10NormalProducts to fetch.
     */
    orderBy?: Qoo10NormalProductOrderByWithRelationInput | Qoo10NormalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Qoo10NormalProducts.
     */
    cursor?: Qoo10NormalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10NormalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10NormalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Qoo10NormalProducts.
     */
    distinct?: Qoo10NormalProductScalarFieldEnum | Qoo10NormalProductScalarFieldEnum[]
  }

  /**
   * Qoo10NormalProduct findMany
   */
  export type Qoo10NormalProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10NormalProducts to fetch.
     */
    where?: Qoo10NormalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10NormalProducts to fetch.
     */
    orderBy?: Qoo10NormalProductOrderByWithRelationInput | Qoo10NormalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Qoo10NormalProducts.
     */
    cursor?: Qoo10NormalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10NormalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10NormalProducts.
     */
    skip?: number
    distinct?: Qoo10NormalProductScalarFieldEnum | Qoo10NormalProductScalarFieldEnum[]
  }

  /**
   * Qoo10NormalProduct create
   */
  export type Qoo10NormalProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Qoo10NormalProduct.
     */
    data: XOR<Qoo10NormalProductCreateInput, Qoo10NormalProductUncheckedCreateInput>
  }

  /**
   * Qoo10NormalProduct createMany
   */
  export type Qoo10NormalProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Qoo10NormalProducts.
     */
    data: Qoo10NormalProductCreateManyInput | Qoo10NormalProductCreateManyInput[]
  }

  /**
   * Qoo10NormalProduct update
   */
  export type Qoo10NormalProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Qoo10NormalProduct.
     */
    data: XOR<Qoo10NormalProductUpdateInput, Qoo10NormalProductUncheckedUpdateInput>
    /**
     * Choose, which Qoo10NormalProduct to update.
     */
    where: Qoo10NormalProductWhereUniqueInput
  }

  /**
   * Qoo10NormalProduct updateMany
   */
  export type Qoo10NormalProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Qoo10NormalProducts.
     */
    data: XOR<Qoo10NormalProductUpdateManyMutationInput, Qoo10NormalProductUncheckedUpdateManyInput>
    /**
     * Filter which Qoo10NormalProducts to update
     */
    where?: Qoo10NormalProductWhereInput
  }

  /**
   * Qoo10NormalProduct upsert
   */
  export type Qoo10NormalProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Qoo10NormalProduct to update in case it exists.
     */
    where: Qoo10NormalProductWhereUniqueInput
    /**
     * In case the Qoo10NormalProduct found by the `where` argument doesn't exist, create a new Qoo10NormalProduct with this data.
     */
    create: XOR<Qoo10NormalProductCreateInput, Qoo10NormalProductUncheckedCreateInput>
    /**
     * In case the Qoo10NormalProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Qoo10NormalProductUpdateInput, Qoo10NormalProductUncheckedUpdateInput>
  }

  /**
   * Qoo10NormalProduct delete
   */
  export type Qoo10NormalProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
    /**
     * Filter which Qoo10NormalProduct to delete.
     */
    where: Qoo10NormalProductWhereUniqueInput
  }

  /**
   * Qoo10NormalProduct deleteMany
   */
  export type Qoo10NormalProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Qoo10NormalProducts to delete
     */
    where?: Qoo10NormalProductWhereInput
  }

  /**
   * Qoo10NormalProduct findRaw
   */
  export type Qoo10NormalProductFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Qoo10NormalProduct aggregateRaw
   */
  export type Qoo10NormalProductAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Qoo10NormalProduct.options
   */
  export type Qoo10NormalProduct$optionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    where?: NormalOptionWhereInput
    orderBy?: NormalOptionOrderByWithRelationInput | NormalOptionOrderByWithRelationInput[]
    cursor?: NormalOptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NormalOptionScalarFieldEnum | NormalOptionScalarFieldEnum[]
  }

  /**
   * Qoo10NormalProduct without action
   */
  export type Qoo10NormalProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10NormalProduct
     */
    select?: Qoo10NormalProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10NormalProductInclude<ExtArgs> | null
  }


  /**
   * Model Qoo10MoveProduct
   */

  export type AggregateQoo10MoveProduct = {
    _count: Qoo10MoveProductCountAggregateOutputType | null
    _avg: Qoo10MoveProductAvgAggregateOutputType | null
    _sum: Qoo10MoveProductSumAggregateOutputType | null
    _min: Qoo10MoveProductMinAggregateOutputType | null
    _max: Qoo10MoveProductMaxAggregateOutputType | null
  }

  export type Qoo10MoveProductAvgAggregateOutputType = {
    buyLimitQty: number | null
    desiredShippingDate: number | null
    itemPrice: number | null
    retailPrice: number | null
    weight: number | null
  }

  export type Qoo10MoveProductSumAggregateOutputType = {
    buyLimitQty: number | null
    desiredShippingDate: number | null
    itemPrice: number | null
    retailPrice: number | null
    weight: number | null
  }

  export type Qoo10MoveProductMinAggregateOutputType = {
    id: string | null
    itemCode: string | null
    companyId: string | null
    platformId: string | null
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string | null
    adultYN: string | null
    attributeInfo: string | null
    availableDateValue: string | null
    brandNo: string | null
    buyLimitType: string | null
    buyLimitDate: string | null
    buyLimitQty: number | null
    contactInfo: string | null
    desiredShippingDate: number | null
    expirationDateType: string | null
    expirationDateMFD: string | null
    expirationDatePAO: string | null
    expirationDateEXP: string | null
    expireDate: string | null
    imageOtherUrl: string | null
    industrialCode: string | null
    industrialCodeType: string | null
    itemDescription: string | null
    itemPrice: number | null
    itemSeriesName: string | null
    keyword: string | null
    manufactureDate: string | null
    materialInfo: string | null
    materialNumber: string | null
    modelNM: string | null
    optionMainimage: string | null
    optionQty: string | null
    optionSubimage: string | null
    optionType: string | null
    originCountryId: string | null
    originRegionId: string | null
    originOthers: string | null
    originType: string | null
    promotionName: string | null
    retailPrice: number | null
    seasonType: string | null
    secondSubCat: string | null
    sellerCode: string | null
    shippingNo: string | null
    sizetableType1: string | null
    sizetableType1Value: string | null
    sizetableType2: string | null
    sizetableType2Value: string | null
    sizetableType3: string | null
    sizetableType3Value: string | null
    styleNumber: string | null
    tpoNumber: string | null
    videoNumber: string | null
    washinginfoFit: string | null
    washinginfoLining: string | null
    washinginfoSeethrough: string | null
    washinginfoStretch: string | null
    washinginfoThickness: string | null
    washinginfoWashing: string | null
    weight: number | null
    taxRate: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastFetchDate: Date | null
  }

  export type Qoo10MoveProductMaxAggregateOutputType = {
    id: string | null
    itemCode: string | null
    companyId: string | null
    platformId: string | null
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string | null
    adultYN: string | null
    attributeInfo: string | null
    availableDateValue: string | null
    brandNo: string | null
    buyLimitType: string | null
    buyLimitDate: string | null
    buyLimitQty: number | null
    contactInfo: string | null
    desiredShippingDate: number | null
    expirationDateType: string | null
    expirationDateMFD: string | null
    expirationDatePAO: string | null
    expirationDateEXP: string | null
    expireDate: string | null
    imageOtherUrl: string | null
    industrialCode: string | null
    industrialCodeType: string | null
    itemDescription: string | null
    itemPrice: number | null
    itemSeriesName: string | null
    keyword: string | null
    manufactureDate: string | null
    materialInfo: string | null
    materialNumber: string | null
    modelNM: string | null
    optionMainimage: string | null
    optionQty: string | null
    optionSubimage: string | null
    optionType: string | null
    originCountryId: string | null
    originRegionId: string | null
    originOthers: string | null
    originType: string | null
    promotionName: string | null
    retailPrice: number | null
    seasonType: string | null
    secondSubCat: string | null
    sellerCode: string | null
    shippingNo: string | null
    sizetableType1: string | null
    sizetableType1Value: string | null
    sizetableType2: string | null
    sizetableType2Value: string | null
    sizetableType3: string | null
    sizetableType3Value: string | null
    styleNumber: string | null
    tpoNumber: string | null
    videoNumber: string | null
    washinginfoFit: string | null
    washinginfoLining: string | null
    washinginfoSeethrough: string | null
    washinginfoStretch: string | null
    washinginfoThickness: string | null
    washinginfoWashing: string | null
    weight: number | null
    taxRate: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastFetchDate: Date | null
  }

  export type Qoo10MoveProductCountAggregateOutputType = {
    id: number
    itemCode: number
    companyId: number
    platformId: number
    sellerId: number
    sellerAuthKey: number
    flag: number
    adultYN: number
    attributeInfo: number
    availableDateValue: number
    brandNo: number
    buyLimitType: number
    buyLimitDate: number
    buyLimitQty: number
    contactInfo: number
    desiredShippingDate: number
    expirationDateType: number
    expirationDateMFD: number
    expirationDatePAO: number
    expirationDateEXP: number
    expireDate: number
    imageOtherUrl: number
    industrialCode: number
    industrialCodeType: number
    itemDescription: number
    itemPrice: number
    itemSeriesName: number
    keyword: number
    manufactureDate: number
    materialInfo: number
    materialNumber: number
    modelNM: number
    optionMainimage: number
    optionQty: number
    optionSubimage: number
    optionType: number
    originCountryId: number
    originRegionId: number
    originOthers: number
    originType: number
    promotionName: number
    retailPrice: number
    seasonType: number
    secondSubCat: number
    sellerCode: number
    shippingNo: number
    sizetableType1: number
    sizetableType1Value: number
    sizetableType2: number
    sizetableType2Value: number
    sizetableType3: number
    sizetableType3Value: number
    styleNumber: number
    tpoNumber: number
    videoNumber: number
    washinginfoFit: number
    washinginfoLining: number
    washinginfoSeethrough: number
    washinginfoStretch: number
    washinginfoThickness: number
    washinginfoWashing: number
    weight: number
    taxRate: number
    createdAt: number
    updatedAt: number
    lastFetchDate: number
    _all: number
  }


  export type Qoo10MoveProductAvgAggregateInputType = {
    buyLimitQty?: true
    desiredShippingDate?: true
    itemPrice?: true
    retailPrice?: true
    weight?: true
  }

  export type Qoo10MoveProductSumAggregateInputType = {
    buyLimitQty?: true
    desiredShippingDate?: true
    itemPrice?: true
    retailPrice?: true
    weight?: true
  }

  export type Qoo10MoveProductMinAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    adultYN?: true
    attributeInfo?: true
    availableDateValue?: true
    brandNo?: true
    buyLimitType?: true
    buyLimitDate?: true
    buyLimitQty?: true
    contactInfo?: true
    desiredShippingDate?: true
    expirationDateType?: true
    expirationDateMFD?: true
    expirationDatePAO?: true
    expirationDateEXP?: true
    expireDate?: true
    imageOtherUrl?: true
    industrialCode?: true
    industrialCodeType?: true
    itemDescription?: true
    itemPrice?: true
    itemSeriesName?: true
    keyword?: true
    manufactureDate?: true
    materialInfo?: true
    materialNumber?: true
    modelNM?: true
    optionMainimage?: true
    optionQty?: true
    optionSubimage?: true
    optionType?: true
    originCountryId?: true
    originRegionId?: true
    originOthers?: true
    originType?: true
    promotionName?: true
    retailPrice?: true
    seasonType?: true
    secondSubCat?: true
    sellerCode?: true
    shippingNo?: true
    sizetableType1?: true
    sizetableType1Value?: true
    sizetableType2?: true
    sizetableType2Value?: true
    sizetableType3?: true
    sizetableType3Value?: true
    styleNumber?: true
    tpoNumber?: true
    videoNumber?: true
    washinginfoFit?: true
    washinginfoLining?: true
    washinginfoSeethrough?: true
    washinginfoStretch?: true
    washinginfoThickness?: true
    washinginfoWashing?: true
    weight?: true
    taxRate?: true
    createdAt?: true
    updatedAt?: true
    lastFetchDate?: true
  }

  export type Qoo10MoveProductMaxAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    adultYN?: true
    attributeInfo?: true
    availableDateValue?: true
    brandNo?: true
    buyLimitType?: true
    buyLimitDate?: true
    buyLimitQty?: true
    contactInfo?: true
    desiredShippingDate?: true
    expirationDateType?: true
    expirationDateMFD?: true
    expirationDatePAO?: true
    expirationDateEXP?: true
    expireDate?: true
    imageOtherUrl?: true
    industrialCode?: true
    industrialCodeType?: true
    itemDescription?: true
    itemPrice?: true
    itemSeriesName?: true
    keyword?: true
    manufactureDate?: true
    materialInfo?: true
    materialNumber?: true
    modelNM?: true
    optionMainimage?: true
    optionQty?: true
    optionSubimage?: true
    optionType?: true
    originCountryId?: true
    originRegionId?: true
    originOthers?: true
    originType?: true
    promotionName?: true
    retailPrice?: true
    seasonType?: true
    secondSubCat?: true
    sellerCode?: true
    shippingNo?: true
    sizetableType1?: true
    sizetableType1Value?: true
    sizetableType2?: true
    sizetableType2Value?: true
    sizetableType3?: true
    sizetableType3Value?: true
    styleNumber?: true
    tpoNumber?: true
    videoNumber?: true
    washinginfoFit?: true
    washinginfoLining?: true
    washinginfoSeethrough?: true
    washinginfoStretch?: true
    washinginfoThickness?: true
    washinginfoWashing?: true
    weight?: true
    taxRate?: true
    createdAt?: true
    updatedAt?: true
    lastFetchDate?: true
  }

  export type Qoo10MoveProductCountAggregateInputType = {
    id?: true
    itemCode?: true
    companyId?: true
    platformId?: true
    sellerId?: true
    sellerAuthKey?: true
    flag?: true
    adultYN?: true
    attributeInfo?: true
    availableDateValue?: true
    brandNo?: true
    buyLimitType?: true
    buyLimitDate?: true
    buyLimitQty?: true
    contactInfo?: true
    desiredShippingDate?: true
    expirationDateType?: true
    expirationDateMFD?: true
    expirationDatePAO?: true
    expirationDateEXP?: true
    expireDate?: true
    imageOtherUrl?: true
    industrialCode?: true
    industrialCodeType?: true
    itemDescription?: true
    itemPrice?: true
    itemSeriesName?: true
    keyword?: true
    manufactureDate?: true
    materialInfo?: true
    materialNumber?: true
    modelNM?: true
    optionMainimage?: true
    optionQty?: true
    optionSubimage?: true
    optionType?: true
    originCountryId?: true
    originRegionId?: true
    originOthers?: true
    originType?: true
    promotionName?: true
    retailPrice?: true
    seasonType?: true
    secondSubCat?: true
    sellerCode?: true
    shippingNo?: true
    sizetableType1?: true
    sizetableType1Value?: true
    sizetableType2?: true
    sizetableType2Value?: true
    sizetableType3?: true
    sizetableType3Value?: true
    styleNumber?: true
    tpoNumber?: true
    videoNumber?: true
    washinginfoFit?: true
    washinginfoLining?: true
    washinginfoSeethrough?: true
    washinginfoStretch?: true
    washinginfoThickness?: true
    washinginfoWashing?: true
    weight?: true
    taxRate?: true
    createdAt?: true
    updatedAt?: true
    lastFetchDate?: true
    _all?: true
  }

  export type Qoo10MoveProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Qoo10MoveProduct to aggregate.
     */
    where?: Qoo10MoveProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10MoveProducts to fetch.
     */
    orderBy?: Qoo10MoveProductOrderByWithRelationInput | Qoo10MoveProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Qoo10MoveProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10MoveProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10MoveProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Qoo10MoveProducts
    **/
    _count?: true | Qoo10MoveProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Qoo10MoveProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Qoo10MoveProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Qoo10MoveProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Qoo10MoveProductMaxAggregateInputType
  }

  export type GetQoo10MoveProductAggregateType<T extends Qoo10MoveProductAggregateArgs> = {
        [P in keyof T & keyof AggregateQoo10MoveProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQoo10MoveProduct[P]>
      : GetScalarType<T[P], AggregateQoo10MoveProduct[P]>
  }




  export type Qoo10MoveProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Qoo10MoveProductWhereInput
    orderBy?: Qoo10MoveProductOrderByWithAggregationInput | Qoo10MoveProductOrderByWithAggregationInput[]
    by: Qoo10MoveProductScalarFieldEnum[] | Qoo10MoveProductScalarFieldEnum
    having?: Qoo10MoveProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Qoo10MoveProductCountAggregateInputType | true
    _avg?: Qoo10MoveProductAvgAggregateInputType
    _sum?: Qoo10MoveProductSumAggregateInputType
    _min?: Qoo10MoveProductMinAggregateInputType
    _max?: Qoo10MoveProductMaxAggregateInputType
  }

  export type Qoo10MoveProductGroupByOutputType = {
    id: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId: string | null
    sellerAuthKey: string | null
    flag: string
    adultYN: string | null
    attributeInfo: string | null
    availableDateValue: string | null
    brandNo: string | null
    buyLimitType: string | null
    buyLimitDate: string | null
    buyLimitQty: number | null
    contactInfo: string | null
    desiredShippingDate: number | null
    expirationDateType: string | null
    expirationDateMFD: string | null
    expirationDatePAO: string | null
    expirationDateEXP: string | null
    expireDate: string | null
    imageOtherUrl: string | null
    industrialCode: string | null
    industrialCodeType: string | null
    itemDescription: string | null
    itemPrice: number | null
    itemSeriesName: string | null
    keyword: string | null
    manufactureDate: string | null
    materialInfo: string | null
    materialNumber: string | null
    modelNM: string | null
    optionMainimage: string | null
    optionQty: string | null
    optionSubimage: string | null
    optionType: string | null
    originCountryId: string | null
    originRegionId: string | null
    originOthers: string | null
    originType: string | null
    promotionName: string | null
    retailPrice: number | null
    seasonType: string | null
    secondSubCat: string | null
    sellerCode: string | null
    shippingNo: string | null
    sizetableType1: string | null
    sizetableType1Value: string | null
    sizetableType2: string | null
    sizetableType2Value: string | null
    sizetableType3: string | null
    sizetableType3Value: string | null
    styleNumber: string | null
    tpoNumber: string | null
    videoNumber: string | null
    washinginfoFit: string | null
    washinginfoLining: string | null
    washinginfoSeethrough: string | null
    washinginfoStretch: string | null
    washinginfoThickness: string | null
    washinginfoWashing: string | null
    weight: number | null
    taxRate: string | null
    createdAt: Date
    updatedAt: Date
    lastFetchDate: Date | null
    _count: Qoo10MoveProductCountAggregateOutputType | null
    _avg: Qoo10MoveProductAvgAggregateOutputType | null
    _sum: Qoo10MoveProductSumAggregateOutputType | null
    _min: Qoo10MoveProductMinAggregateOutputType | null
    _max: Qoo10MoveProductMaxAggregateOutputType | null
  }

  type GetQoo10MoveProductGroupByPayload<T extends Qoo10MoveProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Qoo10MoveProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Qoo10MoveProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Qoo10MoveProductGroupByOutputType[P]>
            : GetScalarType<T[P], Qoo10MoveProductGroupByOutputType[P]>
        }
      >
    >


  export type Qoo10MoveProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemCode?: boolean
    companyId?: boolean
    platformId?: boolean
    sellerId?: boolean
    sellerAuthKey?: boolean
    flag?: boolean
    adultYN?: boolean
    attributeInfo?: boolean
    availableDateValue?: boolean
    brandNo?: boolean
    buyLimitType?: boolean
    buyLimitDate?: boolean
    buyLimitQty?: boolean
    contactInfo?: boolean
    desiredShippingDate?: boolean
    expirationDateType?: boolean
    expirationDateMFD?: boolean
    expirationDatePAO?: boolean
    expirationDateEXP?: boolean
    expireDate?: boolean
    imageOtherUrl?: boolean
    industrialCode?: boolean
    industrialCodeType?: boolean
    itemDescription?: boolean
    itemPrice?: boolean
    itemSeriesName?: boolean
    keyword?: boolean
    manufactureDate?: boolean
    materialInfo?: boolean
    materialNumber?: boolean
    modelNM?: boolean
    optionMainimage?: boolean
    optionQty?: boolean
    optionSubimage?: boolean
    optionType?: boolean
    originCountryId?: boolean
    originRegionId?: boolean
    originOthers?: boolean
    originType?: boolean
    promotionName?: boolean
    retailPrice?: boolean
    seasonType?: boolean
    secondSubCat?: boolean
    sellerCode?: boolean
    shippingNo?: boolean
    sizetableType1?: boolean
    sizetableType1Value?: boolean
    sizetableType2?: boolean
    sizetableType2Value?: boolean
    sizetableType3?: boolean
    sizetableType3Value?: boolean
    styleNumber?: boolean
    tpoNumber?: boolean
    videoNumber?: boolean
    washinginfoFit?: boolean
    washinginfoLining?: boolean
    washinginfoSeethrough?: boolean
    washinginfoStretch?: boolean
    washinginfoThickness?: boolean
    washinginfoWashing?: boolean
    weight?: boolean
    taxRate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastFetchDate?: boolean
    MoveOption?: boolean | Qoo10MoveProduct$MoveOptionArgs<ExtArgs>
    _count?: boolean | Qoo10MoveProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qoo10MoveProduct"]>


  export type Qoo10MoveProductSelectScalar = {
    id?: boolean
    itemCode?: boolean
    companyId?: boolean
    platformId?: boolean
    sellerId?: boolean
    sellerAuthKey?: boolean
    flag?: boolean
    adultYN?: boolean
    attributeInfo?: boolean
    availableDateValue?: boolean
    brandNo?: boolean
    buyLimitType?: boolean
    buyLimitDate?: boolean
    buyLimitQty?: boolean
    contactInfo?: boolean
    desiredShippingDate?: boolean
    expirationDateType?: boolean
    expirationDateMFD?: boolean
    expirationDatePAO?: boolean
    expirationDateEXP?: boolean
    expireDate?: boolean
    imageOtherUrl?: boolean
    industrialCode?: boolean
    industrialCodeType?: boolean
    itemDescription?: boolean
    itemPrice?: boolean
    itemSeriesName?: boolean
    keyword?: boolean
    manufactureDate?: boolean
    materialInfo?: boolean
    materialNumber?: boolean
    modelNM?: boolean
    optionMainimage?: boolean
    optionQty?: boolean
    optionSubimage?: boolean
    optionType?: boolean
    originCountryId?: boolean
    originRegionId?: boolean
    originOthers?: boolean
    originType?: boolean
    promotionName?: boolean
    retailPrice?: boolean
    seasonType?: boolean
    secondSubCat?: boolean
    sellerCode?: boolean
    shippingNo?: boolean
    sizetableType1?: boolean
    sizetableType1Value?: boolean
    sizetableType2?: boolean
    sizetableType2Value?: boolean
    sizetableType3?: boolean
    sizetableType3Value?: boolean
    styleNumber?: boolean
    tpoNumber?: boolean
    videoNumber?: boolean
    washinginfoFit?: boolean
    washinginfoLining?: boolean
    washinginfoSeethrough?: boolean
    washinginfoStretch?: boolean
    washinginfoThickness?: boolean
    washinginfoWashing?: boolean
    weight?: boolean
    taxRate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastFetchDate?: boolean
  }

  export type Qoo10MoveProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    MoveOption?: boolean | Qoo10MoveProduct$MoveOptionArgs<ExtArgs>
    _count?: boolean | Qoo10MoveProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $Qoo10MoveProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Qoo10MoveProduct"
    objects: {
      MoveOption: Prisma.$MoveOptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemCode: string
      companyId: string
      platformId: string
      sellerId: string | null
      sellerAuthKey: string | null
      flag: string
      adultYN: string | null
      attributeInfo: string | null
      availableDateValue: string | null
      brandNo: string | null
      buyLimitType: string | null
      buyLimitDate: string | null
      buyLimitQty: number | null
      contactInfo: string | null
      desiredShippingDate: number | null
      expirationDateType: string | null
      expirationDateMFD: string | null
      expirationDatePAO: string | null
      expirationDateEXP: string | null
      expireDate: string | null
      imageOtherUrl: string | null
      industrialCode: string | null
      industrialCodeType: string | null
      itemDescription: string | null
      itemPrice: number | null
      itemSeriesName: string | null
      keyword: string | null
      manufactureDate: string | null
      materialInfo: string | null
      materialNumber: string | null
      modelNM: string | null
      optionMainimage: string | null
      optionQty: string | null
      optionSubimage: string | null
      optionType: string | null
      originCountryId: string | null
      originRegionId: string | null
      originOthers: string | null
      originType: string | null
      promotionName: string | null
      retailPrice: number | null
      seasonType: string | null
      secondSubCat: string | null
      sellerCode: string | null
      shippingNo: string | null
      sizetableType1: string | null
      sizetableType1Value: string | null
      sizetableType2: string | null
      sizetableType2Value: string | null
      sizetableType3: string | null
      sizetableType3Value: string | null
      styleNumber: string | null
      tpoNumber: string | null
      videoNumber: string | null
      washinginfoFit: string | null
      washinginfoLining: string | null
      washinginfoSeethrough: string | null
      washinginfoStretch: string | null
      washinginfoThickness: string | null
      washinginfoWashing: string | null
      weight: number | null
      taxRate: string | null
      createdAt: Date
      updatedAt: Date
      lastFetchDate: Date | null
    }, ExtArgs["result"]["qoo10MoveProduct"]>
    composites: {}
  }

  type Qoo10MoveProductGetPayload<S extends boolean | null | undefined | Qoo10MoveProductDefaultArgs> = $Result.GetResult<Prisma.$Qoo10MoveProductPayload, S>

  type Qoo10MoveProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<Qoo10MoveProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Qoo10MoveProductCountAggregateInputType | true
    }

  export interface Qoo10MoveProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Qoo10MoveProduct'], meta: { name: 'Qoo10MoveProduct' } }
    /**
     * Find zero or one Qoo10MoveProduct that matches the filter.
     * @param {Qoo10MoveProductFindUniqueArgs} args - Arguments to find a Qoo10MoveProduct
     * @example
     * // Get one Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Qoo10MoveProductFindUniqueArgs>(args: SelectSubset<T, Qoo10MoveProductFindUniqueArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Qoo10MoveProduct that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {Qoo10MoveProductFindUniqueOrThrowArgs} args - Arguments to find a Qoo10MoveProduct
     * @example
     * // Get one Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Qoo10MoveProductFindUniqueOrThrowArgs>(args: SelectSubset<T, Qoo10MoveProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Qoo10MoveProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductFindFirstArgs} args - Arguments to find a Qoo10MoveProduct
     * @example
     * // Get one Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Qoo10MoveProductFindFirstArgs>(args?: SelectSubset<T, Qoo10MoveProductFindFirstArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Qoo10MoveProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductFindFirstOrThrowArgs} args - Arguments to find a Qoo10MoveProduct
     * @example
     * // Get one Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Qoo10MoveProductFindFirstOrThrowArgs>(args?: SelectSubset<T, Qoo10MoveProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Qoo10MoveProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Qoo10MoveProducts
     * const qoo10MoveProducts = await prisma.qoo10MoveProduct.findMany()
     * 
     * // Get first 10 Qoo10MoveProducts
     * const qoo10MoveProducts = await prisma.qoo10MoveProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qoo10MoveProductWithIdOnly = await prisma.qoo10MoveProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends Qoo10MoveProductFindManyArgs>(args?: SelectSubset<T, Qoo10MoveProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Qoo10MoveProduct.
     * @param {Qoo10MoveProductCreateArgs} args - Arguments to create a Qoo10MoveProduct.
     * @example
     * // Create one Qoo10MoveProduct
     * const Qoo10MoveProduct = await prisma.qoo10MoveProduct.create({
     *   data: {
     *     // ... data to create a Qoo10MoveProduct
     *   }
     * })
     * 
     */
    create<T extends Qoo10MoveProductCreateArgs>(args: SelectSubset<T, Qoo10MoveProductCreateArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Qoo10MoveProducts.
     * @param {Qoo10MoveProductCreateManyArgs} args - Arguments to create many Qoo10MoveProducts.
     * @example
     * // Create many Qoo10MoveProducts
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Qoo10MoveProductCreateManyArgs>(args?: SelectSubset<T, Qoo10MoveProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Qoo10MoveProduct.
     * @param {Qoo10MoveProductDeleteArgs} args - Arguments to delete one Qoo10MoveProduct.
     * @example
     * // Delete one Qoo10MoveProduct
     * const Qoo10MoveProduct = await prisma.qoo10MoveProduct.delete({
     *   where: {
     *     // ... filter to delete one Qoo10MoveProduct
     *   }
     * })
     * 
     */
    delete<T extends Qoo10MoveProductDeleteArgs>(args: SelectSubset<T, Qoo10MoveProductDeleteArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Qoo10MoveProduct.
     * @param {Qoo10MoveProductUpdateArgs} args - Arguments to update one Qoo10MoveProduct.
     * @example
     * // Update one Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Qoo10MoveProductUpdateArgs>(args: SelectSubset<T, Qoo10MoveProductUpdateArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Qoo10MoveProducts.
     * @param {Qoo10MoveProductDeleteManyArgs} args - Arguments to filter Qoo10MoveProducts to delete.
     * @example
     * // Delete a few Qoo10MoveProducts
     * const { count } = await prisma.qoo10MoveProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Qoo10MoveProductDeleteManyArgs>(args?: SelectSubset<T, Qoo10MoveProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Qoo10MoveProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Qoo10MoveProducts
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Qoo10MoveProductUpdateManyArgs>(args: SelectSubset<T, Qoo10MoveProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Qoo10MoveProduct.
     * @param {Qoo10MoveProductUpsertArgs} args - Arguments to update or create a Qoo10MoveProduct.
     * @example
     * // Update or create a Qoo10MoveProduct
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.upsert({
     *   create: {
     *     // ... data to create a Qoo10MoveProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Qoo10MoveProduct we want to update
     *   }
     * })
     */
    upsert<T extends Qoo10MoveProductUpsertArgs>(args: SelectSubset<T, Qoo10MoveProductUpsertArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Qoo10MoveProducts that matches the filter.
     * @param {Qoo10MoveProductFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: Qoo10MoveProductFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Qoo10MoveProduct.
     * @param {Qoo10MoveProductAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const qoo10MoveProduct = await prisma.qoo10MoveProduct.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Qoo10MoveProductAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Qoo10MoveProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductCountArgs} args - Arguments to filter Qoo10MoveProducts to count.
     * @example
     * // Count the number of Qoo10MoveProducts
     * const count = await prisma.qoo10MoveProduct.count({
     *   where: {
     *     // ... the filter for the Qoo10MoveProducts we want to count
     *   }
     * })
    **/
    count<T extends Qoo10MoveProductCountArgs>(
      args?: Subset<T, Qoo10MoveProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Qoo10MoveProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Qoo10MoveProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Qoo10MoveProductAggregateArgs>(args: Subset<T, Qoo10MoveProductAggregateArgs>): Prisma.PrismaPromise<GetQoo10MoveProductAggregateType<T>>

    /**
     * Group by Qoo10MoveProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Qoo10MoveProductGroupByArgs} args - Group by arguments.
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
      T extends Qoo10MoveProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Qoo10MoveProductGroupByArgs['orderBy'] }
        : { orderBy?: Qoo10MoveProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Qoo10MoveProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQoo10MoveProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Qoo10MoveProduct model
   */
  readonly fields: Qoo10MoveProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Qoo10MoveProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Qoo10MoveProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    MoveOption<T extends Qoo10MoveProduct$MoveOptionArgs<ExtArgs> = {}>(args?: Subset<T, Qoo10MoveProduct$MoveOptionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Qoo10MoveProduct model
   */ 
  interface Qoo10MoveProductFieldRefs {
    readonly id: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly itemCode: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly companyId: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly platformId: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sellerId: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sellerAuthKey: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly flag: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly adultYN: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly attributeInfo: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly availableDateValue: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly brandNo: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly buyLimitType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly buyLimitDate: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly buyLimitQty: FieldRef<"Qoo10MoveProduct", 'Int'>
    readonly contactInfo: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly desiredShippingDate: FieldRef<"Qoo10MoveProduct", 'Int'>
    readonly expirationDateType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly expirationDateMFD: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly expirationDatePAO: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly expirationDateEXP: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly expireDate: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly imageOtherUrl: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly industrialCode: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly industrialCodeType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly itemDescription: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly itemPrice: FieldRef<"Qoo10MoveProduct", 'Float'>
    readonly itemSeriesName: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly keyword: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly manufactureDate: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly materialInfo: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly materialNumber: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly modelNM: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly optionMainimage: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly optionQty: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly optionSubimage: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly optionType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly originCountryId: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly originRegionId: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly originOthers: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly originType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly promotionName: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly retailPrice: FieldRef<"Qoo10MoveProduct", 'Float'>
    readonly seasonType: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly secondSubCat: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sellerCode: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly shippingNo: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType1: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType1Value: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType2: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType2Value: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType3: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly sizetableType3Value: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly styleNumber: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly tpoNumber: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly videoNumber: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoFit: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoLining: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoSeethrough: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoStretch: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoThickness: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly washinginfoWashing: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly weight: FieldRef<"Qoo10MoveProduct", 'Float'>
    readonly taxRate: FieldRef<"Qoo10MoveProduct", 'String'>
    readonly createdAt: FieldRef<"Qoo10MoveProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"Qoo10MoveProduct", 'DateTime'>
    readonly lastFetchDate: FieldRef<"Qoo10MoveProduct", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Qoo10MoveProduct findUnique
   */
  export type Qoo10MoveProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10MoveProduct to fetch.
     */
    where: Qoo10MoveProductWhereUniqueInput
  }

  /**
   * Qoo10MoveProduct findUniqueOrThrow
   */
  export type Qoo10MoveProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10MoveProduct to fetch.
     */
    where: Qoo10MoveProductWhereUniqueInput
  }

  /**
   * Qoo10MoveProduct findFirst
   */
  export type Qoo10MoveProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10MoveProduct to fetch.
     */
    where?: Qoo10MoveProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10MoveProducts to fetch.
     */
    orderBy?: Qoo10MoveProductOrderByWithRelationInput | Qoo10MoveProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Qoo10MoveProducts.
     */
    cursor?: Qoo10MoveProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10MoveProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10MoveProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Qoo10MoveProducts.
     */
    distinct?: Qoo10MoveProductScalarFieldEnum | Qoo10MoveProductScalarFieldEnum[]
  }

  /**
   * Qoo10MoveProduct findFirstOrThrow
   */
  export type Qoo10MoveProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10MoveProduct to fetch.
     */
    where?: Qoo10MoveProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10MoveProducts to fetch.
     */
    orderBy?: Qoo10MoveProductOrderByWithRelationInput | Qoo10MoveProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Qoo10MoveProducts.
     */
    cursor?: Qoo10MoveProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10MoveProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10MoveProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Qoo10MoveProducts.
     */
    distinct?: Qoo10MoveProductScalarFieldEnum | Qoo10MoveProductScalarFieldEnum[]
  }

  /**
   * Qoo10MoveProduct findMany
   */
  export type Qoo10MoveProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter, which Qoo10MoveProducts to fetch.
     */
    where?: Qoo10MoveProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Qoo10MoveProducts to fetch.
     */
    orderBy?: Qoo10MoveProductOrderByWithRelationInput | Qoo10MoveProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Qoo10MoveProducts.
     */
    cursor?: Qoo10MoveProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Qoo10MoveProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Qoo10MoveProducts.
     */
    skip?: number
    distinct?: Qoo10MoveProductScalarFieldEnum | Qoo10MoveProductScalarFieldEnum[]
  }

  /**
   * Qoo10MoveProduct create
   */
  export type Qoo10MoveProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Qoo10MoveProduct.
     */
    data: XOR<Qoo10MoveProductCreateInput, Qoo10MoveProductUncheckedCreateInput>
  }

  /**
   * Qoo10MoveProduct createMany
   */
  export type Qoo10MoveProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Qoo10MoveProducts.
     */
    data: Qoo10MoveProductCreateManyInput | Qoo10MoveProductCreateManyInput[]
  }

  /**
   * Qoo10MoveProduct update
   */
  export type Qoo10MoveProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Qoo10MoveProduct.
     */
    data: XOR<Qoo10MoveProductUpdateInput, Qoo10MoveProductUncheckedUpdateInput>
    /**
     * Choose, which Qoo10MoveProduct to update.
     */
    where: Qoo10MoveProductWhereUniqueInput
  }

  /**
   * Qoo10MoveProduct updateMany
   */
  export type Qoo10MoveProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Qoo10MoveProducts.
     */
    data: XOR<Qoo10MoveProductUpdateManyMutationInput, Qoo10MoveProductUncheckedUpdateManyInput>
    /**
     * Filter which Qoo10MoveProducts to update
     */
    where?: Qoo10MoveProductWhereInput
  }

  /**
   * Qoo10MoveProduct upsert
   */
  export type Qoo10MoveProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Qoo10MoveProduct to update in case it exists.
     */
    where: Qoo10MoveProductWhereUniqueInput
    /**
     * In case the Qoo10MoveProduct found by the `where` argument doesn't exist, create a new Qoo10MoveProduct with this data.
     */
    create: XOR<Qoo10MoveProductCreateInput, Qoo10MoveProductUncheckedCreateInput>
    /**
     * In case the Qoo10MoveProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Qoo10MoveProductUpdateInput, Qoo10MoveProductUncheckedUpdateInput>
  }

  /**
   * Qoo10MoveProduct delete
   */
  export type Qoo10MoveProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
    /**
     * Filter which Qoo10MoveProduct to delete.
     */
    where: Qoo10MoveProductWhereUniqueInput
  }

  /**
   * Qoo10MoveProduct deleteMany
   */
  export type Qoo10MoveProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Qoo10MoveProducts to delete
     */
    where?: Qoo10MoveProductWhereInput
  }

  /**
   * Qoo10MoveProduct findRaw
   */
  export type Qoo10MoveProductFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Qoo10MoveProduct aggregateRaw
   */
  export type Qoo10MoveProductAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Qoo10MoveProduct.MoveOption
   */
  export type Qoo10MoveProduct$MoveOptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    where?: MoveOptionWhereInput
    orderBy?: MoveOptionOrderByWithRelationInput | MoveOptionOrderByWithRelationInput[]
    cursor?: MoveOptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MoveOptionScalarFieldEnum | MoveOptionScalarFieldEnum[]
  }

  /**
   * Qoo10MoveProduct without action
   */
  export type Qoo10MoveProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Qoo10MoveProduct
     */
    select?: Qoo10MoveProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Qoo10MoveProductInclude<ExtArgs> | null
  }


  /**
   * Model NormalOption
   */

  export type AggregateNormalOption = {
    _count: NormalOptionCountAggregateOutputType | null
    _avg: NormalOptionAvgAggregateOutputType | null
    _sum: NormalOptionSumAggregateOutputType | null
    _min: NormalOptionMinAggregateOutputType | null
    _max: NormalOptionMaxAggregateOutputType | null
  }

  export type NormalOptionAvgAggregateOutputType = {
    price: number | null
    qty: number | null
  }

  export type NormalOptionSumAggregateOutputType = {
    price: number | null
    qty: number | null
  }

  export type NormalOptionMinAggregateOutputType = {
    id: string | null
    productId: string | null
    name1: string | null
    value1: string | null
    name2: string | null
    value2: string | null
    name3: string | null
    value3: string | null
    name4: string | null
    value4: string | null
    name5: string | null
    value5: string | null
    price: number | null
    qty: number | null
    itemTypeCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NormalOptionMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    name1: string | null
    value1: string | null
    name2: string | null
    value2: string | null
    name3: string | null
    value3: string | null
    name4: string | null
    value4: string | null
    name5: string | null
    value5: string | null
    price: number | null
    qty: number | null
    itemTypeCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NormalOptionCountAggregateOutputType = {
    id: number
    productId: number
    name1: number
    value1: number
    name2: number
    value2: number
    name3: number
    value3: number
    name4: number
    value4: number
    name5: number
    value5: number
    price: number
    qty: number
    itemTypeCode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NormalOptionAvgAggregateInputType = {
    price?: true
    qty?: true
  }

  export type NormalOptionSumAggregateInputType = {
    price?: true
    qty?: true
  }

  export type NormalOptionMinAggregateInputType = {
    id?: true
    productId?: true
    name1?: true
    value1?: true
    name2?: true
    value2?: true
    name3?: true
    value3?: true
    name4?: true
    value4?: true
    name5?: true
    value5?: true
    price?: true
    qty?: true
    itemTypeCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NormalOptionMaxAggregateInputType = {
    id?: true
    productId?: true
    name1?: true
    value1?: true
    name2?: true
    value2?: true
    name3?: true
    value3?: true
    name4?: true
    value4?: true
    name5?: true
    value5?: true
    price?: true
    qty?: true
    itemTypeCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NormalOptionCountAggregateInputType = {
    id?: true
    productId?: true
    name1?: true
    value1?: true
    name2?: true
    value2?: true
    name3?: true
    value3?: true
    name4?: true
    value4?: true
    name5?: true
    value5?: true
    price?: true
    qty?: true
    itemTypeCode?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NormalOptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NormalOption to aggregate.
     */
    where?: NormalOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NormalOptions to fetch.
     */
    orderBy?: NormalOptionOrderByWithRelationInput | NormalOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NormalOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NormalOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NormalOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NormalOptions
    **/
    _count?: true | NormalOptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NormalOptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NormalOptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NormalOptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NormalOptionMaxAggregateInputType
  }

  export type GetNormalOptionAggregateType<T extends NormalOptionAggregateArgs> = {
        [P in keyof T & keyof AggregateNormalOption]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNormalOption[P]>
      : GetScalarType<T[P], AggregateNormalOption[P]>
  }




  export type NormalOptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NormalOptionWhereInput
    orderBy?: NormalOptionOrderByWithAggregationInput | NormalOptionOrderByWithAggregationInput[]
    by: NormalOptionScalarFieldEnum[] | NormalOptionScalarFieldEnum
    having?: NormalOptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NormalOptionCountAggregateInputType | true
    _avg?: NormalOptionAvgAggregateInputType
    _sum?: NormalOptionSumAggregateInputType
    _min?: NormalOptionMinAggregateInputType
    _max?: NormalOptionMaxAggregateInputType
  }

  export type NormalOptionGroupByOutputType = {
    id: string
    productId: string
    name1: string | null
    value1: string | null
    name2: string | null
    value2: string | null
    name3: string | null
    value3: string | null
    name4: string | null
    value4: string | null
    name5: string | null
    value5: string | null
    price: number | null
    qty: number | null
    itemTypeCode: string | null
    createdAt: Date
    updatedAt: Date
    _count: NormalOptionCountAggregateOutputType | null
    _avg: NormalOptionAvgAggregateOutputType | null
    _sum: NormalOptionSumAggregateOutputType | null
    _min: NormalOptionMinAggregateOutputType | null
    _max: NormalOptionMaxAggregateOutputType | null
  }

  type GetNormalOptionGroupByPayload<T extends NormalOptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NormalOptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NormalOptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NormalOptionGroupByOutputType[P]>
            : GetScalarType<T[P], NormalOptionGroupByOutputType[P]>
        }
      >
    >


  export type NormalOptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    name1?: boolean
    value1?: boolean
    name2?: boolean
    value2?: boolean
    name3?: boolean
    value3?: boolean
    name4?: boolean
    value4?: boolean
    name5?: boolean
    value5?: boolean
    price?: boolean
    qty?: boolean
    itemTypeCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | Qoo10NormalProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["normalOption"]>


  export type NormalOptionSelectScalar = {
    id?: boolean
    productId?: boolean
    name1?: boolean
    value1?: boolean
    name2?: boolean
    value2?: boolean
    name3?: boolean
    value3?: boolean
    name4?: boolean
    value4?: boolean
    name5?: boolean
    value5?: boolean
    price?: boolean
    qty?: boolean
    itemTypeCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NormalOptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | Qoo10NormalProductDefaultArgs<ExtArgs>
  }

  export type $NormalOptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NormalOption"
    objects: {
      product: Prisma.$Qoo10NormalProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      name1: string | null
      value1: string | null
      name2: string | null
      value2: string | null
      name3: string | null
      value3: string | null
      name4: string | null
      value4: string | null
      name5: string | null
      value5: string | null
      price: number | null
      qty: number | null
      itemTypeCode: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["normalOption"]>
    composites: {}
  }

  type NormalOptionGetPayload<S extends boolean | null | undefined | NormalOptionDefaultArgs> = $Result.GetResult<Prisma.$NormalOptionPayload, S>

  type NormalOptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NormalOptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NormalOptionCountAggregateInputType | true
    }

  export interface NormalOptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NormalOption'], meta: { name: 'NormalOption' } }
    /**
     * Find zero or one NormalOption that matches the filter.
     * @param {NormalOptionFindUniqueArgs} args - Arguments to find a NormalOption
     * @example
     * // Get one NormalOption
     * const normalOption = await prisma.normalOption.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NormalOptionFindUniqueArgs>(args: SelectSubset<T, NormalOptionFindUniqueArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NormalOption that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NormalOptionFindUniqueOrThrowArgs} args - Arguments to find a NormalOption
     * @example
     * // Get one NormalOption
     * const normalOption = await prisma.normalOption.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NormalOptionFindUniqueOrThrowArgs>(args: SelectSubset<T, NormalOptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NormalOption that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionFindFirstArgs} args - Arguments to find a NormalOption
     * @example
     * // Get one NormalOption
     * const normalOption = await prisma.normalOption.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NormalOptionFindFirstArgs>(args?: SelectSubset<T, NormalOptionFindFirstArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NormalOption that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionFindFirstOrThrowArgs} args - Arguments to find a NormalOption
     * @example
     * // Get one NormalOption
     * const normalOption = await prisma.normalOption.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NormalOptionFindFirstOrThrowArgs>(args?: SelectSubset<T, NormalOptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NormalOptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NormalOptions
     * const normalOptions = await prisma.normalOption.findMany()
     * 
     * // Get first 10 NormalOptions
     * const normalOptions = await prisma.normalOption.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const normalOptionWithIdOnly = await prisma.normalOption.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NormalOptionFindManyArgs>(args?: SelectSubset<T, NormalOptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NormalOption.
     * @param {NormalOptionCreateArgs} args - Arguments to create a NormalOption.
     * @example
     * // Create one NormalOption
     * const NormalOption = await prisma.normalOption.create({
     *   data: {
     *     // ... data to create a NormalOption
     *   }
     * })
     * 
     */
    create<T extends NormalOptionCreateArgs>(args: SelectSubset<T, NormalOptionCreateArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NormalOptions.
     * @param {NormalOptionCreateManyArgs} args - Arguments to create many NormalOptions.
     * @example
     * // Create many NormalOptions
     * const normalOption = await prisma.normalOption.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NormalOptionCreateManyArgs>(args?: SelectSubset<T, NormalOptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NormalOption.
     * @param {NormalOptionDeleteArgs} args - Arguments to delete one NormalOption.
     * @example
     * // Delete one NormalOption
     * const NormalOption = await prisma.normalOption.delete({
     *   where: {
     *     // ... filter to delete one NormalOption
     *   }
     * })
     * 
     */
    delete<T extends NormalOptionDeleteArgs>(args: SelectSubset<T, NormalOptionDeleteArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NormalOption.
     * @param {NormalOptionUpdateArgs} args - Arguments to update one NormalOption.
     * @example
     * // Update one NormalOption
     * const normalOption = await prisma.normalOption.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NormalOptionUpdateArgs>(args: SelectSubset<T, NormalOptionUpdateArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NormalOptions.
     * @param {NormalOptionDeleteManyArgs} args - Arguments to filter NormalOptions to delete.
     * @example
     * // Delete a few NormalOptions
     * const { count } = await prisma.normalOption.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NormalOptionDeleteManyArgs>(args?: SelectSubset<T, NormalOptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NormalOptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NormalOptions
     * const normalOption = await prisma.normalOption.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NormalOptionUpdateManyArgs>(args: SelectSubset<T, NormalOptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NormalOption.
     * @param {NormalOptionUpsertArgs} args - Arguments to update or create a NormalOption.
     * @example
     * // Update or create a NormalOption
     * const normalOption = await prisma.normalOption.upsert({
     *   create: {
     *     // ... data to create a NormalOption
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NormalOption we want to update
     *   }
     * })
     */
    upsert<T extends NormalOptionUpsertArgs>(args: SelectSubset<T, NormalOptionUpsertArgs<ExtArgs>>): Prisma__NormalOptionClient<$Result.GetResult<Prisma.$NormalOptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more NormalOptions that matches the filter.
     * @param {NormalOptionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const normalOption = await prisma.normalOption.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: NormalOptionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a NormalOption.
     * @param {NormalOptionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const normalOption = await prisma.normalOption.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: NormalOptionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of NormalOptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionCountArgs} args - Arguments to filter NormalOptions to count.
     * @example
     * // Count the number of NormalOptions
     * const count = await prisma.normalOption.count({
     *   where: {
     *     // ... the filter for the NormalOptions we want to count
     *   }
     * })
    **/
    count<T extends NormalOptionCountArgs>(
      args?: Subset<T, NormalOptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NormalOptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NormalOption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NormalOptionAggregateArgs>(args: Subset<T, NormalOptionAggregateArgs>): Prisma.PrismaPromise<GetNormalOptionAggregateType<T>>

    /**
     * Group by NormalOption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NormalOptionGroupByArgs} args - Group by arguments.
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
      T extends NormalOptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NormalOptionGroupByArgs['orderBy'] }
        : { orderBy?: NormalOptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NormalOptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNormalOptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NormalOption model
   */
  readonly fields: NormalOptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NormalOption.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NormalOptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends Qoo10NormalProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, Qoo10NormalProductDefaultArgs<ExtArgs>>): Prisma__Qoo10NormalProductClient<$Result.GetResult<Prisma.$Qoo10NormalProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NormalOption model
   */ 
  interface NormalOptionFieldRefs {
    readonly id: FieldRef<"NormalOption", 'String'>
    readonly productId: FieldRef<"NormalOption", 'String'>
    readonly name1: FieldRef<"NormalOption", 'String'>
    readonly value1: FieldRef<"NormalOption", 'String'>
    readonly name2: FieldRef<"NormalOption", 'String'>
    readonly value2: FieldRef<"NormalOption", 'String'>
    readonly name3: FieldRef<"NormalOption", 'String'>
    readonly value3: FieldRef<"NormalOption", 'String'>
    readonly name4: FieldRef<"NormalOption", 'String'>
    readonly value4: FieldRef<"NormalOption", 'String'>
    readonly name5: FieldRef<"NormalOption", 'String'>
    readonly value5: FieldRef<"NormalOption", 'String'>
    readonly price: FieldRef<"NormalOption", 'Float'>
    readonly qty: FieldRef<"NormalOption", 'Int'>
    readonly itemTypeCode: FieldRef<"NormalOption", 'String'>
    readonly createdAt: FieldRef<"NormalOption", 'DateTime'>
    readonly updatedAt: FieldRef<"NormalOption", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NormalOption findUnique
   */
  export type NormalOptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter, which NormalOption to fetch.
     */
    where: NormalOptionWhereUniqueInput
  }

  /**
   * NormalOption findUniqueOrThrow
   */
  export type NormalOptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter, which NormalOption to fetch.
     */
    where: NormalOptionWhereUniqueInput
  }

  /**
   * NormalOption findFirst
   */
  export type NormalOptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter, which NormalOption to fetch.
     */
    where?: NormalOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NormalOptions to fetch.
     */
    orderBy?: NormalOptionOrderByWithRelationInput | NormalOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NormalOptions.
     */
    cursor?: NormalOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NormalOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NormalOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NormalOptions.
     */
    distinct?: NormalOptionScalarFieldEnum | NormalOptionScalarFieldEnum[]
  }

  /**
   * NormalOption findFirstOrThrow
   */
  export type NormalOptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter, which NormalOption to fetch.
     */
    where?: NormalOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NormalOptions to fetch.
     */
    orderBy?: NormalOptionOrderByWithRelationInput | NormalOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NormalOptions.
     */
    cursor?: NormalOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NormalOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NormalOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NormalOptions.
     */
    distinct?: NormalOptionScalarFieldEnum | NormalOptionScalarFieldEnum[]
  }

  /**
   * NormalOption findMany
   */
  export type NormalOptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter, which NormalOptions to fetch.
     */
    where?: NormalOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NormalOptions to fetch.
     */
    orderBy?: NormalOptionOrderByWithRelationInput | NormalOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NormalOptions.
     */
    cursor?: NormalOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NormalOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NormalOptions.
     */
    skip?: number
    distinct?: NormalOptionScalarFieldEnum | NormalOptionScalarFieldEnum[]
  }

  /**
   * NormalOption create
   */
  export type NormalOptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * The data needed to create a NormalOption.
     */
    data: XOR<NormalOptionCreateInput, NormalOptionUncheckedCreateInput>
  }

  /**
   * NormalOption createMany
   */
  export type NormalOptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NormalOptions.
     */
    data: NormalOptionCreateManyInput | NormalOptionCreateManyInput[]
  }

  /**
   * NormalOption update
   */
  export type NormalOptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * The data needed to update a NormalOption.
     */
    data: XOR<NormalOptionUpdateInput, NormalOptionUncheckedUpdateInput>
    /**
     * Choose, which NormalOption to update.
     */
    where: NormalOptionWhereUniqueInput
  }

  /**
   * NormalOption updateMany
   */
  export type NormalOptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NormalOptions.
     */
    data: XOR<NormalOptionUpdateManyMutationInput, NormalOptionUncheckedUpdateManyInput>
    /**
     * Filter which NormalOptions to update
     */
    where?: NormalOptionWhereInput
  }

  /**
   * NormalOption upsert
   */
  export type NormalOptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * The filter to search for the NormalOption to update in case it exists.
     */
    where: NormalOptionWhereUniqueInput
    /**
     * In case the NormalOption found by the `where` argument doesn't exist, create a new NormalOption with this data.
     */
    create: XOR<NormalOptionCreateInput, NormalOptionUncheckedCreateInput>
    /**
     * In case the NormalOption was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NormalOptionUpdateInput, NormalOptionUncheckedUpdateInput>
  }

  /**
   * NormalOption delete
   */
  export type NormalOptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
    /**
     * Filter which NormalOption to delete.
     */
    where: NormalOptionWhereUniqueInput
  }

  /**
   * NormalOption deleteMany
   */
  export type NormalOptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NormalOptions to delete
     */
    where?: NormalOptionWhereInput
  }

  /**
   * NormalOption findRaw
   */
  export type NormalOptionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * NormalOption aggregateRaw
   */
  export type NormalOptionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * NormalOption without action
   */
  export type NormalOptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NormalOption
     */
    select?: NormalOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NormalOptionInclude<ExtArgs> | null
  }


  /**
   * Model MoveOption
   */

  export type AggregateMoveOption = {
    _count: MoveOptionCountAggregateOutputType | null
    _avg: MoveOptionAvgAggregateOutputType | null
    _sum: MoveOptionSumAggregateOutputType | null
    _min: MoveOptionMinAggregateOutputType | null
    _max: MoveOptionMaxAggregateOutputType | null
  }

  export type MoveOptionAvgAggregateOutputType = {
    qty: number | null
    price: number | null
  }

  export type MoveOptionSumAggregateOutputType = {
    qty: number | null
    price: number | null
  }

  export type MoveOptionMinAggregateOutputType = {
    id: string | null
    productId: string | null
    color: string | null
    size: string | null
    qty: number | null
    itemTypeCode: string | null
    price: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoveOptionMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    color: string | null
    size: string | null
    qty: number | null
    itemTypeCode: string | null
    price: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoveOptionCountAggregateOutputType = {
    id: number
    productId: number
    color: number
    size: number
    qty: number
    itemTypeCode: number
    price: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MoveOptionAvgAggregateInputType = {
    qty?: true
    price?: true
  }

  export type MoveOptionSumAggregateInputType = {
    qty?: true
    price?: true
  }

  export type MoveOptionMinAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    size?: true
    qty?: true
    itemTypeCode?: true
    price?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoveOptionMaxAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    size?: true
    qty?: true
    itemTypeCode?: true
    price?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoveOptionCountAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    size?: true
    qty?: true
    itemTypeCode?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MoveOptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoveOption to aggregate.
     */
    where?: MoveOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoveOptions to fetch.
     */
    orderBy?: MoveOptionOrderByWithRelationInput | MoveOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MoveOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoveOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoveOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MoveOptions
    **/
    _count?: true | MoveOptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MoveOptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MoveOptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MoveOptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MoveOptionMaxAggregateInputType
  }

  export type GetMoveOptionAggregateType<T extends MoveOptionAggregateArgs> = {
        [P in keyof T & keyof AggregateMoveOption]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMoveOption[P]>
      : GetScalarType<T[P], AggregateMoveOption[P]>
  }




  export type MoveOptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoveOptionWhereInput
    orderBy?: MoveOptionOrderByWithAggregationInput | MoveOptionOrderByWithAggregationInput[]
    by: MoveOptionScalarFieldEnum[] | MoveOptionScalarFieldEnum
    having?: MoveOptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MoveOptionCountAggregateInputType | true
    _avg?: MoveOptionAvgAggregateInputType
    _sum?: MoveOptionSumAggregateInputType
    _min?: MoveOptionMinAggregateInputType
    _max?: MoveOptionMaxAggregateInputType
  }

  export type MoveOptionGroupByOutputType = {
    id: string
    productId: string
    color: string
    size: string
    qty: number
    itemTypeCode: string | null
    price: number | null
    createdAt: Date
    updatedAt: Date
    _count: MoveOptionCountAggregateOutputType | null
    _avg: MoveOptionAvgAggregateOutputType | null
    _sum: MoveOptionSumAggregateOutputType | null
    _min: MoveOptionMinAggregateOutputType | null
    _max: MoveOptionMaxAggregateOutputType | null
  }

  type GetMoveOptionGroupByPayload<T extends MoveOptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MoveOptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MoveOptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MoveOptionGroupByOutputType[P]>
            : GetScalarType<T[P], MoveOptionGroupByOutputType[P]>
        }
      >
    >


  export type MoveOptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    color?: boolean
    size?: boolean
    qty?: boolean
    itemTypeCode?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | Qoo10MoveProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moveOption"]>


  export type MoveOptionSelectScalar = {
    id?: boolean
    productId?: boolean
    color?: boolean
    size?: boolean
    qty?: boolean
    itemTypeCode?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MoveOptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | Qoo10MoveProductDefaultArgs<ExtArgs>
  }

  export type $MoveOptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MoveOption"
    objects: {
      product: Prisma.$Qoo10MoveProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      color: string
      size: string
      qty: number
      itemTypeCode: string | null
      price: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["moveOption"]>
    composites: {}
  }

  type MoveOptionGetPayload<S extends boolean | null | undefined | MoveOptionDefaultArgs> = $Result.GetResult<Prisma.$MoveOptionPayload, S>

  type MoveOptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MoveOptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MoveOptionCountAggregateInputType | true
    }

  export interface MoveOptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MoveOption'], meta: { name: 'MoveOption' } }
    /**
     * Find zero or one MoveOption that matches the filter.
     * @param {MoveOptionFindUniqueArgs} args - Arguments to find a MoveOption
     * @example
     * // Get one MoveOption
     * const moveOption = await prisma.moveOption.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MoveOptionFindUniqueArgs>(args: SelectSubset<T, MoveOptionFindUniqueArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MoveOption that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MoveOptionFindUniqueOrThrowArgs} args - Arguments to find a MoveOption
     * @example
     * // Get one MoveOption
     * const moveOption = await prisma.moveOption.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MoveOptionFindUniqueOrThrowArgs>(args: SelectSubset<T, MoveOptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MoveOption that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionFindFirstArgs} args - Arguments to find a MoveOption
     * @example
     * // Get one MoveOption
     * const moveOption = await prisma.moveOption.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MoveOptionFindFirstArgs>(args?: SelectSubset<T, MoveOptionFindFirstArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MoveOption that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionFindFirstOrThrowArgs} args - Arguments to find a MoveOption
     * @example
     * // Get one MoveOption
     * const moveOption = await prisma.moveOption.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MoveOptionFindFirstOrThrowArgs>(args?: SelectSubset<T, MoveOptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MoveOptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MoveOptions
     * const moveOptions = await prisma.moveOption.findMany()
     * 
     * // Get first 10 MoveOptions
     * const moveOptions = await prisma.moveOption.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moveOptionWithIdOnly = await prisma.moveOption.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MoveOptionFindManyArgs>(args?: SelectSubset<T, MoveOptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MoveOption.
     * @param {MoveOptionCreateArgs} args - Arguments to create a MoveOption.
     * @example
     * // Create one MoveOption
     * const MoveOption = await prisma.moveOption.create({
     *   data: {
     *     // ... data to create a MoveOption
     *   }
     * })
     * 
     */
    create<T extends MoveOptionCreateArgs>(args: SelectSubset<T, MoveOptionCreateArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MoveOptions.
     * @param {MoveOptionCreateManyArgs} args - Arguments to create many MoveOptions.
     * @example
     * // Create many MoveOptions
     * const moveOption = await prisma.moveOption.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MoveOptionCreateManyArgs>(args?: SelectSubset<T, MoveOptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MoveOption.
     * @param {MoveOptionDeleteArgs} args - Arguments to delete one MoveOption.
     * @example
     * // Delete one MoveOption
     * const MoveOption = await prisma.moveOption.delete({
     *   where: {
     *     // ... filter to delete one MoveOption
     *   }
     * })
     * 
     */
    delete<T extends MoveOptionDeleteArgs>(args: SelectSubset<T, MoveOptionDeleteArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MoveOption.
     * @param {MoveOptionUpdateArgs} args - Arguments to update one MoveOption.
     * @example
     * // Update one MoveOption
     * const moveOption = await prisma.moveOption.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MoveOptionUpdateArgs>(args: SelectSubset<T, MoveOptionUpdateArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MoveOptions.
     * @param {MoveOptionDeleteManyArgs} args - Arguments to filter MoveOptions to delete.
     * @example
     * // Delete a few MoveOptions
     * const { count } = await prisma.moveOption.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MoveOptionDeleteManyArgs>(args?: SelectSubset<T, MoveOptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoveOptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MoveOptions
     * const moveOption = await prisma.moveOption.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MoveOptionUpdateManyArgs>(args: SelectSubset<T, MoveOptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MoveOption.
     * @param {MoveOptionUpsertArgs} args - Arguments to update or create a MoveOption.
     * @example
     * // Update or create a MoveOption
     * const moveOption = await prisma.moveOption.upsert({
     *   create: {
     *     // ... data to create a MoveOption
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MoveOption we want to update
     *   }
     * })
     */
    upsert<T extends MoveOptionUpsertArgs>(args: SelectSubset<T, MoveOptionUpsertArgs<ExtArgs>>): Prisma__MoveOptionClient<$Result.GetResult<Prisma.$MoveOptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more MoveOptions that matches the filter.
     * @param {MoveOptionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const moveOption = await prisma.moveOption.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: MoveOptionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MoveOption.
     * @param {MoveOptionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const moveOption = await prisma.moveOption.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: MoveOptionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of MoveOptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionCountArgs} args - Arguments to filter MoveOptions to count.
     * @example
     * // Count the number of MoveOptions
     * const count = await prisma.moveOption.count({
     *   where: {
     *     // ... the filter for the MoveOptions we want to count
     *   }
     * })
    **/
    count<T extends MoveOptionCountArgs>(
      args?: Subset<T, MoveOptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MoveOptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MoveOption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MoveOptionAggregateArgs>(args: Subset<T, MoveOptionAggregateArgs>): Prisma.PrismaPromise<GetMoveOptionAggregateType<T>>

    /**
     * Group by MoveOption.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoveOptionGroupByArgs} args - Group by arguments.
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
      T extends MoveOptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MoveOptionGroupByArgs['orderBy'] }
        : { orderBy?: MoveOptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MoveOptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMoveOptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MoveOption model
   */
  readonly fields: MoveOptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MoveOption.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MoveOptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends Qoo10MoveProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, Qoo10MoveProductDefaultArgs<ExtArgs>>): Prisma__Qoo10MoveProductClient<$Result.GetResult<Prisma.$Qoo10MoveProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MoveOption model
   */ 
  interface MoveOptionFieldRefs {
    readonly id: FieldRef<"MoveOption", 'String'>
    readonly productId: FieldRef<"MoveOption", 'String'>
    readonly color: FieldRef<"MoveOption", 'String'>
    readonly size: FieldRef<"MoveOption", 'String'>
    readonly qty: FieldRef<"MoveOption", 'Int'>
    readonly itemTypeCode: FieldRef<"MoveOption", 'String'>
    readonly price: FieldRef<"MoveOption", 'Float'>
    readonly createdAt: FieldRef<"MoveOption", 'DateTime'>
    readonly updatedAt: FieldRef<"MoveOption", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MoveOption findUnique
   */
  export type MoveOptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter, which MoveOption to fetch.
     */
    where: MoveOptionWhereUniqueInput
  }

  /**
   * MoveOption findUniqueOrThrow
   */
  export type MoveOptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter, which MoveOption to fetch.
     */
    where: MoveOptionWhereUniqueInput
  }

  /**
   * MoveOption findFirst
   */
  export type MoveOptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter, which MoveOption to fetch.
     */
    where?: MoveOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoveOptions to fetch.
     */
    orderBy?: MoveOptionOrderByWithRelationInput | MoveOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoveOptions.
     */
    cursor?: MoveOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoveOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoveOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoveOptions.
     */
    distinct?: MoveOptionScalarFieldEnum | MoveOptionScalarFieldEnum[]
  }

  /**
   * MoveOption findFirstOrThrow
   */
  export type MoveOptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter, which MoveOption to fetch.
     */
    where?: MoveOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoveOptions to fetch.
     */
    orderBy?: MoveOptionOrderByWithRelationInput | MoveOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoveOptions.
     */
    cursor?: MoveOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoveOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoveOptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoveOptions.
     */
    distinct?: MoveOptionScalarFieldEnum | MoveOptionScalarFieldEnum[]
  }

  /**
   * MoveOption findMany
   */
  export type MoveOptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter, which MoveOptions to fetch.
     */
    where?: MoveOptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoveOptions to fetch.
     */
    orderBy?: MoveOptionOrderByWithRelationInput | MoveOptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MoveOptions.
     */
    cursor?: MoveOptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoveOptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoveOptions.
     */
    skip?: number
    distinct?: MoveOptionScalarFieldEnum | MoveOptionScalarFieldEnum[]
  }

  /**
   * MoveOption create
   */
  export type MoveOptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * The data needed to create a MoveOption.
     */
    data: XOR<MoveOptionCreateInput, MoveOptionUncheckedCreateInput>
  }

  /**
   * MoveOption createMany
   */
  export type MoveOptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MoveOptions.
     */
    data: MoveOptionCreateManyInput | MoveOptionCreateManyInput[]
  }

  /**
   * MoveOption update
   */
  export type MoveOptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * The data needed to update a MoveOption.
     */
    data: XOR<MoveOptionUpdateInput, MoveOptionUncheckedUpdateInput>
    /**
     * Choose, which MoveOption to update.
     */
    where: MoveOptionWhereUniqueInput
  }

  /**
   * MoveOption updateMany
   */
  export type MoveOptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MoveOptions.
     */
    data: XOR<MoveOptionUpdateManyMutationInput, MoveOptionUncheckedUpdateManyInput>
    /**
     * Filter which MoveOptions to update
     */
    where?: MoveOptionWhereInput
  }

  /**
   * MoveOption upsert
   */
  export type MoveOptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * The filter to search for the MoveOption to update in case it exists.
     */
    where: MoveOptionWhereUniqueInput
    /**
     * In case the MoveOption found by the `where` argument doesn't exist, create a new MoveOption with this data.
     */
    create: XOR<MoveOptionCreateInput, MoveOptionUncheckedCreateInput>
    /**
     * In case the MoveOption was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MoveOptionUpdateInput, MoveOptionUncheckedUpdateInput>
  }

  /**
   * MoveOption delete
   */
  export type MoveOptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
    /**
     * Filter which MoveOption to delete.
     */
    where: MoveOptionWhereUniqueInput
  }

  /**
   * MoveOption deleteMany
   */
  export type MoveOptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoveOptions to delete
     */
    where?: MoveOptionWhereInput
  }

  /**
   * MoveOption findRaw
   */
  export type MoveOptionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MoveOption aggregateRaw
   */
  export type MoveOptionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MoveOption without action
   */
  export type MoveOptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoveOption
     */
    select?: MoveOptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoveOptionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const Qoo10NormalProductScalarFieldEnum: {
    id: 'id',
    itemCode: 'itemCode',
    companyId: 'companyId',
    platformId: 'platformId',
    sellerId: 'sellerId',
    sellerAuthKey: 'sellerAuthKey',
    flag: 'flag',
    sellerCode: 'sellerCode',
    itemStatus: 'itemStatus',
    itemTitle: 'itemTitle',
    promotionName: 'promotionName',
    mainCatCd: 'mainCatCd',
    mainCatNm: 'mainCatNm',
    firstSubCatCd: 'firstSubCatCd',
    firstSubCatNm: 'firstSubCatNm',
    secondSubCatCd: 'secondSubCatCd',
    secondSubCatNm: 'secondSubCatNm',
    drugType: 'drugType',
    productionPlaceType: 'productionPlaceType',
    productionPlace: 'productionPlace',
    industrialCodeType: 'industrialCodeType',
    industrialCode: 'industrialCode',
    retailPrice: 'retailPrice',
    itemPrice: 'itemPrice',
    taxRate: 'taxRate',
    settlePrice: 'settlePrice',
    itemQty: 'itemQty',
    expireDate: 'expireDate',
    shippingNo: 'shippingNo',
    modelNM: 'modelNM',
    manufacturerDate: 'manufacturerDate',
    brandNo: 'brandNo',
    material: 'material',
    adultYN: 'adultYN',
    contactInfo: 'contactInfo',
    itemDetail: 'itemDetail',
    imageUrl: 'imageUrl',
    videoURL: 'videoURL',
    keyword: 'keyword',
    listedDate: 'listedDate',
    changedDate: 'changedDate',
    lastFetchDate: 'lastFetchDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    availableDateType: 'availableDateType',
    availableDateValue: 'availableDateValue',
    desiredShippingDate: 'desiredShippingDate',
    weight: 'weight',
    optionShippingNo1: 'optionShippingNo1',
    optionShippingNo2: 'optionShippingNo2'
  };

  export type Qoo10NormalProductScalarFieldEnum = (typeof Qoo10NormalProductScalarFieldEnum)[keyof typeof Qoo10NormalProductScalarFieldEnum]


  export const Qoo10MoveProductScalarFieldEnum: {
    id: 'id',
    itemCode: 'itemCode',
    companyId: 'companyId',
    platformId: 'platformId',
    sellerId: 'sellerId',
    sellerAuthKey: 'sellerAuthKey',
    flag: 'flag',
    adultYN: 'adultYN',
    attributeInfo: 'attributeInfo',
    availableDateValue: 'availableDateValue',
    brandNo: 'brandNo',
    buyLimitType: 'buyLimitType',
    buyLimitDate: 'buyLimitDate',
    buyLimitQty: 'buyLimitQty',
    contactInfo: 'contactInfo',
    desiredShippingDate: 'desiredShippingDate',
    expirationDateType: 'expirationDateType',
    expirationDateMFD: 'expirationDateMFD',
    expirationDatePAO: 'expirationDatePAO',
    expirationDateEXP: 'expirationDateEXP',
    expireDate: 'expireDate',
    imageOtherUrl: 'imageOtherUrl',
    industrialCode: 'industrialCode',
    industrialCodeType: 'industrialCodeType',
    itemDescription: 'itemDescription',
    itemPrice: 'itemPrice',
    itemSeriesName: 'itemSeriesName',
    keyword: 'keyword',
    manufactureDate: 'manufactureDate',
    materialInfo: 'materialInfo',
    materialNumber: 'materialNumber',
    modelNM: 'modelNM',
    optionMainimage: 'optionMainimage',
    optionQty: 'optionQty',
    optionSubimage: 'optionSubimage',
    optionType: 'optionType',
    originCountryId: 'originCountryId',
    originRegionId: 'originRegionId',
    originOthers: 'originOthers',
    originType: 'originType',
    promotionName: 'promotionName',
    retailPrice: 'retailPrice',
    seasonType: 'seasonType',
    secondSubCat: 'secondSubCat',
    sellerCode: 'sellerCode',
    shippingNo: 'shippingNo',
    sizetableType1: 'sizetableType1',
    sizetableType1Value: 'sizetableType1Value',
    sizetableType2: 'sizetableType2',
    sizetableType2Value: 'sizetableType2Value',
    sizetableType3: 'sizetableType3',
    sizetableType3Value: 'sizetableType3Value',
    styleNumber: 'styleNumber',
    tpoNumber: 'tpoNumber',
    videoNumber: 'videoNumber',
    washinginfoFit: 'washinginfoFit',
    washinginfoLining: 'washinginfoLining',
    washinginfoSeethrough: 'washinginfoSeethrough',
    washinginfoStretch: 'washinginfoStretch',
    washinginfoThickness: 'washinginfoThickness',
    washinginfoWashing: 'washinginfoWashing',
    weight: 'weight',
    taxRate: 'taxRate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastFetchDate: 'lastFetchDate'
  };

  export type Qoo10MoveProductScalarFieldEnum = (typeof Qoo10MoveProductScalarFieldEnum)[keyof typeof Qoo10MoveProductScalarFieldEnum]


  export const NormalOptionScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    name1: 'name1',
    value1: 'value1',
    name2: 'name2',
    value2: 'value2',
    name3: 'name3',
    value3: 'value3',
    name4: 'name4',
    value4: 'value4',
    name5: 'name5',
    value5: 'value5',
    price: 'price',
    qty: 'qty',
    itemTypeCode: 'itemTypeCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NormalOptionScalarFieldEnum = (typeof NormalOptionScalarFieldEnum)[keyof typeof NormalOptionScalarFieldEnum]


  export const MoveOptionScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    color: 'color',
    size: 'size',
    qty: 'qty',
    itemTypeCode: 'itemTypeCode',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MoveOptionScalarFieldEnum = (typeof MoveOptionScalarFieldEnum)[keyof typeof MoveOptionScalarFieldEnum]


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type Qoo10NormalProductWhereInput = {
    AND?: Qoo10NormalProductWhereInput | Qoo10NormalProductWhereInput[]
    OR?: Qoo10NormalProductWhereInput[]
    NOT?: Qoo10NormalProductWhereInput | Qoo10NormalProductWhereInput[]
    id?: StringFilter<"Qoo10NormalProduct"> | string
    itemCode?: StringFilter<"Qoo10NormalProduct"> | string
    companyId?: StringFilter<"Qoo10NormalProduct"> | string
    platformId?: StringFilter<"Qoo10NormalProduct"> | string
    sellerId?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    sellerAuthKey?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    flag?: StringFilter<"Qoo10NormalProduct"> | string
    sellerCode?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemStatus?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemTitle?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    promotionName?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    mainCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    mainCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    drugType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    productionPlaceType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    productionPlace?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    industrialCodeType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    industrialCode?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    retailPrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    itemPrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    taxRate?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    settlePrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    itemQty?: IntNullableFilter<"Qoo10NormalProduct"> | number | null
    expireDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    shippingNo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    modelNM?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    manufacturerDate?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    brandNo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    material?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    adultYN?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    contactInfo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemDetail?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    imageUrl?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    videoURL?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    keyword?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    listedDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    changedDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    lastFetchDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    createdAt?: DateTimeFilter<"Qoo10NormalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"Qoo10NormalProduct"> | Date | string
    availableDateType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    availableDateValue?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    desiredShippingDate?: IntNullableFilter<"Qoo10NormalProduct"> | number | null
    weight?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    optionShippingNo1?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    optionShippingNo2?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    options?: NormalOptionListRelationFilter
  }

  export type Qoo10NormalProductOrderByWithRelationInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    sellerCode?: SortOrder
    itemStatus?: SortOrder
    itemTitle?: SortOrder
    promotionName?: SortOrder
    mainCatCd?: SortOrder
    mainCatNm?: SortOrder
    firstSubCatCd?: SortOrder
    firstSubCatNm?: SortOrder
    secondSubCatCd?: SortOrder
    secondSubCatNm?: SortOrder
    drugType?: SortOrder
    productionPlaceType?: SortOrder
    productionPlace?: SortOrder
    industrialCodeType?: SortOrder
    industrialCode?: SortOrder
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    expireDate?: SortOrder
    shippingNo?: SortOrder
    modelNM?: SortOrder
    manufacturerDate?: SortOrder
    brandNo?: SortOrder
    material?: SortOrder
    adultYN?: SortOrder
    contactInfo?: SortOrder
    itemDetail?: SortOrder
    imageUrl?: SortOrder
    videoURL?: SortOrder
    keyword?: SortOrder
    listedDate?: SortOrder
    changedDate?: SortOrder
    lastFetchDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    availableDateType?: SortOrder
    availableDateValue?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
    optionShippingNo1?: SortOrder
    optionShippingNo2?: SortOrder
    options?: NormalOptionOrderByRelationAggregateInput
  }

  export type Qoo10NormalProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    itemCode?: string
    AND?: Qoo10NormalProductWhereInput | Qoo10NormalProductWhereInput[]
    OR?: Qoo10NormalProductWhereInput[]
    NOT?: Qoo10NormalProductWhereInput | Qoo10NormalProductWhereInput[]
    companyId?: StringFilter<"Qoo10NormalProduct"> | string
    platformId?: StringFilter<"Qoo10NormalProduct"> | string
    sellerId?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    sellerAuthKey?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    flag?: StringFilter<"Qoo10NormalProduct"> | string
    sellerCode?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemStatus?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemTitle?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    promotionName?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    mainCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    mainCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatCd?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatNm?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    drugType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    productionPlaceType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    productionPlace?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    industrialCodeType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    industrialCode?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    retailPrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    itemPrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    taxRate?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    settlePrice?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    itemQty?: IntNullableFilter<"Qoo10NormalProduct"> | number | null
    expireDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    shippingNo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    modelNM?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    manufacturerDate?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    brandNo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    material?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    adultYN?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    contactInfo?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    itemDetail?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    imageUrl?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    videoURL?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    keyword?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    listedDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    changedDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    lastFetchDate?: DateTimeNullableFilter<"Qoo10NormalProduct"> | Date | string | null
    createdAt?: DateTimeFilter<"Qoo10NormalProduct"> | Date | string
    updatedAt?: DateTimeFilter<"Qoo10NormalProduct"> | Date | string
    availableDateType?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    availableDateValue?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    desiredShippingDate?: IntNullableFilter<"Qoo10NormalProduct"> | number | null
    weight?: FloatNullableFilter<"Qoo10NormalProduct"> | number | null
    optionShippingNo1?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    optionShippingNo2?: StringNullableFilter<"Qoo10NormalProduct"> | string | null
    options?: NormalOptionListRelationFilter
  }, "id" | "itemCode">

  export type Qoo10NormalProductOrderByWithAggregationInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    sellerCode?: SortOrder
    itemStatus?: SortOrder
    itemTitle?: SortOrder
    promotionName?: SortOrder
    mainCatCd?: SortOrder
    mainCatNm?: SortOrder
    firstSubCatCd?: SortOrder
    firstSubCatNm?: SortOrder
    secondSubCatCd?: SortOrder
    secondSubCatNm?: SortOrder
    drugType?: SortOrder
    productionPlaceType?: SortOrder
    productionPlace?: SortOrder
    industrialCodeType?: SortOrder
    industrialCode?: SortOrder
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    expireDate?: SortOrder
    shippingNo?: SortOrder
    modelNM?: SortOrder
    manufacturerDate?: SortOrder
    brandNo?: SortOrder
    material?: SortOrder
    adultYN?: SortOrder
    contactInfo?: SortOrder
    itemDetail?: SortOrder
    imageUrl?: SortOrder
    videoURL?: SortOrder
    keyword?: SortOrder
    listedDate?: SortOrder
    changedDate?: SortOrder
    lastFetchDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    availableDateType?: SortOrder
    availableDateValue?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
    optionShippingNo1?: SortOrder
    optionShippingNo2?: SortOrder
    _count?: Qoo10NormalProductCountOrderByAggregateInput
    _avg?: Qoo10NormalProductAvgOrderByAggregateInput
    _max?: Qoo10NormalProductMaxOrderByAggregateInput
    _min?: Qoo10NormalProductMinOrderByAggregateInput
    _sum?: Qoo10NormalProductSumOrderByAggregateInput
  }

  export type Qoo10NormalProductScalarWhereWithAggregatesInput = {
    AND?: Qoo10NormalProductScalarWhereWithAggregatesInput | Qoo10NormalProductScalarWhereWithAggregatesInput[]
    OR?: Qoo10NormalProductScalarWhereWithAggregatesInput[]
    NOT?: Qoo10NormalProductScalarWhereWithAggregatesInput | Qoo10NormalProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Qoo10NormalProduct"> | string
    itemCode?: StringWithAggregatesFilter<"Qoo10NormalProduct"> | string
    companyId?: StringWithAggregatesFilter<"Qoo10NormalProduct"> | string
    platformId?: StringWithAggregatesFilter<"Qoo10NormalProduct"> | string
    sellerId?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    sellerAuthKey?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    flag?: StringWithAggregatesFilter<"Qoo10NormalProduct"> | string
    sellerCode?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    itemStatus?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    itemTitle?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    promotionName?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    mainCatCd?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    mainCatNm?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatCd?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    firstSubCatNm?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatCd?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    secondSubCatNm?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    drugType?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    productionPlaceType?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    productionPlace?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    industrialCodeType?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    industrialCode?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    retailPrice?: FloatNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    itemPrice?: FloatNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    taxRate?: FloatNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    settlePrice?: FloatNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    itemQty?: IntNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    expireDate?: DateTimeNullableWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string | null
    shippingNo?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    modelNM?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    manufacturerDate?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    brandNo?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    material?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    adultYN?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    contactInfo?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    itemDetail?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    videoURL?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    keyword?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    listedDate?: DateTimeNullableWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string | null
    changedDate?: DateTimeNullableWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string | null
    lastFetchDate?: DateTimeNullableWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Qoo10NormalProduct"> | Date | string
    availableDateType?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    availableDateValue?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    desiredShippingDate?: IntNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    weight?: FloatNullableWithAggregatesFilter<"Qoo10NormalProduct"> | number | null
    optionShippingNo1?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
    optionShippingNo2?: StringNullableWithAggregatesFilter<"Qoo10NormalProduct"> | string | null
  }

  export type Qoo10MoveProductWhereInput = {
    AND?: Qoo10MoveProductWhereInput | Qoo10MoveProductWhereInput[]
    OR?: Qoo10MoveProductWhereInput[]
    NOT?: Qoo10MoveProductWhereInput | Qoo10MoveProductWhereInput[]
    id?: StringFilter<"Qoo10MoveProduct"> | string
    itemCode?: StringFilter<"Qoo10MoveProduct"> | string
    companyId?: StringFilter<"Qoo10MoveProduct"> | string
    platformId?: StringFilter<"Qoo10MoveProduct"> | string
    sellerId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sellerAuthKey?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    flag?: StringFilter<"Qoo10MoveProduct"> | string
    adultYN?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    attributeInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    availableDateValue?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    brandNo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitQty?: IntNullableFilter<"Qoo10MoveProduct"> | number | null
    contactInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    desiredShippingDate?: IntNullableFilter<"Qoo10MoveProduct"> | number | null
    expirationDateType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDateMFD?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDatePAO?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDateEXP?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expireDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    imageOtherUrl?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    industrialCode?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    industrialCodeType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    itemDescription?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    itemPrice?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    itemSeriesName?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    keyword?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    manufactureDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    materialInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    materialNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    modelNM?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionMainimage?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionQty?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionSubimage?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originCountryId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originRegionId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originOthers?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    promotionName?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    retailPrice?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    seasonType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    secondSubCat?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sellerCode?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    shippingNo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    styleNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    tpoNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    videoNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoFit?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoLining?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoSeethrough?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoStretch?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoThickness?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoWashing?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    weight?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    taxRate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    createdAt?: DateTimeFilter<"Qoo10MoveProduct"> | Date | string
    updatedAt?: DateTimeFilter<"Qoo10MoveProduct"> | Date | string
    lastFetchDate?: DateTimeNullableFilter<"Qoo10MoveProduct"> | Date | string | null
    MoveOption?: MoveOptionListRelationFilter
  }

  export type Qoo10MoveProductOrderByWithRelationInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    adultYN?: SortOrder
    attributeInfo?: SortOrder
    availableDateValue?: SortOrder
    brandNo?: SortOrder
    buyLimitType?: SortOrder
    buyLimitDate?: SortOrder
    buyLimitQty?: SortOrder
    contactInfo?: SortOrder
    desiredShippingDate?: SortOrder
    expirationDateType?: SortOrder
    expirationDateMFD?: SortOrder
    expirationDatePAO?: SortOrder
    expirationDateEXP?: SortOrder
    expireDate?: SortOrder
    imageOtherUrl?: SortOrder
    industrialCode?: SortOrder
    industrialCodeType?: SortOrder
    itemDescription?: SortOrder
    itemPrice?: SortOrder
    itemSeriesName?: SortOrder
    keyword?: SortOrder
    manufactureDate?: SortOrder
    materialInfo?: SortOrder
    materialNumber?: SortOrder
    modelNM?: SortOrder
    optionMainimage?: SortOrder
    optionQty?: SortOrder
    optionSubimage?: SortOrder
    optionType?: SortOrder
    originCountryId?: SortOrder
    originRegionId?: SortOrder
    originOthers?: SortOrder
    originType?: SortOrder
    promotionName?: SortOrder
    retailPrice?: SortOrder
    seasonType?: SortOrder
    secondSubCat?: SortOrder
    sellerCode?: SortOrder
    shippingNo?: SortOrder
    sizetableType1?: SortOrder
    sizetableType1Value?: SortOrder
    sizetableType2?: SortOrder
    sizetableType2Value?: SortOrder
    sizetableType3?: SortOrder
    sizetableType3Value?: SortOrder
    styleNumber?: SortOrder
    tpoNumber?: SortOrder
    videoNumber?: SortOrder
    washinginfoFit?: SortOrder
    washinginfoLining?: SortOrder
    washinginfoSeethrough?: SortOrder
    washinginfoStretch?: SortOrder
    washinginfoThickness?: SortOrder
    washinginfoWashing?: SortOrder
    weight?: SortOrder
    taxRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastFetchDate?: SortOrder
    MoveOption?: MoveOptionOrderByRelationAggregateInput
  }

  export type Qoo10MoveProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    itemCode?: string
    AND?: Qoo10MoveProductWhereInput | Qoo10MoveProductWhereInput[]
    OR?: Qoo10MoveProductWhereInput[]
    NOT?: Qoo10MoveProductWhereInput | Qoo10MoveProductWhereInput[]
    companyId?: StringFilter<"Qoo10MoveProduct"> | string
    platformId?: StringFilter<"Qoo10MoveProduct"> | string
    sellerId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sellerAuthKey?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    flag?: StringFilter<"Qoo10MoveProduct"> | string
    adultYN?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    attributeInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    availableDateValue?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    brandNo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    buyLimitQty?: IntNullableFilter<"Qoo10MoveProduct"> | number | null
    contactInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    desiredShippingDate?: IntNullableFilter<"Qoo10MoveProduct"> | number | null
    expirationDateType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDateMFD?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDatePAO?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expirationDateEXP?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    expireDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    imageOtherUrl?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    industrialCode?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    industrialCodeType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    itemDescription?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    itemPrice?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    itemSeriesName?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    keyword?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    manufactureDate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    materialInfo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    materialNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    modelNM?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionMainimage?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionQty?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionSubimage?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    optionType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originCountryId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originRegionId?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originOthers?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    originType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    promotionName?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    retailPrice?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    seasonType?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    secondSubCat?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sellerCode?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    shippingNo?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3Value?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    styleNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    tpoNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    videoNumber?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoFit?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoLining?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoSeethrough?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoStretch?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoThickness?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    washinginfoWashing?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    weight?: FloatNullableFilter<"Qoo10MoveProduct"> | number | null
    taxRate?: StringNullableFilter<"Qoo10MoveProduct"> | string | null
    createdAt?: DateTimeFilter<"Qoo10MoveProduct"> | Date | string
    updatedAt?: DateTimeFilter<"Qoo10MoveProduct"> | Date | string
    lastFetchDate?: DateTimeNullableFilter<"Qoo10MoveProduct"> | Date | string | null
    MoveOption?: MoveOptionListRelationFilter
  }, "id" | "itemCode">

  export type Qoo10MoveProductOrderByWithAggregationInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    adultYN?: SortOrder
    attributeInfo?: SortOrder
    availableDateValue?: SortOrder
    brandNo?: SortOrder
    buyLimitType?: SortOrder
    buyLimitDate?: SortOrder
    buyLimitQty?: SortOrder
    contactInfo?: SortOrder
    desiredShippingDate?: SortOrder
    expirationDateType?: SortOrder
    expirationDateMFD?: SortOrder
    expirationDatePAO?: SortOrder
    expirationDateEXP?: SortOrder
    expireDate?: SortOrder
    imageOtherUrl?: SortOrder
    industrialCode?: SortOrder
    industrialCodeType?: SortOrder
    itemDescription?: SortOrder
    itemPrice?: SortOrder
    itemSeriesName?: SortOrder
    keyword?: SortOrder
    manufactureDate?: SortOrder
    materialInfo?: SortOrder
    materialNumber?: SortOrder
    modelNM?: SortOrder
    optionMainimage?: SortOrder
    optionQty?: SortOrder
    optionSubimage?: SortOrder
    optionType?: SortOrder
    originCountryId?: SortOrder
    originRegionId?: SortOrder
    originOthers?: SortOrder
    originType?: SortOrder
    promotionName?: SortOrder
    retailPrice?: SortOrder
    seasonType?: SortOrder
    secondSubCat?: SortOrder
    sellerCode?: SortOrder
    shippingNo?: SortOrder
    sizetableType1?: SortOrder
    sizetableType1Value?: SortOrder
    sizetableType2?: SortOrder
    sizetableType2Value?: SortOrder
    sizetableType3?: SortOrder
    sizetableType3Value?: SortOrder
    styleNumber?: SortOrder
    tpoNumber?: SortOrder
    videoNumber?: SortOrder
    washinginfoFit?: SortOrder
    washinginfoLining?: SortOrder
    washinginfoSeethrough?: SortOrder
    washinginfoStretch?: SortOrder
    washinginfoThickness?: SortOrder
    washinginfoWashing?: SortOrder
    weight?: SortOrder
    taxRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastFetchDate?: SortOrder
    _count?: Qoo10MoveProductCountOrderByAggregateInput
    _avg?: Qoo10MoveProductAvgOrderByAggregateInput
    _max?: Qoo10MoveProductMaxOrderByAggregateInput
    _min?: Qoo10MoveProductMinOrderByAggregateInput
    _sum?: Qoo10MoveProductSumOrderByAggregateInput
  }

  export type Qoo10MoveProductScalarWhereWithAggregatesInput = {
    AND?: Qoo10MoveProductScalarWhereWithAggregatesInput | Qoo10MoveProductScalarWhereWithAggregatesInput[]
    OR?: Qoo10MoveProductScalarWhereWithAggregatesInput[]
    NOT?: Qoo10MoveProductScalarWhereWithAggregatesInput | Qoo10MoveProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Qoo10MoveProduct"> | string
    itemCode?: StringWithAggregatesFilter<"Qoo10MoveProduct"> | string
    companyId?: StringWithAggregatesFilter<"Qoo10MoveProduct"> | string
    platformId?: StringWithAggregatesFilter<"Qoo10MoveProduct"> | string
    sellerId?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sellerAuthKey?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    flag?: StringWithAggregatesFilter<"Qoo10MoveProduct"> | string
    adultYN?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    attributeInfo?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    availableDateValue?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    brandNo?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    buyLimitType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    buyLimitDate?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    buyLimitQty?: IntNullableWithAggregatesFilter<"Qoo10MoveProduct"> | number | null
    contactInfo?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    desiredShippingDate?: IntNullableWithAggregatesFilter<"Qoo10MoveProduct"> | number | null
    expirationDateType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    expirationDateMFD?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    expirationDatePAO?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    expirationDateEXP?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    expireDate?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    imageOtherUrl?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    industrialCode?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    industrialCodeType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    itemDescription?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    itemPrice?: FloatNullableWithAggregatesFilter<"Qoo10MoveProduct"> | number | null
    itemSeriesName?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    keyword?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    manufactureDate?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    materialInfo?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    materialNumber?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    modelNM?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    optionMainimage?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    optionQty?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    optionSubimage?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    optionType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    originCountryId?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    originRegionId?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    originOthers?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    originType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    promotionName?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    retailPrice?: FloatNullableWithAggregatesFilter<"Qoo10MoveProduct"> | number | null
    seasonType?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    secondSubCat?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sellerCode?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    shippingNo?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType1Value?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType2Value?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    sizetableType3Value?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    styleNumber?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    tpoNumber?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    videoNumber?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoFit?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoLining?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoSeethrough?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoStretch?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoThickness?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    washinginfoWashing?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    weight?: FloatNullableWithAggregatesFilter<"Qoo10MoveProduct"> | number | null
    taxRate?: StringNullableWithAggregatesFilter<"Qoo10MoveProduct"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Qoo10MoveProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Qoo10MoveProduct"> | Date | string
    lastFetchDate?: DateTimeNullableWithAggregatesFilter<"Qoo10MoveProduct"> | Date | string | null
  }

  export type NormalOptionWhereInput = {
    AND?: NormalOptionWhereInput | NormalOptionWhereInput[]
    OR?: NormalOptionWhereInput[]
    NOT?: NormalOptionWhereInput | NormalOptionWhereInput[]
    id?: StringFilter<"NormalOption"> | string
    productId?: StringFilter<"NormalOption"> | string
    name1?: StringNullableFilter<"NormalOption"> | string | null
    value1?: StringNullableFilter<"NormalOption"> | string | null
    name2?: StringNullableFilter<"NormalOption"> | string | null
    value2?: StringNullableFilter<"NormalOption"> | string | null
    name3?: StringNullableFilter<"NormalOption"> | string | null
    value3?: StringNullableFilter<"NormalOption"> | string | null
    name4?: StringNullableFilter<"NormalOption"> | string | null
    value4?: StringNullableFilter<"NormalOption"> | string | null
    name5?: StringNullableFilter<"NormalOption"> | string | null
    value5?: StringNullableFilter<"NormalOption"> | string | null
    price?: FloatNullableFilter<"NormalOption"> | number | null
    qty?: IntNullableFilter<"NormalOption"> | number | null
    itemTypeCode?: StringNullableFilter<"NormalOption"> | string | null
    createdAt?: DateTimeFilter<"NormalOption"> | Date | string
    updatedAt?: DateTimeFilter<"NormalOption"> | Date | string
    product?: XOR<Qoo10NormalProductRelationFilter, Qoo10NormalProductWhereInput>
  }

  export type NormalOptionOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    name1?: SortOrder
    value1?: SortOrder
    name2?: SortOrder
    value2?: SortOrder
    name3?: SortOrder
    value3?: SortOrder
    name4?: SortOrder
    value4?: SortOrder
    name5?: SortOrder
    value5?: SortOrder
    price?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: Qoo10NormalProductOrderByWithRelationInput
  }

  export type NormalOptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NormalOptionWhereInput | NormalOptionWhereInput[]
    OR?: NormalOptionWhereInput[]
    NOT?: NormalOptionWhereInput | NormalOptionWhereInput[]
    productId?: StringFilter<"NormalOption"> | string
    name1?: StringNullableFilter<"NormalOption"> | string | null
    value1?: StringNullableFilter<"NormalOption"> | string | null
    name2?: StringNullableFilter<"NormalOption"> | string | null
    value2?: StringNullableFilter<"NormalOption"> | string | null
    name3?: StringNullableFilter<"NormalOption"> | string | null
    value3?: StringNullableFilter<"NormalOption"> | string | null
    name4?: StringNullableFilter<"NormalOption"> | string | null
    value4?: StringNullableFilter<"NormalOption"> | string | null
    name5?: StringNullableFilter<"NormalOption"> | string | null
    value5?: StringNullableFilter<"NormalOption"> | string | null
    price?: FloatNullableFilter<"NormalOption"> | number | null
    qty?: IntNullableFilter<"NormalOption"> | number | null
    itemTypeCode?: StringNullableFilter<"NormalOption"> | string | null
    createdAt?: DateTimeFilter<"NormalOption"> | Date | string
    updatedAt?: DateTimeFilter<"NormalOption"> | Date | string
    product?: XOR<Qoo10NormalProductRelationFilter, Qoo10NormalProductWhereInput>
  }, "id">

  export type NormalOptionOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    name1?: SortOrder
    value1?: SortOrder
    name2?: SortOrder
    value2?: SortOrder
    name3?: SortOrder
    value3?: SortOrder
    name4?: SortOrder
    value4?: SortOrder
    name5?: SortOrder
    value5?: SortOrder
    price?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NormalOptionCountOrderByAggregateInput
    _avg?: NormalOptionAvgOrderByAggregateInput
    _max?: NormalOptionMaxOrderByAggregateInput
    _min?: NormalOptionMinOrderByAggregateInput
    _sum?: NormalOptionSumOrderByAggregateInput
  }

  export type NormalOptionScalarWhereWithAggregatesInput = {
    AND?: NormalOptionScalarWhereWithAggregatesInput | NormalOptionScalarWhereWithAggregatesInput[]
    OR?: NormalOptionScalarWhereWithAggregatesInput[]
    NOT?: NormalOptionScalarWhereWithAggregatesInput | NormalOptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NormalOption"> | string
    productId?: StringWithAggregatesFilter<"NormalOption"> | string
    name1?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    value1?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    name2?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    value2?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    name3?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    value3?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    name4?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    value4?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    name5?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    value5?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    price?: FloatNullableWithAggregatesFilter<"NormalOption"> | number | null
    qty?: IntNullableWithAggregatesFilter<"NormalOption"> | number | null
    itemTypeCode?: StringNullableWithAggregatesFilter<"NormalOption"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NormalOption"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NormalOption"> | Date | string
  }

  export type MoveOptionWhereInput = {
    AND?: MoveOptionWhereInput | MoveOptionWhereInput[]
    OR?: MoveOptionWhereInput[]
    NOT?: MoveOptionWhereInput | MoveOptionWhereInput[]
    id?: StringFilter<"MoveOption"> | string
    productId?: StringFilter<"MoveOption"> | string
    color?: StringFilter<"MoveOption"> | string
    size?: StringFilter<"MoveOption"> | string
    qty?: IntFilter<"MoveOption"> | number
    itemTypeCode?: StringNullableFilter<"MoveOption"> | string | null
    price?: FloatNullableFilter<"MoveOption"> | number | null
    createdAt?: DateTimeFilter<"MoveOption"> | Date | string
    updatedAt?: DateTimeFilter<"MoveOption"> | Date | string
    product?: XOR<Qoo10MoveProductRelationFilter, Qoo10MoveProductWhereInput>
  }

  export type MoveOptionOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    size?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: Qoo10MoveProductOrderByWithRelationInput
  }

  export type MoveOptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MoveOptionWhereInput | MoveOptionWhereInput[]
    OR?: MoveOptionWhereInput[]
    NOT?: MoveOptionWhereInput | MoveOptionWhereInput[]
    productId?: StringFilter<"MoveOption"> | string
    color?: StringFilter<"MoveOption"> | string
    size?: StringFilter<"MoveOption"> | string
    qty?: IntFilter<"MoveOption"> | number
    itemTypeCode?: StringNullableFilter<"MoveOption"> | string | null
    price?: FloatNullableFilter<"MoveOption"> | number | null
    createdAt?: DateTimeFilter<"MoveOption"> | Date | string
    updatedAt?: DateTimeFilter<"MoveOption"> | Date | string
    product?: XOR<Qoo10MoveProductRelationFilter, Qoo10MoveProductWhereInput>
  }, "id">

  export type MoveOptionOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    size?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MoveOptionCountOrderByAggregateInput
    _avg?: MoveOptionAvgOrderByAggregateInput
    _max?: MoveOptionMaxOrderByAggregateInput
    _min?: MoveOptionMinOrderByAggregateInput
    _sum?: MoveOptionSumOrderByAggregateInput
  }

  export type MoveOptionScalarWhereWithAggregatesInput = {
    AND?: MoveOptionScalarWhereWithAggregatesInput | MoveOptionScalarWhereWithAggregatesInput[]
    OR?: MoveOptionScalarWhereWithAggregatesInput[]
    NOT?: MoveOptionScalarWhereWithAggregatesInput | MoveOptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MoveOption"> | string
    productId?: StringWithAggregatesFilter<"MoveOption"> | string
    color?: StringWithAggregatesFilter<"MoveOption"> | string
    size?: StringWithAggregatesFilter<"MoveOption"> | string
    qty?: IntWithAggregatesFilter<"MoveOption"> | number
    itemTypeCode?: StringNullableWithAggregatesFilter<"MoveOption"> | string | null
    price?: FloatNullableWithAggregatesFilter<"MoveOption"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"MoveOption"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MoveOption"> | Date | string
  }

  export type Qoo10NormalProductCreateInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    sellerCode?: string | null
    itemStatus?: string | null
    itemTitle?: string | null
    promotionName?: string | null
    mainCatCd?: string | null
    mainCatNm?: string | null
    firstSubCatCd?: string | null
    firstSubCatNm?: string | null
    secondSubCatCd?: string | null
    secondSubCatNm?: string | null
    drugType?: string | null
    productionPlaceType?: string | null
    productionPlace?: string | null
    industrialCodeType?: string | null
    industrialCode?: string | null
    retailPrice?: number | null
    itemPrice?: number | null
    taxRate?: number | null
    settlePrice?: number | null
    itemQty?: number | null
    expireDate?: Date | string | null
    shippingNo?: string | null
    modelNM?: string | null
    manufacturerDate?: string | null
    brandNo?: string | null
    material?: string | null
    adultYN?: string | null
    contactInfo?: string | null
    itemDetail?: string | null
    imageUrl?: string | null
    videoURL?: string | null
    keyword?: string | null
    listedDate?: Date | string | null
    changedDate?: Date | string | null
    lastFetchDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    availableDateType?: string | null
    availableDateValue?: string | null
    desiredShippingDate?: number | null
    weight?: number | null
    optionShippingNo1?: string | null
    optionShippingNo2?: string | null
    options?: NormalOptionCreateNestedManyWithoutProductInput
  }

  export type Qoo10NormalProductUncheckedCreateInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    sellerCode?: string | null
    itemStatus?: string | null
    itemTitle?: string | null
    promotionName?: string | null
    mainCatCd?: string | null
    mainCatNm?: string | null
    firstSubCatCd?: string | null
    firstSubCatNm?: string | null
    secondSubCatCd?: string | null
    secondSubCatNm?: string | null
    drugType?: string | null
    productionPlaceType?: string | null
    productionPlace?: string | null
    industrialCodeType?: string | null
    industrialCode?: string | null
    retailPrice?: number | null
    itemPrice?: number | null
    taxRate?: number | null
    settlePrice?: number | null
    itemQty?: number | null
    expireDate?: Date | string | null
    shippingNo?: string | null
    modelNM?: string | null
    manufacturerDate?: string | null
    brandNo?: string | null
    material?: string | null
    adultYN?: string | null
    contactInfo?: string | null
    itemDetail?: string | null
    imageUrl?: string | null
    videoURL?: string | null
    keyword?: string | null
    listedDate?: Date | string | null
    changedDate?: Date | string | null
    lastFetchDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    availableDateType?: string | null
    availableDateValue?: string | null
    desiredShippingDate?: number | null
    weight?: number | null
    optionShippingNo1?: string | null
    optionShippingNo2?: string | null
    options?: NormalOptionUncheckedCreateNestedManyWithoutProductInput
  }

  export type Qoo10NormalProductUpdateInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
    options?: NormalOptionUpdateManyWithoutProductNestedInput
  }

  export type Qoo10NormalProductUncheckedUpdateInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
    options?: NormalOptionUncheckedUpdateManyWithoutProductNestedInput
  }

  export type Qoo10NormalProductCreateManyInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    sellerCode?: string | null
    itemStatus?: string | null
    itemTitle?: string | null
    promotionName?: string | null
    mainCatCd?: string | null
    mainCatNm?: string | null
    firstSubCatCd?: string | null
    firstSubCatNm?: string | null
    secondSubCatCd?: string | null
    secondSubCatNm?: string | null
    drugType?: string | null
    productionPlaceType?: string | null
    productionPlace?: string | null
    industrialCodeType?: string | null
    industrialCode?: string | null
    retailPrice?: number | null
    itemPrice?: number | null
    taxRate?: number | null
    settlePrice?: number | null
    itemQty?: number | null
    expireDate?: Date | string | null
    shippingNo?: string | null
    modelNM?: string | null
    manufacturerDate?: string | null
    brandNo?: string | null
    material?: string | null
    adultYN?: string | null
    contactInfo?: string | null
    itemDetail?: string | null
    imageUrl?: string | null
    videoURL?: string | null
    keyword?: string | null
    listedDate?: Date | string | null
    changedDate?: Date | string | null
    lastFetchDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    availableDateType?: string | null
    availableDateValue?: string | null
    desiredShippingDate?: number | null
    weight?: number | null
    optionShippingNo1?: string | null
    optionShippingNo2?: string | null
  }

  export type Qoo10NormalProductUpdateManyMutationInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type Qoo10NormalProductUncheckedUpdateManyInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type Qoo10MoveProductCreateInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    adultYN?: string | null
    attributeInfo?: string | null
    availableDateValue?: string | null
    brandNo?: string | null
    buyLimitType?: string | null
    buyLimitDate?: string | null
    buyLimitQty?: number | null
    contactInfo?: string | null
    desiredShippingDate?: number | null
    expirationDateType?: string | null
    expirationDateMFD?: string | null
    expirationDatePAO?: string | null
    expirationDateEXP?: string | null
    expireDate?: string | null
    imageOtherUrl?: string | null
    industrialCode?: string | null
    industrialCodeType?: string | null
    itemDescription?: string | null
    itemPrice?: number | null
    itemSeriesName?: string | null
    keyword?: string | null
    manufactureDate?: string | null
    materialInfo?: string | null
    materialNumber?: string | null
    modelNM?: string | null
    optionMainimage?: string | null
    optionQty?: string | null
    optionSubimage?: string | null
    optionType?: string | null
    originCountryId?: string | null
    originRegionId?: string | null
    originOthers?: string | null
    originType?: string | null
    promotionName?: string | null
    retailPrice?: number | null
    seasonType?: string | null
    secondSubCat?: string | null
    sellerCode?: string | null
    shippingNo?: string | null
    sizetableType1?: string | null
    sizetableType1Value?: string | null
    sizetableType2?: string | null
    sizetableType2Value?: string | null
    sizetableType3?: string | null
    sizetableType3Value?: string | null
    styleNumber?: string | null
    tpoNumber?: string | null
    videoNumber?: string | null
    washinginfoFit?: string | null
    washinginfoLining?: string | null
    washinginfoSeethrough?: string | null
    washinginfoStretch?: string | null
    washinginfoThickness?: string | null
    washinginfoWashing?: string | null
    weight?: number | null
    taxRate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastFetchDate?: Date | string | null
    MoveOption?: MoveOptionCreateNestedManyWithoutProductInput
  }

  export type Qoo10MoveProductUncheckedCreateInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    adultYN?: string | null
    attributeInfo?: string | null
    availableDateValue?: string | null
    brandNo?: string | null
    buyLimitType?: string | null
    buyLimitDate?: string | null
    buyLimitQty?: number | null
    contactInfo?: string | null
    desiredShippingDate?: number | null
    expirationDateType?: string | null
    expirationDateMFD?: string | null
    expirationDatePAO?: string | null
    expirationDateEXP?: string | null
    expireDate?: string | null
    imageOtherUrl?: string | null
    industrialCode?: string | null
    industrialCodeType?: string | null
    itemDescription?: string | null
    itemPrice?: number | null
    itemSeriesName?: string | null
    keyword?: string | null
    manufactureDate?: string | null
    materialInfo?: string | null
    materialNumber?: string | null
    modelNM?: string | null
    optionMainimage?: string | null
    optionQty?: string | null
    optionSubimage?: string | null
    optionType?: string | null
    originCountryId?: string | null
    originRegionId?: string | null
    originOthers?: string | null
    originType?: string | null
    promotionName?: string | null
    retailPrice?: number | null
    seasonType?: string | null
    secondSubCat?: string | null
    sellerCode?: string | null
    shippingNo?: string | null
    sizetableType1?: string | null
    sizetableType1Value?: string | null
    sizetableType2?: string | null
    sizetableType2Value?: string | null
    sizetableType3?: string | null
    sizetableType3Value?: string | null
    styleNumber?: string | null
    tpoNumber?: string | null
    videoNumber?: string | null
    washinginfoFit?: string | null
    washinginfoLining?: string | null
    washinginfoSeethrough?: string | null
    washinginfoStretch?: string | null
    washinginfoThickness?: string | null
    washinginfoWashing?: string | null
    weight?: number | null
    taxRate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastFetchDate?: Date | string | null
    MoveOption?: MoveOptionUncheckedCreateNestedManyWithoutProductInput
  }

  export type Qoo10MoveProductUpdateInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    MoveOption?: MoveOptionUpdateManyWithoutProductNestedInput
  }

  export type Qoo10MoveProductUncheckedUpdateInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    MoveOption?: MoveOptionUncheckedUpdateManyWithoutProductNestedInput
  }

  export type Qoo10MoveProductCreateManyInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    adultYN?: string | null
    attributeInfo?: string | null
    availableDateValue?: string | null
    brandNo?: string | null
    buyLimitType?: string | null
    buyLimitDate?: string | null
    buyLimitQty?: number | null
    contactInfo?: string | null
    desiredShippingDate?: number | null
    expirationDateType?: string | null
    expirationDateMFD?: string | null
    expirationDatePAO?: string | null
    expirationDateEXP?: string | null
    expireDate?: string | null
    imageOtherUrl?: string | null
    industrialCode?: string | null
    industrialCodeType?: string | null
    itemDescription?: string | null
    itemPrice?: number | null
    itemSeriesName?: string | null
    keyword?: string | null
    manufactureDate?: string | null
    materialInfo?: string | null
    materialNumber?: string | null
    modelNM?: string | null
    optionMainimage?: string | null
    optionQty?: string | null
    optionSubimage?: string | null
    optionType?: string | null
    originCountryId?: string | null
    originRegionId?: string | null
    originOthers?: string | null
    originType?: string | null
    promotionName?: string | null
    retailPrice?: number | null
    seasonType?: string | null
    secondSubCat?: string | null
    sellerCode?: string | null
    shippingNo?: string | null
    sizetableType1?: string | null
    sizetableType1Value?: string | null
    sizetableType2?: string | null
    sizetableType2Value?: string | null
    sizetableType3?: string | null
    sizetableType3Value?: string | null
    styleNumber?: string | null
    tpoNumber?: string | null
    videoNumber?: string | null
    washinginfoFit?: string | null
    washinginfoLining?: string | null
    washinginfoSeethrough?: string | null
    washinginfoStretch?: string | null
    washinginfoThickness?: string | null
    washinginfoWashing?: string | null
    weight?: number | null
    taxRate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastFetchDate?: Date | string | null
  }

  export type Qoo10MoveProductUpdateManyMutationInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type Qoo10MoveProductUncheckedUpdateManyInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NormalOptionCreateInput = {
    id?: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: Qoo10NormalProductCreateNestedOneWithoutOptionsInput
  }

  export type NormalOptionUncheckedCreateInput = {
    id?: string
    productId: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NormalOptionUpdateInput = {
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: Qoo10NormalProductUpdateOneRequiredWithoutOptionsNestedInput
  }

  export type NormalOptionUncheckedUpdateInput = {
    productId?: StringFieldUpdateOperationsInput | string
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NormalOptionCreateManyInput = {
    id?: string
    productId: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NormalOptionUpdateManyMutationInput = {
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NormalOptionUncheckedUpdateManyInput = {
    productId?: StringFieldUpdateOperationsInput | string
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionCreateInput = {
    id?: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: Qoo10MoveProductCreateNestedOneWithoutMoveOptionInput
  }

  export type MoveOptionUncheckedCreateInput = {
    id?: string
    productId: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoveOptionUpdateInput = {
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: Qoo10MoveProductUpdateOneRequiredWithoutMoveOptionNestedInput
  }

  export type MoveOptionUncheckedUpdateInput = {
    productId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionCreateManyInput = {
    id?: string
    productId: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoveOptionUpdateManyMutationInput = {
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionUncheckedUpdateManyInput = {
    productId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    isSet?: boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
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

  export type NormalOptionListRelationFilter = {
    every?: NormalOptionWhereInput
    some?: NormalOptionWhereInput
    none?: NormalOptionWhereInput
  }

  export type NormalOptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type Qoo10NormalProductCountOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    sellerCode?: SortOrder
    itemStatus?: SortOrder
    itemTitle?: SortOrder
    promotionName?: SortOrder
    mainCatCd?: SortOrder
    mainCatNm?: SortOrder
    firstSubCatCd?: SortOrder
    firstSubCatNm?: SortOrder
    secondSubCatCd?: SortOrder
    secondSubCatNm?: SortOrder
    drugType?: SortOrder
    productionPlaceType?: SortOrder
    productionPlace?: SortOrder
    industrialCodeType?: SortOrder
    industrialCode?: SortOrder
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    expireDate?: SortOrder
    shippingNo?: SortOrder
    modelNM?: SortOrder
    manufacturerDate?: SortOrder
    brandNo?: SortOrder
    material?: SortOrder
    adultYN?: SortOrder
    contactInfo?: SortOrder
    itemDetail?: SortOrder
    imageUrl?: SortOrder
    videoURL?: SortOrder
    keyword?: SortOrder
    listedDate?: SortOrder
    changedDate?: SortOrder
    lastFetchDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    availableDateType?: SortOrder
    availableDateValue?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
    optionShippingNo1?: SortOrder
    optionShippingNo2?: SortOrder
  }

  export type Qoo10NormalProductAvgOrderByAggregateInput = {
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
  }

  export type Qoo10NormalProductMaxOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    sellerCode?: SortOrder
    itemStatus?: SortOrder
    itemTitle?: SortOrder
    promotionName?: SortOrder
    mainCatCd?: SortOrder
    mainCatNm?: SortOrder
    firstSubCatCd?: SortOrder
    firstSubCatNm?: SortOrder
    secondSubCatCd?: SortOrder
    secondSubCatNm?: SortOrder
    drugType?: SortOrder
    productionPlaceType?: SortOrder
    productionPlace?: SortOrder
    industrialCodeType?: SortOrder
    industrialCode?: SortOrder
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    expireDate?: SortOrder
    shippingNo?: SortOrder
    modelNM?: SortOrder
    manufacturerDate?: SortOrder
    brandNo?: SortOrder
    material?: SortOrder
    adultYN?: SortOrder
    contactInfo?: SortOrder
    itemDetail?: SortOrder
    imageUrl?: SortOrder
    videoURL?: SortOrder
    keyword?: SortOrder
    listedDate?: SortOrder
    changedDate?: SortOrder
    lastFetchDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    availableDateType?: SortOrder
    availableDateValue?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
    optionShippingNo1?: SortOrder
    optionShippingNo2?: SortOrder
  }

  export type Qoo10NormalProductMinOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    sellerCode?: SortOrder
    itemStatus?: SortOrder
    itemTitle?: SortOrder
    promotionName?: SortOrder
    mainCatCd?: SortOrder
    mainCatNm?: SortOrder
    firstSubCatCd?: SortOrder
    firstSubCatNm?: SortOrder
    secondSubCatCd?: SortOrder
    secondSubCatNm?: SortOrder
    drugType?: SortOrder
    productionPlaceType?: SortOrder
    productionPlace?: SortOrder
    industrialCodeType?: SortOrder
    industrialCode?: SortOrder
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    expireDate?: SortOrder
    shippingNo?: SortOrder
    modelNM?: SortOrder
    manufacturerDate?: SortOrder
    brandNo?: SortOrder
    material?: SortOrder
    adultYN?: SortOrder
    contactInfo?: SortOrder
    itemDetail?: SortOrder
    imageUrl?: SortOrder
    videoURL?: SortOrder
    keyword?: SortOrder
    listedDate?: SortOrder
    changedDate?: SortOrder
    lastFetchDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    availableDateType?: SortOrder
    availableDateValue?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
    optionShippingNo1?: SortOrder
    optionShippingNo2?: SortOrder
  }

  export type Qoo10NormalProductSumOrderByAggregateInput = {
    retailPrice?: SortOrder
    itemPrice?: SortOrder
    taxRate?: SortOrder
    settlePrice?: SortOrder
    itemQty?: SortOrder
    desiredShippingDate?: SortOrder
    weight?: SortOrder
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
    isSet?: boolean
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
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

  export type MoveOptionListRelationFilter = {
    every?: MoveOptionWhereInput
    some?: MoveOptionWhereInput
    none?: MoveOptionWhereInput
  }

  export type MoveOptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type Qoo10MoveProductCountOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    adultYN?: SortOrder
    attributeInfo?: SortOrder
    availableDateValue?: SortOrder
    brandNo?: SortOrder
    buyLimitType?: SortOrder
    buyLimitDate?: SortOrder
    buyLimitQty?: SortOrder
    contactInfo?: SortOrder
    desiredShippingDate?: SortOrder
    expirationDateType?: SortOrder
    expirationDateMFD?: SortOrder
    expirationDatePAO?: SortOrder
    expirationDateEXP?: SortOrder
    expireDate?: SortOrder
    imageOtherUrl?: SortOrder
    industrialCode?: SortOrder
    industrialCodeType?: SortOrder
    itemDescription?: SortOrder
    itemPrice?: SortOrder
    itemSeriesName?: SortOrder
    keyword?: SortOrder
    manufactureDate?: SortOrder
    materialInfo?: SortOrder
    materialNumber?: SortOrder
    modelNM?: SortOrder
    optionMainimage?: SortOrder
    optionQty?: SortOrder
    optionSubimage?: SortOrder
    optionType?: SortOrder
    originCountryId?: SortOrder
    originRegionId?: SortOrder
    originOthers?: SortOrder
    originType?: SortOrder
    promotionName?: SortOrder
    retailPrice?: SortOrder
    seasonType?: SortOrder
    secondSubCat?: SortOrder
    sellerCode?: SortOrder
    shippingNo?: SortOrder
    sizetableType1?: SortOrder
    sizetableType1Value?: SortOrder
    sizetableType2?: SortOrder
    sizetableType2Value?: SortOrder
    sizetableType3?: SortOrder
    sizetableType3Value?: SortOrder
    styleNumber?: SortOrder
    tpoNumber?: SortOrder
    videoNumber?: SortOrder
    washinginfoFit?: SortOrder
    washinginfoLining?: SortOrder
    washinginfoSeethrough?: SortOrder
    washinginfoStretch?: SortOrder
    washinginfoThickness?: SortOrder
    washinginfoWashing?: SortOrder
    weight?: SortOrder
    taxRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastFetchDate?: SortOrder
  }

  export type Qoo10MoveProductAvgOrderByAggregateInput = {
    buyLimitQty?: SortOrder
    desiredShippingDate?: SortOrder
    itemPrice?: SortOrder
    retailPrice?: SortOrder
    weight?: SortOrder
  }

  export type Qoo10MoveProductMaxOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    adultYN?: SortOrder
    attributeInfo?: SortOrder
    availableDateValue?: SortOrder
    brandNo?: SortOrder
    buyLimitType?: SortOrder
    buyLimitDate?: SortOrder
    buyLimitQty?: SortOrder
    contactInfo?: SortOrder
    desiredShippingDate?: SortOrder
    expirationDateType?: SortOrder
    expirationDateMFD?: SortOrder
    expirationDatePAO?: SortOrder
    expirationDateEXP?: SortOrder
    expireDate?: SortOrder
    imageOtherUrl?: SortOrder
    industrialCode?: SortOrder
    industrialCodeType?: SortOrder
    itemDescription?: SortOrder
    itemPrice?: SortOrder
    itemSeriesName?: SortOrder
    keyword?: SortOrder
    manufactureDate?: SortOrder
    materialInfo?: SortOrder
    materialNumber?: SortOrder
    modelNM?: SortOrder
    optionMainimage?: SortOrder
    optionQty?: SortOrder
    optionSubimage?: SortOrder
    optionType?: SortOrder
    originCountryId?: SortOrder
    originRegionId?: SortOrder
    originOthers?: SortOrder
    originType?: SortOrder
    promotionName?: SortOrder
    retailPrice?: SortOrder
    seasonType?: SortOrder
    secondSubCat?: SortOrder
    sellerCode?: SortOrder
    shippingNo?: SortOrder
    sizetableType1?: SortOrder
    sizetableType1Value?: SortOrder
    sizetableType2?: SortOrder
    sizetableType2Value?: SortOrder
    sizetableType3?: SortOrder
    sizetableType3Value?: SortOrder
    styleNumber?: SortOrder
    tpoNumber?: SortOrder
    videoNumber?: SortOrder
    washinginfoFit?: SortOrder
    washinginfoLining?: SortOrder
    washinginfoSeethrough?: SortOrder
    washinginfoStretch?: SortOrder
    washinginfoThickness?: SortOrder
    washinginfoWashing?: SortOrder
    weight?: SortOrder
    taxRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastFetchDate?: SortOrder
  }

  export type Qoo10MoveProductMinOrderByAggregateInput = {
    id?: SortOrder
    itemCode?: SortOrder
    companyId?: SortOrder
    platformId?: SortOrder
    sellerId?: SortOrder
    sellerAuthKey?: SortOrder
    flag?: SortOrder
    adultYN?: SortOrder
    attributeInfo?: SortOrder
    availableDateValue?: SortOrder
    brandNo?: SortOrder
    buyLimitType?: SortOrder
    buyLimitDate?: SortOrder
    buyLimitQty?: SortOrder
    contactInfo?: SortOrder
    desiredShippingDate?: SortOrder
    expirationDateType?: SortOrder
    expirationDateMFD?: SortOrder
    expirationDatePAO?: SortOrder
    expirationDateEXP?: SortOrder
    expireDate?: SortOrder
    imageOtherUrl?: SortOrder
    industrialCode?: SortOrder
    industrialCodeType?: SortOrder
    itemDescription?: SortOrder
    itemPrice?: SortOrder
    itemSeriesName?: SortOrder
    keyword?: SortOrder
    manufactureDate?: SortOrder
    materialInfo?: SortOrder
    materialNumber?: SortOrder
    modelNM?: SortOrder
    optionMainimage?: SortOrder
    optionQty?: SortOrder
    optionSubimage?: SortOrder
    optionType?: SortOrder
    originCountryId?: SortOrder
    originRegionId?: SortOrder
    originOthers?: SortOrder
    originType?: SortOrder
    promotionName?: SortOrder
    retailPrice?: SortOrder
    seasonType?: SortOrder
    secondSubCat?: SortOrder
    sellerCode?: SortOrder
    shippingNo?: SortOrder
    sizetableType1?: SortOrder
    sizetableType1Value?: SortOrder
    sizetableType2?: SortOrder
    sizetableType2Value?: SortOrder
    sizetableType3?: SortOrder
    sizetableType3Value?: SortOrder
    styleNumber?: SortOrder
    tpoNumber?: SortOrder
    videoNumber?: SortOrder
    washinginfoFit?: SortOrder
    washinginfoLining?: SortOrder
    washinginfoSeethrough?: SortOrder
    washinginfoStretch?: SortOrder
    washinginfoThickness?: SortOrder
    washinginfoWashing?: SortOrder
    weight?: SortOrder
    taxRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastFetchDate?: SortOrder
  }

  export type Qoo10MoveProductSumOrderByAggregateInput = {
    buyLimitQty?: SortOrder
    desiredShippingDate?: SortOrder
    itemPrice?: SortOrder
    retailPrice?: SortOrder
    weight?: SortOrder
  }

  export type Qoo10NormalProductRelationFilter = {
    is?: Qoo10NormalProductWhereInput
    isNot?: Qoo10NormalProductWhereInput
  }

  export type NormalOptionCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name1?: SortOrder
    value1?: SortOrder
    name2?: SortOrder
    value2?: SortOrder
    name3?: SortOrder
    value3?: SortOrder
    name4?: SortOrder
    value4?: SortOrder
    name5?: SortOrder
    value5?: SortOrder
    price?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NormalOptionAvgOrderByAggregateInput = {
    price?: SortOrder
    qty?: SortOrder
  }

  export type NormalOptionMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name1?: SortOrder
    value1?: SortOrder
    name2?: SortOrder
    value2?: SortOrder
    name3?: SortOrder
    value3?: SortOrder
    name4?: SortOrder
    value4?: SortOrder
    name5?: SortOrder
    value5?: SortOrder
    price?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NormalOptionMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name1?: SortOrder
    value1?: SortOrder
    name2?: SortOrder
    value2?: SortOrder
    name3?: SortOrder
    value3?: SortOrder
    name4?: SortOrder
    value4?: SortOrder
    name5?: SortOrder
    value5?: SortOrder
    price?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NormalOptionSumOrderByAggregateInput = {
    price?: SortOrder
    qty?: SortOrder
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

  export type Qoo10MoveProductRelationFilter = {
    is?: Qoo10MoveProductWhereInput
    isNot?: Qoo10MoveProductWhereInput
  }

  export type MoveOptionCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    size?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoveOptionAvgOrderByAggregateInput = {
    qty?: SortOrder
    price?: SortOrder
  }

  export type MoveOptionMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    size?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoveOptionMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    size?: SortOrder
    qty?: SortOrder
    itemTypeCode?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoveOptionSumOrderByAggregateInput = {
    qty?: SortOrder
    price?: SortOrder
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

  export type NormalOptionCreateNestedManyWithoutProductInput = {
    create?: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput> | NormalOptionCreateWithoutProductInput[] | NormalOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: NormalOptionCreateOrConnectWithoutProductInput | NormalOptionCreateOrConnectWithoutProductInput[]
    createMany?: NormalOptionCreateManyProductInputEnvelope
    connect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
  }

  export type NormalOptionUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput> | NormalOptionCreateWithoutProductInput[] | NormalOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: NormalOptionCreateOrConnectWithoutProductInput | NormalOptionCreateOrConnectWithoutProductInput[]
    createMany?: NormalOptionCreateManyProductInputEnvelope
    connect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NormalOptionUpdateManyWithoutProductNestedInput = {
    create?: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput> | NormalOptionCreateWithoutProductInput[] | NormalOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: NormalOptionCreateOrConnectWithoutProductInput | NormalOptionCreateOrConnectWithoutProductInput[]
    upsert?: NormalOptionUpsertWithWhereUniqueWithoutProductInput | NormalOptionUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: NormalOptionCreateManyProductInputEnvelope
    set?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    disconnect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    delete?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    connect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    update?: NormalOptionUpdateWithWhereUniqueWithoutProductInput | NormalOptionUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: NormalOptionUpdateManyWithWhereWithoutProductInput | NormalOptionUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: NormalOptionScalarWhereInput | NormalOptionScalarWhereInput[]
  }

  export type NormalOptionUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput> | NormalOptionCreateWithoutProductInput[] | NormalOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: NormalOptionCreateOrConnectWithoutProductInput | NormalOptionCreateOrConnectWithoutProductInput[]
    upsert?: NormalOptionUpsertWithWhereUniqueWithoutProductInput | NormalOptionUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: NormalOptionCreateManyProductInputEnvelope
    set?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    disconnect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    delete?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    connect?: NormalOptionWhereUniqueInput | NormalOptionWhereUniqueInput[]
    update?: NormalOptionUpdateWithWhereUniqueWithoutProductInput | NormalOptionUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: NormalOptionUpdateManyWithWhereWithoutProductInput | NormalOptionUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: NormalOptionScalarWhereInput | NormalOptionScalarWhereInput[]
  }

  export type MoveOptionCreateNestedManyWithoutProductInput = {
    create?: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput> | MoveOptionCreateWithoutProductInput[] | MoveOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: MoveOptionCreateOrConnectWithoutProductInput | MoveOptionCreateOrConnectWithoutProductInput[]
    createMany?: MoveOptionCreateManyProductInputEnvelope
    connect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
  }

  export type MoveOptionUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput> | MoveOptionCreateWithoutProductInput[] | MoveOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: MoveOptionCreateOrConnectWithoutProductInput | MoveOptionCreateOrConnectWithoutProductInput[]
    createMany?: MoveOptionCreateManyProductInputEnvelope
    connect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
  }

  export type MoveOptionUpdateManyWithoutProductNestedInput = {
    create?: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput> | MoveOptionCreateWithoutProductInput[] | MoveOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: MoveOptionCreateOrConnectWithoutProductInput | MoveOptionCreateOrConnectWithoutProductInput[]
    upsert?: MoveOptionUpsertWithWhereUniqueWithoutProductInput | MoveOptionUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: MoveOptionCreateManyProductInputEnvelope
    set?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    disconnect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    delete?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    connect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    update?: MoveOptionUpdateWithWhereUniqueWithoutProductInput | MoveOptionUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: MoveOptionUpdateManyWithWhereWithoutProductInput | MoveOptionUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: MoveOptionScalarWhereInput | MoveOptionScalarWhereInput[]
  }

  export type MoveOptionUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput> | MoveOptionCreateWithoutProductInput[] | MoveOptionUncheckedCreateWithoutProductInput[]
    connectOrCreate?: MoveOptionCreateOrConnectWithoutProductInput | MoveOptionCreateOrConnectWithoutProductInput[]
    upsert?: MoveOptionUpsertWithWhereUniqueWithoutProductInput | MoveOptionUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: MoveOptionCreateManyProductInputEnvelope
    set?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    disconnect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    delete?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    connect?: MoveOptionWhereUniqueInput | MoveOptionWhereUniqueInput[]
    update?: MoveOptionUpdateWithWhereUniqueWithoutProductInput | MoveOptionUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: MoveOptionUpdateManyWithWhereWithoutProductInput | MoveOptionUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: MoveOptionScalarWhereInput | MoveOptionScalarWhereInput[]
  }

  export type Qoo10NormalProductCreateNestedOneWithoutOptionsInput = {
    create?: XOR<Qoo10NormalProductCreateWithoutOptionsInput, Qoo10NormalProductUncheckedCreateWithoutOptionsInput>
    connectOrCreate?: Qoo10NormalProductCreateOrConnectWithoutOptionsInput
    connect?: Qoo10NormalProductWhereUniqueInput
  }

  export type Qoo10NormalProductUpdateOneRequiredWithoutOptionsNestedInput = {
    create?: XOR<Qoo10NormalProductCreateWithoutOptionsInput, Qoo10NormalProductUncheckedCreateWithoutOptionsInput>
    connectOrCreate?: Qoo10NormalProductCreateOrConnectWithoutOptionsInput
    upsert?: Qoo10NormalProductUpsertWithoutOptionsInput
    connect?: Qoo10NormalProductWhereUniqueInput
    update?: XOR<XOR<Qoo10NormalProductUpdateToOneWithWhereWithoutOptionsInput, Qoo10NormalProductUpdateWithoutOptionsInput>, Qoo10NormalProductUncheckedUpdateWithoutOptionsInput>
  }

  export type Qoo10MoveProductCreateNestedOneWithoutMoveOptionInput = {
    create?: XOR<Qoo10MoveProductCreateWithoutMoveOptionInput, Qoo10MoveProductUncheckedCreateWithoutMoveOptionInput>
    connectOrCreate?: Qoo10MoveProductCreateOrConnectWithoutMoveOptionInput
    connect?: Qoo10MoveProductWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type Qoo10MoveProductUpdateOneRequiredWithoutMoveOptionNestedInput = {
    create?: XOR<Qoo10MoveProductCreateWithoutMoveOptionInput, Qoo10MoveProductUncheckedCreateWithoutMoveOptionInput>
    connectOrCreate?: Qoo10MoveProductCreateOrConnectWithoutMoveOptionInput
    upsert?: Qoo10MoveProductUpsertWithoutMoveOptionInput
    connect?: Qoo10MoveProductWhereUniqueInput
    update?: XOR<XOR<Qoo10MoveProductUpdateToOneWithWhereWithoutMoveOptionInput, Qoo10MoveProductUpdateWithoutMoveOptionInput>, Qoo10MoveProductUncheckedUpdateWithoutMoveOptionInput>
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
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
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
    isSet?: boolean
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
    isSet?: boolean
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

  export type NormalOptionCreateWithoutProductInput = {
    id?: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NormalOptionUncheckedCreateWithoutProductInput = {
    id?: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NormalOptionCreateOrConnectWithoutProductInput = {
    where: NormalOptionWhereUniqueInput
    create: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput>
  }

  export type NormalOptionCreateManyProductInputEnvelope = {
    data: NormalOptionCreateManyProductInput | NormalOptionCreateManyProductInput[]
  }

  export type NormalOptionUpsertWithWhereUniqueWithoutProductInput = {
    where: NormalOptionWhereUniqueInput
    update: XOR<NormalOptionUpdateWithoutProductInput, NormalOptionUncheckedUpdateWithoutProductInput>
    create: XOR<NormalOptionCreateWithoutProductInput, NormalOptionUncheckedCreateWithoutProductInput>
  }

  export type NormalOptionUpdateWithWhereUniqueWithoutProductInput = {
    where: NormalOptionWhereUniqueInput
    data: XOR<NormalOptionUpdateWithoutProductInput, NormalOptionUncheckedUpdateWithoutProductInput>
  }

  export type NormalOptionUpdateManyWithWhereWithoutProductInput = {
    where: NormalOptionScalarWhereInput
    data: XOR<NormalOptionUpdateManyMutationInput, NormalOptionUncheckedUpdateManyWithoutProductInput>
  }

  export type NormalOptionScalarWhereInput = {
    AND?: NormalOptionScalarWhereInput | NormalOptionScalarWhereInput[]
    OR?: NormalOptionScalarWhereInput[]
    NOT?: NormalOptionScalarWhereInput | NormalOptionScalarWhereInput[]
    id?: StringFilter<"NormalOption"> | string
    productId?: StringFilter<"NormalOption"> | string
    name1?: StringNullableFilter<"NormalOption"> | string | null
    value1?: StringNullableFilter<"NormalOption"> | string | null
    name2?: StringNullableFilter<"NormalOption"> | string | null
    value2?: StringNullableFilter<"NormalOption"> | string | null
    name3?: StringNullableFilter<"NormalOption"> | string | null
    value3?: StringNullableFilter<"NormalOption"> | string | null
    name4?: StringNullableFilter<"NormalOption"> | string | null
    value4?: StringNullableFilter<"NormalOption"> | string | null
    name5?: StringNullableFilter<"NormalOption"> | string | null
    value5?: StringNullableFilter<"NormalOption"> | string | null
    price?: FloatNullableFilter<"NormalOption"> | number | null
    qty?: IntNullableFilter<"NormalOption"> | number | null
    itemTypeCode?: StringNullableFilter<"NormalOption"> | string | null
    createdAt?: DateTimeFilter<"NormalOption"> | Date | string
    updatedAt?: DateTimeFilter<"NormalOption"> | Date | string
  }

  export type MoveOptionCreateWithoutProductInput = {
    id?: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoveOptionUncheckedCreateWithoutProductInput = {
    id?: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoveOptionCreateOrConnectWithoutProductInput = {
    where: MoveOptionWhereUniqueInput
    create: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput>
  }

  export type MoveOptionCreateManyProductInputEnvelope = {
    data: MoveOptionCreateManyProductInput | MoveOptionCreateManyProductInput[]
  }

  export type MoveOptionUpsertWithWhereUniqueWithoutProductInput = {
    where: MoveOptionWhereUniqueInput
    update: XOR<MoveOptionUpdateWithoutProductInput, MoveOptionUncheckedUpdateWithoutProductInput>
    create: XOR<MoveOptionCreateWithoutProductInput, MoveOptionUncheckedCreateWithoutProductInput>
  }

  export type MoveOptionUpdateWithWhereUniqueWithoutProductInput = {
    where: MoveOptionWhereUniqueInput
    data: XOR<MoveOptionUpdateWithoutProductInput, MoveOptionUncheckedUpdateWithoutProductInput>
  }

  export type MoveOptionUpdateManyWithWhereWithoutProductInput = {
    where: MoveOptionScalarWhereInput
    data: XOR<MoveOptionUpdateManyMutationInput, MoveOptionUncheckedUpdateManyWithoutProductInput>
  }

  export type MoveOptionScalarWhereInput = {
    AND?: MoveOptionScalarWhereInput | MoveOptionScalarWhereInput[]
    OR?: MoveOptionScalarWhereInput[]
    NOT?: MoveOptionScalarWhereInput | MoveOptionScalarWhereInput[]
    id?: StringFilter<"MoveOption"> | string
    productId?: StringFilter<"MoveOption"> | string
    color?: StringFilter<"MoveOption"> | string
    size?: StringFilter<"MoveOption"> | string
    qty?: IntFilter<"MoveOption"> | number
    itemTypeCode?: StringNullableFilter<"MoveOption"> | string | null
    price?: FloatNullableFilter<"MoveOption"> | number | null
    createdAt?: DateTimeFilter<"MoveOption"> | Date | string
    updatedAt?: DateTimeFilter<"MoveOption"> | Date | string
  }

  export type Qoo10NormalProductCreateWithoutOptionsInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    sellerCode?: string | null
    itemStatus?: string | null
    itemTitle?: string | null
    promotionName?: string | null
    mainCatCd?: string | null
    mainCatNm?: string | null
    firstSubCatCd?: string | null
    firstSubCatNm?: string | null
    secondSubCatCd?: string | null
    secondSubCatNm?: string | null
    drugType?: string | null
    productionPlaceType?: string | null
    productionPlace?: string | null
    industrialCodeType?: string | null
    industrialCode?: string | null
    retailPrice?: number | null
    itemPrice?: number | null
    taxRate?: number | null
    settlePrice?: number | null
    itemQty?: number | null
    expireDate?: Date | string | null
    shippingNo?: string | null
    modelNM?: string | null
    manufacturerDate?: string | null
    brandNo?: string | null
    material?: string | null
    adultYN?: string | null
    contactInfo?: string | null
    itemDetail?: string | null
    imageUrl?: string | null
    videoURL?: string | null
    keyword?: string | null
    listedDate?: Date | string | null
    changedDate?: Date | string | null
    lastFetchDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    availableDateType?: string | null
    availableDateValue?: string | null
    desiredShippingDate?: number | null
    weight?: number | null
    optionShippingNo1?: string | null
    optionShippingNo2?: string | null
  }

  export type Qoo10NormalProductUncheckedCreateWithoutOptionsInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    sellerCode?: string | null
    itemStatus?: string | null
    itemTitle?: string | null
    promotionName?: string | null
    mainCatCd?: string | null
    mainCatNm?: string | null
    firstSubCatCd?: string | null
    firstSubCatNm?: string | null
    secondSubCatCd?: string | null
    secondSubCatNm?: string | null
    drugType?: string | null
    productionPlaceType?: string | null
    productionPlace?: string | null
    industrialCodeType?: string | null
    industrialCode?: string | null
    retailPrice?: number | null
    itemPrice?: number | null
    taxRate?: number | null
    settlePrice?: number | null
    itemQty?: number | null
    expireDate?: Date | string | null
    shippingNo?: string | null
    modelNM?: string | null
    manufacturerDate?: string | null
    brandNo?: string | null
    material?: string | null
    adultYN?: string | null
    contactInfo?: string | null
    itemDetail?: string | null
    imageUrl?: string | null
    videoURL?: string | null
    keyword?: string | null
    listedDate?: Date | string | null
    changedDate?: Date | string | null
    lastFetchDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    availableDateType?: string | null
    availableDateValue?: string | null
    desiredShippingDate?: number | null
    weight?: number | null
    optionShippingNo1?: string | null
    optionShippingNo2?: string | null
  }

  export type Qoo10NormalProductCreateOrConnectWithoutOptionsInput = {
    where: Qoo10NormalProductWhereUniqueInput
    create: XOR<Qoo10NormalProductCreateWithoutOptionsInput, Qoo10NormalProductUncheckedCreateWithoutOptionsInput>
  }

  export type Qoo10NormalProductUpsertWithoutOptionsInput = {
    update: XOR<Qoo10NormalProductUpdateWithoutOptionsInput, Qoo10NormalProductUncheckedUpdateWithoutOptionsInput>
    create: XOR<Qoo10NormalProductCreateWithoutOptionsInput, Qoo10NormalProductUncheckedCreateWithoutOptionsInput>
    where?: Qoo10NormalProductWhereInput
  }

  export type Qoo10NormalProductUpdateToOneWithWhereWithoutOptionsInput = {
    where?: Qoo10NormalProductWhereInput
    data: XOR<Qoo10NormalProductUpdateWithoutOptionsInput, Qoo10NormalProductUncheckedUpdateWithoutOptionsInput>
  }

  export type Qoo10NormalProductUpdateWithoutOptionsInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type Qoo10NormalProductUncheckedUpdateWithoutOptionsInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    itemStatus?: NullableStringFieldUpdateOperationsInput | string | null
    itemTitle?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    mainCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    firstSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatCd?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCatNm?: NullableStringFieldUpdateOperationsInput | string | null
    drugType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlaceType?: NullableStringFieldUpdateOperationsInput | string | null
    productionPlace?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableFloatFieldUpdateOperationsInput | number | null
    settlePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemQty?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturerDate?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    material?: NullableStringFieldUpdateOperationsInput | string | null
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    itemDetail?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    videoURL?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    listedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availableDateType?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    optionShippingNo1?: NullableStringFieldUpdateOperationsInput | string | null
    optionShippingNo2?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type Qoo10MoveProductCreateWithoutMoveOptionInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    adultYN?: string | null
    attributeInfo?: string | null
    availableDateValue?: string | null
    brandNo?: string | null
    buyLimitType?: string | null
    buyLimitDate?: string | null
    buyLimitQty?: number | null
    contactInfo?: string | null
    desiredShippingDate?: number | null
    expirationDateType?: string | null
    expirationDateMFD?: string | null
    expirationDatePAO?: string | null
    expirationDateEXP?: string | null
    expireDate?: string | null
    imageOtherUrl?: string | null
    industrialCode?: string | null
    industrialCodeType?: string | null
    itemDescription?: string | null
    itemPrice?: number | null
    itemSeriesName?: string | null
    keyword?: string | null
    manufactureDate?: string | null
    materialInfo?: string | null
    materialNumber?: string | null
    modelNM?: string | null
    optionMainimage?: string | null
    optionQty?: string | null
    optionSubimage?: string | null
    optionType?: string | null
    originCountryId?: string | null
    originRegionId?: string | null
    originOthers?: string | null
    originType?: string | null
    promotionName?: string | null
    retailPrice?: number | null
    seasonType?: string | null
    secondSubCat?: string | null
    sellerCode?: string | null
    shippingNo?: string | null
    sizetableType1?: string | null
    sizetableType1Value?: string | null
    sizetableType2?: string | null
    sizetableType2Value?: string | null
    sizetableType3?: string | null
    sizetableType3Value?: string | null
    styleNumber?: string | null
    tpoNumber?: string | null
    videoNumber?: string | null
    washinginfoFit?: string | null
    washinginfoLining?: string | null
    washinginfoSeethrough?: string | null
    washinginfoStretch?: string | null
    washinginfoThickness?: string | null
    washinginfoWashing?: string | null
    weight?: number | null
    taxRate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastFetchDate?: Date | string | null
  }

  export type Qoo10MoveProductUncheckedCreateWithoutMoveOptionInput = {
    id?: string
    itemCode: string
    companyId: string
    platformId: string
    sellerId?: string | null
    sellerAuthKey?: string | null
    flag?: string
    adultYN?: string | null
    attributeInfo?: string | null
    availableDateValue?: string | null
    brandNo?: string | null
    buyLimitType?: string | null
    buyLimitDate?: string | null
    buyLimitQty?: number | null
    contactInfo?: string | null
    desiredShippingDate?: number | null
    expirationDateType?: string | null
    expirationDateMFD?: string | null
    expirationDatePAO?: string | null
    expirationDateEXP?: string | null
    expireDate?: string | null
    imageOtherUrl?: string | null
    industrialCode?: string | null
    industrialCodeType?: string | null
    itemDescription?: string | null
    itemPrice?: number | null
    itemSeriesName?: string | null
    keyword?: string | null
    manufactureDate?: string | null
    materialInfo?: string | null
    materialNumber?: string | null
    modelNM?: string | null
    optionMainimage?: string | null
    optionQty?: string | null
    optionSubimage?: string | null
    optionType?: string | null
    originCountryId?: string | null
    originRegionId?: string | null
    originOthers?: string | null
    originType?: string | null
    promotionName?: string | null
    retailPrice?: number | null
    seasonType?: string | null
    secondSubCat?: string | null
    sellerCode?: string | null
    shippingNo?: string | null
    sizetableType1?: string | null
    sizetableType1Value?: string | null
    sizetableType2?: string | null
    sizetableType2Value?: string | null
    sizetableType3?: string | null
    sizetableType3Value?: string | null
    styleNumber?: string | null
    tpoNumber?: string | null
    videoNumber?: string | null
    washinginfoFit?: string | null
    washinginfoLining?: string | null
    washinginfoSeethrough?: string | null
    washinginfoStretch?: string | null
    washinginfoThickness?: string | null
    washinginfoWashing?: string | null
    weight?: number | null
    taxRate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastFetchDate?: Date | string | null
  }

  export type Qoo10MoveProductCreateOrConnectWithoutMoveOptionInput = {
    where: Qoo10MoveProductWhereUniqueInput
    create: XOR<Qoo10MoveProductCreateWithoutMoveOptionInput, Qoo10MoveProductUncheckedCreateWithoutMoveOptionInput>
  }

  export type Qoo10MoveProductUpsertWithoutMoveOptionInput = {
    update: XOR<Qoo10MoveProductUpdateWithoutMoveOptionInput, Qoo10MoveProductUncheckedUpdateWithoutMoveOptionInput>
    create: XOR<Qoo10MoveProductCreateWithoutMoveOptionInput, Qoo10MoveProductUncheckedCreateWithoutMoveOptionInput>
    where?: Qoo10MoveProductWhereInput
  }

  export type Qoo10MoveProductUpdateToOneWithWhereWithoutMoveOptionInput = {
    where?: Qoo10MoveProductWhereInput
    data: XOR<Qoo10MoveProductUpdateWithoutMoveOptionInput, Qoo10MoveProductUncheckedUpdateWithoutMoveOptionInput>
  }

  export type Qoo10MoveProductUpdateWithoutMoveOptionInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type Qoo10MoveProductUncheckedUpdateWithoutMoveOptionInput = {
    itemCode?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    platformId?: StringFieldUpdateOperationsInput | string
    sellerId?: NullableStringFieldUpdateOperationsInput | string | null
    sellerAuthKey?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: StringFieldUpdateOperationsInput | string
    adultYN?: NullableStringFieldUpdateOperationsInput | string | null
    attributeInfo?: NullableStringFieldUpdateOperationsInput | string | null
    availableDateValue?: NullableStringFieldUpdateOperationsInput | string | null
    brandNo?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitType?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitDate?: NullableStringFieldUpdateOperationsInput | string | null
    buyLimitQty?: NullableIntFieldUpdateOperationsInput | number | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    desiredShippingDate?: NullableIntFieldUpdateOperationsInput | number | null
    expirationDateType?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateMFD?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDatePAO?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDateEXP?: NullableStringFieldUpdateOperationsInput | string | null
    expireDate?: NullableStringFieldUpdateOperationsInput | string | null
    imageOtherUrl?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCode?: NullableStringFieldUpdateOperationsInput | string | null
    industrialCodeType?: NullableStringFieldUpdateOperationsInput | string | null
    itemDescription?: NullableStringFieldUpdateOperationsInput | string | null
    itemPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    itemSeriesName?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    manufactureDate?: NullableStringFieldUpdateOperationsInput | string | null
    materialInfo?: NullableStringFieldUpdateOperationsInput | string | null
    materialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    modelNM?: NullableStringFieldUpdateOperationsInput | string | null
    optionMainimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionQty?: NullableStringFieldUpdateOperationsInput | string | null
    optionSubimage?: NullableStringFieldUpdateOperationsInput | string | null
    optionType?: NullableStringFieldUpdateOperationsInput | string | null
    originCountryId?: NullableStringFieldUpdateOperationsInput | string | null
    originRegionId?: NullableStringFieldUpdateOperationsInput | string | null
    originOthers?: NullableStringFieldUpdateOperationsInput | string | null
    originType?: NullableStringFieldUpdateOperationsInput | string | null
    promotionName?: NullableStringFieldUpdateOperationsInput | string | null
    retailPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    seasonType?: NullableStringFieldUpdateOperationsInput | string | null
    secondSubCat?: NullableStringFieldUpdateOperationsInput | string | null
    sellerCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingNo?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType1Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType2Value?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3?: NullableStringFieldUpdateOperationsInput | string | null
    sizetableType3Value?: NullableStringFieldUpdateOperationsInput | string | null
    styleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tpoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    videoNumber?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoFit?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoLining?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoSeethrough?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoStretch?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoThickness?: NullableStringFieldUpdateOperationsInput | string | null
    washinginfoWashing?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    taxRate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastFetchDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NormalOptionCreateManyProductInput = {
    id?: string
    name1?: string | null
    value1?: string | null
    name2?: string | null
    value2?: string | null
    name3?: string | null
    value3?: string | null
    name4?: string | null
    value4?: string | null
    name5?: string | null
    value5?: string | null
    price?: number | null
    qty?: number | null
    itemTypeCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NormalOptionUpdateWithoutProductInput = {
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NormalOptionUncheckedUpdateWithoutProductInput = {
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NormalOptionUncheckedUpdateManyWithoutProductInput = {
    name1?: NullableStringFieldUpdateOperationsInput | string | null
    value1?: NullableStringFieldUpdateOperationsInput | string | null
    name2?: NullableStringFieldUpdateOperationsInput | string | null
    value2?: NullableStringFieldUpdateOperationsInput | string | null
    name3?: NullableStringFieldUpdateOperationsInput | string | null
    value3?: NullableStringFieldUpdateOperationsInput | string | null
    name4?: NullableStringFieldUpdateOperationsInput | string | null
    value4?: NullableStringFieldUpdateOperationsInput | string | null
    name5?: NullableStringFieldUpdateOperationsInput | string | null
    value5?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    qty?: NullableIntFieldUpdateOperationsInput | number | null
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionCreateManyProductInput = {
    id?: string
    color: string
    size: string
    qty: number
    itemTypeCode?: string | null
    price?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoveOptionUpdateWithoutProductInput = {
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionUncheckedUpdateWithoutProductInput = {
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoveOptionUncheckedUpdateManyWithoutProductInput = {
    color?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    itemTypeCode?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use Qoo10NormalProductCountOutputTypeDefaultArgs instead
     */
    export type Qoo10NormalProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Qoo10NormalProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use Qoo10MoveProductCountOutputTypeDefaultArgs instead
     */
    export type Qoo10MoveProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Qoo10MoveProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use Qoo10NormalProductDefaultArgs instead
     */
    export type Qoo10NormalProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Qoo10NormalProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use Qoo10MoveProductDefaultArgs instead
     */
    export type Qoo10MoveProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Qoo10MoveProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NormalOptionDefaultArgs instead
     */
    export type NormalOptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NormalOptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MoveOptionDefaultArgs instead
     */
    export type MoveOptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MoveOptionDefaultArgs<ExtArgs>

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