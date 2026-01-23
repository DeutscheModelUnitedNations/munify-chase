# RUMBLE.md

Comprehensive documentation for Rumble (`@m1212e/rumble`) patterns used in this codebase.

## Overview

Rumble is an ability-based authorization + GraphQL builder that wraps Drizzle ORM and Pothos. It provides:

1. **Abilities System** - Declarative access control rules tied to database tables
2. **Drizzle Integration** - Type-safe queries with automatic ability filtering
3. **GraphQL Generation** - Auto-generated schema, queries, mutations, and subscriptions
4. **Client Generation** - Typed frontend client with live queries

This enables type-safe end-to-end development: `DB Schema → GraphQL → Frontend` with built-in authorization.

## Initialization (`src/api/rumble.ts`)

```typescript
import { rumble } from '@m1212e/rumble';
import { context } from './context';
import { db } from './db/db';

export const {
  abilityBuilder, // Define access control rules
  schemaBuilder, // Pothos schema builder for custom types/mutations
  object, // Create GraphQL object types from tables
  query, // Generate findFirst/findMany queries
  pubsub, // Create pubsub for real-time subscriptions
  createYoga, // Create GraphQL Yoga server instance
  enum_, // Expose Drizzle enums as GraphQL enums
  clientCreator, // Generate typed frontend client
  orderArg, // Generate order-by argument for queries
  whereArg, // Generate where argument for queries
  countQuery // Generate count queries
} = rumble({
  db,
  context,
  defaultLimit: 300
});
```

## Context (`src/api/context.ts`)

The context function runs on each request and provides authentication helpers:

```typescript
export async function context(req: RequestEvent) {
  return {
    ...req.locals,
    mustBeLoggedIn: () => {
      if (!req.locals.oidc?.user) {
        throw new Error('Must be logged in');
      }
      return req.locals.oidc.user; // Returns OIDC user with .sub, .email, etc.
    },
    hasRole(role: string) {
      return OIDCRoleNames.includes(role);
    }
  };
}
```

Context is automatically passed to ability functions and resolvers.

## Abilities System

Abilities define who can perform what actions on which data. Actions are: `read`, `create`, `update`, `delete`.

### Defining Abilities

```typescript
// Allow read when user is a conference member
abilityBuilder.conference.allow('read').when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();

  return {
    where: {
      users: {
        user: {
          id: user.sub
        }
      }
    }
  };
});

// Allow multiple actions
abilityBuilder.committeeMember.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  // Return "allow" for unrestricted access, or { where: {...} } for filtered access
  return 'allow';
});
```

### Using Abilities in Resolvers

Abilities are accessed via `ctx.abilities.<table>`:

```typescript
// Get SQL where clause for direct Drizzle queries
ctx.abilities.committeeMember.filter('update').sql.where

// Merge with custom filters and get Drizzle query config
ctx.abilities.speakersList.filter('read').merge({
  where: { id: args.id }
}).query.single   // For findFirst
}).query.many     // For findMany

// Full example in a mutation
await db.update(schema.committeeMember)
  .set({ present: args.present })
  .where(and(
    inArray(schema.committeeMember.id, args.ids),
    ctx.abilities.committeeMember.filter('update').sql.where  // Authorization
  ));
```

## Handler Patterns

Handlers in `src/api/handlers/*.ts` define GraphQL types and operations for each entity.

### Basic Handler Structure

```typescript
import { db, schema } from '$api/db/db';
import {
  abilityBuilder,
  countQuery,
  object,
  query,
  pubsub as rumblePubsub,
  schemaBuilder
} from '$api/rumble';

// 1. Define abilities (optional if using defaults)
// abilityBuilder.committeeMember.allow(['read']).when(...);

// 2. Create GraphQL object type
const ref = object({ table: 'committeeMember' });

// 3. Generate standard queries (findFirst, findMany)
query({ table: 'committeeMember' });

// 4. Generate count query
countQuery({ table: 'committeeMember' });

// 5. Create pubsub for real-time updates
const pubsub = rumblePubsub({ table: 'committeeMember' });
```

