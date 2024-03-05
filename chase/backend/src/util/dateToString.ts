type StringIfDate<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? StringIfDate<U>[]
    : T extends object
      ? { [K in keyof T]: StringIfDate<T[K]> }
      : T;

export function recursiveDateFieldsToString<T>(obj: T): StringIfDate<T> {
  if (obj instanceof Date) {
    // biome-ignore lint/suspicious/noExplicitAny:
    return obj.toISOString() as any;
  }

  if (typeof obj === "object" && obj !== null) {
    // biome-ignore lint/suspicious/noExplicitAny:
    const newObj: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      // biome-ignore lint/suspicious/noPrototypeBuiltins:
      if (obj.hasOwnProperty(key)) {
        newObj[key] = recursiveDateFieldsToString(obj[key]);
      }
    }
    return newObj;
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  return obj as any;
}
