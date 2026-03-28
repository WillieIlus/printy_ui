export function normalizeTextValue(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value).trim()
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (typeof record.value === 'string' || typeof record.value === 'number') {
      return normalizeTextValue(record.value)
    }
    if (typeof record.id === 'string' || typeof record.id === 'number') {
      return normalizeTextValue(record.id)
    }
    if (typeof record.label === 'string') {
      return record.label.trim()
    }
  }
  return ''
}

export function normalizeOptionalText(value: unknown): string | null {
  const normalized = normalizeTextValue(value)
  return normalized ? normalized : null
}

export function normalizeNumberValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const normalized = normalizeTextValue(value)
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function normalizeSelectValue<T extends string | number>(value: unknown): T | null {
  if (typeof value === 'string' || typeof value === 'number') return value as T
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (typeof record.value === 'string' || typeof record.value === 'number') {
      return record.value as T
    }
    if (typeof record.id === 'string' || typeof record.id === 'number') {
      return record.id as T
    }
  }
  return null
}

export function normalizeOptionalSelectValue<T extends string | number>(value: unknown): T | null {
  const normalized = normalizeSelectValue<T>(value)
  if (typeof normalized === 'string') {
    const trimmed = normalized.trim()
    return trimmed ? trimmed as T : null
  }
  return normalized
}

export function normalizeStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  return values.map(normalizeTextValue).filter(Boolean)
}
