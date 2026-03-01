/** Client-side validation helpers (use yup in forms via useValidation composable) */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}
