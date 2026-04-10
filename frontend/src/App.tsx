import { useEffect } from 'react'
import './App.css'
import AuthPage from './features/auth/AuthPage'
import BoardPage from './features/board/BoardPage'
import { bootstrapAuth } from './features/auth/authSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setOnUnauthorized } from './services/api'
import { logOut } from './features/auth/authSlice'

export default function App() {
  const user = useAppSelector((s) => s.auth.currentUser)
  const bootstrapped = useAppSelector((s) => s.auth.bootstrapped)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(bootstrapAuth())
  }, [dispatch])

  useEffect(() => {
    setOnUnauthorized(() => dispatch(logOut()))
    return () => setOnUnauthorized(null)
  }, [dispatch])

  if (!bootstrapped) return null
  return <>{user ? <BoardPage /> : <AuthPage />}</>
}

