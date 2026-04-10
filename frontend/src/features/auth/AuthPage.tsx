import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import AuthShell from './components/AuthShell'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const user = useAppSelector((s) => s.auth.currentUser)
  if (user) return null

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

