import { definePrismaObject, defineFieldObject } from "../utils";

export const ConferenceCreationTokenObject = definePrismaObject(
  "ConferenceCreationToken",
  {
    description: "Consumeable token which grants the creation of a conference",
    findUnique: ({ token }) => ({ token }),
    fields: (t) => ({
      token: t.field(ConferenceCreationTokenTokenFieldObject),
    }),
  },
);

export const ConferenceCreationTokenTokenFieldObject = defineFieldObject(
  "ConferenceCreationToken",
  {
    type: "ID",
    description: undefined,
    nullable: false,
    resolve: (parent) => String(parent.token),
  },
);