### Custom Fields with `adjust`

Add computed fields or override default behavior:

```typescript
const ref = object({
  table: 'committee',
  adjust: (t) => ({
    // Simple computed field
    totalPresent: t.field({
      type: 'Int',
      resolve: (parent) => calculateTotal(parent)
    }),

    // Field with arguments using Drizzle
    uniqueConferenceMembers: t.drizzleField({
      type: [ConferenceMemberRef],
      args: {
        where: t.arg({ type: ConferenceMemberWhereInput })
      },
      resolve: async (query, parent, args, ctx) => {
        return db.query.conferenceMember.findMany(
          query({
            ...ctx.abilities.conferenceMember.filter('read').merge({
              where: { ...args.where, conferenceId: parent.id }
            }).query.many,
            with: { representation: true }
          })
        );
      }
    })
  })
});
```

### Exporting Types and Args

Export refs and args for use in other handlers:

```typescript
export const SpeakersListRef = ref;
export const SpeakerOnWhereArgs = whereArg({ table: 'speakerOnList' });
```

## Mutations

Define mutations using `schemaBuilder.mutationFields`:

```typescript
schemaBuilder.mutationFields((t) => ({
  setPresenceForCommitteeMembers: t.drizzleField({
    type: [ref], // Return type
    args: {
      ids: t.arg.idList({ required: true }),
      present: t.arg.boolean({ required: true })
    },
    resolve: async (query, _root, args, ctx) => {
      // 1. Perform update with ability filter
      await db
        .update(schema.committeeMember)
        .set({ present: args.present })
        .where(
          and(
            inArray(schema.committeeMember.id, args.ids),
            ctx.abilities.committeeMember.filter('update').sql.where
          )
        );

      // 2. Notify subscribers
      pubsub.updated(args.ids);

      // 3. Return updated data with ability-filtered read
      return db.query.committeeMember.findMany(
        query(
          ctx.abilities.committeeMember.filter('read').merge({
            where: { id: { in: args.ids } }
          }).query.single
        )
      );
    }
  })
}));
```

### Common Mutation Patterns

**Update with transactions:**

```typescript
resolve: async (query, root, args, ctx) => {
  await db.transaction(async (tx) => {
    // Complex multi-step logic
    await tx.update(...);
    await tx.insert(...);
  });

  pubsub.updated(args.id);
  return db.query.entity.findFirst(...).then(assertFindFirstExists);
}
```

**Create with validation:**

```typescript
resolve: async (query, root, args, ctx) => {
  if (!args.committeeMemberId && !args.conferenceMemberId) {
    throw new GraphQLError('Must set either committeeMemberId or conferenceMemberId');
  }

  const created = await db.insert(schema.entity).values({...}).returning();
  pubsub.created();
  return db.query.entity.findFirst(...);
}
```

**Delete with cascade handling:**

```typescript
resolve: async (query, root, args, ctx) => {
  const deleted = await db
    .delete(schema.entity)
    .where(and(eq(schema.entity.id, args.id), ctx.abilities.entity.filter('delete').sql.where))
    .returning()
    .then(assertFirstEntryExists);

  pubsub.removed();
  return deleted;
};
```

## PubSub for Real-time Updates

PubSub triggers `liveQuery` subscriptions on the frontend.

```typescript
const pubsub = rumblePubsub({ table: 'committeeMember' });

// Notify after create
pubsub.created();

// Notify after update (single or multiple)
pubsub.updated(args.id);
pubsub.updated([id1, id2, id3]);

// Notify after delete
pubsub.removed();
```

## Enums

Expose Drizzle enums in GraphQL:

```typescript
const statusEnum = enum_({
  tsName: 'committeeStatus'  // References Drizzle enum name
});

// Use in args
schemaBuilder.mutationFields((t) => ({
  updateCommittee: t.drizzleField({
    args: {
      status: t.arg({ type: statusEnum })
    },
    ...
  })
}));
```

