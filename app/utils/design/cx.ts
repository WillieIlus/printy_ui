/** Port of cn/clsx-style source `cx`; falsy parts are omitted. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
