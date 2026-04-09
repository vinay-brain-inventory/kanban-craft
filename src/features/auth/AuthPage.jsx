import { useState } from 'react'
import { logOut } from './authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Button from '../../components/ui/Button'
import AuthShell from './components/AuthShell'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

export default function AuthPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.currentUser)
  const [mode, setMode] = useState('login')

  if (user) {
    return (
      <div className="auth">
        <div className="auth__bg" aria-hidden="true" />
        <div className="authed">
          <div className="authed__top">
            <div className="badge">Logged in</div>
            <Button variant="ghost" onClick={() => dispatch(logOut())}>
              Log out
            </Button>
          </div>
          <div className="authed__card">
            <div className="authed__name">{user.name}</div>
            <div className="authed__email">{user.email}</div>
          </div>
        </div>
      </div>
    )
  }

  const isLogin = mode === 'login'

  return (
    <AuthShell
      title={isLogin ? 'Welcome back' : 'Create your account'}
      subtitle={isLogin ? 'Log in to continue' : 'Sign up in a few seconds'}
      footer={
        <div className="switch">
          <span className="switch__text">{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button type="button" className="link" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      }
    >
      {isLogin ? <LoginForm onSwitch={() => setMode('signup')} /> : <SignupForm onSwitch={() => setMode('login')} />}
    </AuthShell>
  )
}

