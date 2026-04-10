import { useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { clearAuthError, logIn } from '../authSlice'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Props = {
  onSwitch?: () => void
}

type Values = {
  email: string
  password: string
}

export default function LoginForm({ onSwitch }: Props) {
  const dispatch = useAppDispatch()
  const error = useAppSelector((s) => s.auth.error)
  const [values, setValues] = useState<Values>({ email: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const fieldErrors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!values.email.trim()) e.email = 'Email is required'
    else if (!emailRx.test(values.email.trim())) e.email = 'Enter a valid email'
    if (!values.password) e.password = 'Password is required'
    return e
  }, [values])

  const canSubmit = Object.keys(fieldErrors).length === 0

  const setField =
    (key: keyof Values) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (error) dispatch(clearAuthError())
      setValues((v) => ({ ...v, [key]: ev.target.value }))
    }

  const onBlur = (key: keyof Values) => () => setTouched((t) => ({ ...t, [key]: true }))

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setTouched({ email: true, password: true })
    if (!canSubmit) return
    dispatch(logIn({ email: values.email, password: values.password }))
  }

  return (
    <form className="stack" onSubmit={submit}>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={setField('email')}
        onBlur={onBlur('email')}
        error={touched.email ? (fieldErrors.email ?? null) : null}
        placeholder="demo@kanban.craft"
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={setField('password')}
        onBlur={onBlur('password')}
        error={touched.password ? (fieldErrors.password ?? null) : null}
        placeholder="demo1234"
      />
      {error ? <div className="alert">{error}</div> : null}
      <div className="row">
        <Button type="submit" disabled={!canSubmit}>
          Log in
        </Button>
        <Button type="button" variant="ghost" onClick={onSwitch}>
          Create account
        </Button>
      </div>
      <div className="hint">
        Demo credentials: <span className="mono">demo@kanban.craft</span> / <span className="mono">demo1234</span>
      </div>
    </form>
  )
}

