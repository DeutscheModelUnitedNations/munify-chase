// TODO: this is a TEMPORARY solution for munbw 2025
// this should be changed!
export function isDMUNEmail(email: string) {
  return (
    email.endsWith("@dmun.de") ||
    email.endsWith("@munbw.de") ||
    email.endsWith("@mun-sh.de")
  );
}
