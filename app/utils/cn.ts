type ClassValue = string | number | false | null | undefined | ClassValue[] | Record<string, unknown>

function normalizeClass(value: ClassValue): string[] {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value.flatMap(item => normalizeClass(item))
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className)
  }
  return [String(value)]
}

export function cn(...values: ClassValue[]) {
  return values.flatMap(value => normalizeClass(value)).join(' ')
}
