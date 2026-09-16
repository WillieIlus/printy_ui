import { describe, it, expect, vi } from 'vitest'
import { CONTACT_MIN_MESSAGE_LENGTH, submitContactMessage, validateContactForm, type ContactFormValues } from '~/shared/contact'

function validValues(): ContactFormValues {
  return { topic: 'quote', name: 'Ava Lindqvist', email: 'ava@printy.ke', message: 'I have a question about a large order.' }
}

describe('validateContactForm', () => {
  it('accepts a complete, valid submission', () => {
    expect(validateContactForm(validValues())).toBeNull()
  })

  it('rejects a blank name', () => {
    expect(validateContactForm({ ...validValues(), name: '   ' })).toBe('Add your name, a valid email and a short message.')
  })

  it('rejects an invalid email', () => {
    expect(validateContactForm({ ...validValues(), email: 'not-an-email' })).toBe(
      'Add your name, a valid email and a short message.',
    )
  })

  it(`rejects a message shorter than ${CONTACT_MIN_MESSAGE_LENGTH} characters`, () => {
    expect(validateContactForm({ ...validValues(), message: 'hi' })).toBe(
      'Add your name, a valid email and a short message.',
    )
  })
})

describe('submitContactMessage', () => {
  it('posts to the real contact endpoint with trimmed fields', async () => {
    const api = vi.fn().mockResolvedValue({ id: 3 })
    await submitContactMessage({ ...validValues(), name: '  Ava Lindqvist  ', message: '  short message body here  ' }, api as never)

    expect(api).toHaveBeenCalledWith('/contact/submit/', {
      method: 'POST',
      body: { topic: 'quote', name: 'Ava Lindqvist', email: 'ava@printy.ke', message: 'short message body here' },
    })
  })

  it('propagates a backend failure so the caller can surface an error state', async () => {
    const api = vi.fn().mockRejectedValue(new Error('server down'))
    await expect(submitContactMessage(validValues(), api as never)).rejects.toThrow('server down')
  })
})