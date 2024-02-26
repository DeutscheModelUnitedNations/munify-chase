type UndefinedIfNull<T> = T extends null ? undefined : T extends (infer U)[] ? UndefinedIfNull<U>[] : T extends object ? { [K in keyof T]: UndefinedIfNull<T[K]> } : T;

export function nullToUndefined<T>(obj: T): UndefinedIfNull<T> {
  if (obj === null) {
    return undefined as any;
  }

  if (typeof obj === "object") {
    const newObj: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      newObj[key] = nullToUndefined(obj[key]);
    }
    return newObj;
  }

  return obj as any;
}