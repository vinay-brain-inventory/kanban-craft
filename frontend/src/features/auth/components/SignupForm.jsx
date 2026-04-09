import { useMemo, useState } from 'react'
import { clearAuthError, signUp } from '../authSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupForm({ onSwitch }) {
  const dispatch = useAppDispatch()
  const error = useAppSelector((s) => s.auth.error)
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [touched, setTouched] = useState({})

  const fieldErrors = useMemo(() => {
    const e = {}
    if (!values.name.trim()) e.name = 'Name is required'
    if (!values.email.trim()) e.email = 'Email is required'
    else if (!emailRx.test(values.email.trim())) e.email = 'Enter a valid email'
    if (!values.password) e.password = 'Password is required'
    else if (values.password.length < 6) e.password = 'Use at least 6 characters'
    return e
  }, [values])

  const canSubmit = Object.keys(fieldErrors).length === 0

  const setField = (key) => (ev) => {
    if (error) dispatch(clearAuthError())
    setValues((v) => ({ ...v, [key]: ev.target.value }))
  }

  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  const submit = (ev) => {
    ev.preventDefault()
    setTouched({ name: true, email: true, password: true })
    if (!canSubmit) return
    dispatch(signUp(values))
  }

  return (
    <form className="stack" onSubmit={submit}>
      <Input
        label="Name"
        value={values.name}
        onChange={setField('name')}
        onBlur={onBlur('name')}
        error={touched.name ? fieldErrors.name : null}
        placeholder="Vinay Sharma"
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={setField('email')}
        onBlur={onBlur('email')}
        error={touched.email ? fieldErrors.email : null}
        placeholder="you@domain.com"
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={setField('password')}
        onBlur={onBlur('password')}
        error={touched.password ? fieldErrors.password : null}
        placeholder="min 6 chars"
      />
      {error ? <div className="alert">{error}</div> : null}
      <div className="row">
        <Button type="submit" disabled={!canSubmit}>
          Sign up
        </Button>
        <Button type="button" variant="ghost" onClick={onSwitch}>
          Back to login
        </Button>
      </div>
    </form>
  )
}

