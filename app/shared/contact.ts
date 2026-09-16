import type { ApiClient } from '~/shared/api'
import { API } from '~/shared/api-paths'

export type ContactTopic = 'quote' | 'partner' | 'manager' | 'other'

export interface ContactFormValues {
  topic: ContactTopic
  name: string
  email: string
  message: string
}

export const CONTACT_MIN_MESSAGE_LENGTH = 8

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(values: ContactFormValues): string | null {
  if (
    !values.name.trim() ||
    !EMAIL_RE.test(values.email) ||
    values.message.trim().length < CONTACT_MIN_MESSAGE_LENGTH
  ) {
    return 'Add your name, a valid email and a short message.'
  }
  return null
}

export async function submitContactMessage(values: ContactFormValues, api: ApiClient): Promise<void> {
  await api<{ id: number }>(API.contact.submit, {
    method: 'POST',
    body: {
      topic: values.topic,
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    },
  })
}