## Frontend: urql Client (`src/lib/api/customClient.ts`)

```typescript
import { nativeDateExchange } from '@m1212e/rumble/client';
import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';

export const urqlClient = new Client({
  url: '/api/graphql',
  fetchSubscriptions: true,
  exchanges: [
    cacheExchange({ schema, keys: {...} }),
    nativeDateExchange,           // Rumble's native Date serialization
    remoteFunctionsExchange,      // SSR via SvelteKit remote functions
    fetchExchange
  ],
  fetchOptions: { credentials: 'include' },
  requestPolicy: 'cache-and-network'
});
```

The `remoteFunctionsExchange` executes GraphQL on the server during SSR via SvelteKit remote functions, avoiding extra HTTP roundtrips.

## Frontend: liveQuery Pattern

`liveQuery` provides initial data + automatic subscription to updates.

```typescript
// src/lib/queries/commitee.svelte.ts
import { page } from '$app/state';
import { client } from '$lib/api/rumbleClient/client';

export const committeeQuery = () =>
  client.liveQuery.committee({
    __args: {
      id: page.params.conferenceId!
    },
    id: true,
    name: true,
    status: true,
    members: {
      id: true,
      present: true,
      representation: {
        name: true,
        alpha2Code: true
      }
    }
  });
```

Usage in components:

```svelte
<script lang="ts">
  import { committeeQuery } from '$lib/queries/commitee.svelte';

  const committee = committeeQuery();
</script>

{#if committee.data}
  <h1>{committee.data.name}</h1>
{/if}
```

## Frontend: Queries and Mutations

```typescript
// Simple query
const user = await client.query.me({
  email: true,
  sub: true
});

// Mutation
await client.mutate.setPresenceForCommitteeMembers({
  __args: { ids: memberIds, present: true },
  id: true,
  present: true
});
```

## Type Safety Chain

```
Drizzle Schema (src/api/db/schema.ts)
         ↓ rumble() reads table definitions
GraphQL Schema (auto-generated schema.graphql)
         ↓ clientCreator() generates
Rumble Client (src/lib/api/rumbleClient/)
         ↓ typed selection sets in queries
Component Usage (fully typed responses)
```

## Client Generation (`src/api/handlers/register.ts`)

The client is generated during dev/build:

```typescript
import { clientCreator } from '$api/rumble';
import { building, dev } from '$app/environment';

// Import all handlers to register them
import './agendaItem';
import './committee';
// ...etc

if (dev || building) {
  clientCreator({
    outputPath: 'src/lib/api/rumbleClient',
    apiUrl: '/api/graphql',
    useExternalUrqlClient: '../customClient', // Use our custom urql client
    removeExisting: false
  });
}
```

## Key Files Reference

| File                                | Purpose                                  |
| ----------------------------------- | ---------------------------------------- |
| `src/api/rumble.ts`                 | Rumble initialization, exports helpers   |
| `src/api/context.ts`                | Request context with auth helpers        |
| `src/api/handlers/*.ts`             | GraphQL type/query/mutation definitions  |
| `src/api/handlers/register.ts`      | Handler registration + client generation |
| `src/api/db/schema.ts`              | Drizzle table definitions                |
| `src/api/db/relations.ts`           | Drizzle table relationships              |
| `src/lib/api/customClient.ts`       | urql client configuration                |
| `src/lib/api/rumbleClient/`         | Generated client (gitignored)            |
| `src/lib/queries/*.svelte.ts`       | Frontend query functions                 |
| `src/routes/api/graphql/+server.ts` | GraphQL endpoint                         |

## Common Utilities from Rumble

```typescript
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';

// Throws if findFirst returns null
const entity = await db.query.table.findFirst(...).then(assertFindFirstExists);

// Throws if returning() array is empty
const created = await db.insert(...).returning().then(assertFirstEntryExists);
```
