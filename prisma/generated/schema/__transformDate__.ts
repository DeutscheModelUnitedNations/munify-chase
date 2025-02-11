import { type StringOptions, t } from "elysia";
export const __transformDate__ = (options?: StringOptions) =>
  t
    .Transform(t.String({ format: "date-time", ...options }))
    .Decode((value) => new Date(value))
    .Encode((value) => value.toISOString());
