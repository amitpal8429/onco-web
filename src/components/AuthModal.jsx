import { useEffect, useRef, useState } from 'react'
import Field from './Field.jsx'

const MODES = {
  login: {
    title: 'Login',
    submitLabel: 'Login',
    demoMessage: 'Form validated. This is a demo, so you are not logged in.',
    switchPrompt: 'New here?',
    switchLabel: 'Sign Up',
    switchTo: 'signup',
    passwordAutoComplete: 'current-password',
    passwordMinLength: 1,
    passwordError: 'Please enter your password.',
  },
  signup: {
    title: 'Sign Up',
    submitLabel: 'Create Account',
    demoMessage: 'Form validated. This is a demo, so no account was created.',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Login',
    switchTo: 'login',
    passwordAutoComplete: 'new-password',
    passwordMinLength: 8,
    passwordError: 'Please use at least 8 characters.',
  },
}

function validate(mode, values) {
  const errors = {}

  if (mode === 'signup' && values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (values.password.length < MODES[mode].passwordMinLength) errors.password = MODES[mode].passwordError

  return errors
}

// TODO: Connect a real auth service in handleSubmit, then change demoMessage. Nothing is sent or stored yet.
function AuthForm({ mode, onSwitchMode }) {
  const config = MODES[mode]
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validate(mode, values)
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      form.elements[firstInvalid].focus()
      return
    }

    setValues((current) => ({ ...current, password: '' }))
    setSubmitted(true)
  }

  return (
    <>
      <h2 id="auth-modal-title" className="pr-10 text-2xl font-semibold text-primary-900">
        {config.title}
      </h2>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {mode === 'signup' && (
          <Field
            label="Name"
            name="name"
            id="auth-name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
          />
        )}
        <Field
          label="Email"
          name="email"
          id="auth-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          label="Password"
          name="password"
          id="auth-password"
          type="password"
          autoComplete={config.passwordAutoComplete}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <button type="submit" className="btn-primary w-full">
          {config.submitLabel}
        </button>
        <p role="status" className="text-sm font-medium text-primary-700">
          {submitted && config.demoMessage}
        </p>
      </form>
      <p className="mt-2 text-sm text-ink-600">
        {config.switchPrompt}{' '}
        <button
          type="button"
          onClick={() => onSwitchMode(config.switchTo)}
          className="font-semibold text-primary-700 underline underline-offset-4"
        >
          {config.switchLabel}
        </button>
      </p>
    </>
  )
}

// `mode` is 'login', 'signup', or null when closed. The native dialog handles the focus trap and Escape.
export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (mode) {
      if (!dialog.open) dialog.showModal()
      dialog.querySelector('input').focus()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [mode])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-modal-title"
      onClose={onClose}
      onMouseDown={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-sm bg-white text-ink-900 shadow-xl backdrop:bg-primary-900/60"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-sm text-2xl leading-none text-ink-600 transition-colors hover:bg-mist-100"
        >
          ×
        </button>
        {mode && <AuthForm key={mode} mode={mode} onSwitchMode={onSwitchMode} />}
      </div>
    </dialog>
  )
}
