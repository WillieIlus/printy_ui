import { object, string, number, ref as yupRef } from 'yup'

/** Common yup schemas and helpers for forms */
export function useValidation() {
  const email = () => string().email('Invalid email').required('Email is required')
  const requiredString = (label: string) => string().required(`${label} is required`)
  const optionalString = () => string().optional()
  const password = (min = 8) =>
    string()
      .min(min, `Password must be at least ${min} characters`)
      .required('Password is required')
  const passwordConfirm = (passwordField = 'password') =>
    string()
      .oneOf([yupRef(passwordField)], 'Passwords must match')
      .required('Please confirm your password')

  /** Login form schema */
  const loginSchema = object({
    email: email(),
    password: password(),
  })

  /** Signup form schema */
  const signupSchema = object({
    first_name: requiredString('First name'),
    last_name: requiredString('Last name'),
    email: email(),
    password: password()
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[0-9]/, 'Password must contain a number'),
    password_confirm: passwordConfirm('password'),
  })

  /** Forgot password schema */
  const forgotPasswordSchema = object({
    email: email(),
  })

  return {
    email,
    requiredString,
    optionalString,
    password,
    passwordConfirm,
    loginSchema,
    signupSchema,
    forgotPasswordSchema,
    object,
    string,
    number,
    yupRef,
  }
}
