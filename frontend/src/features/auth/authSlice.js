import { createSlice } from '@reduxjs/toolkit'

const seedUsers = [
  { id: 'u1', name: 'Demo User', email: 'demo@kanban.craft', password: 'demo1234' },
]

const initialState = {
  users: seedUsers,
  currentUser: null,
  status: 'idle',
  error: null,
}

const findUserByEmail = (users, email) =>
  users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: (state, action) => {
      const { name, email, password } = action.payload
      const existing = findUserByEmail(state.users, email)
      if (existing) {
        state.error = 'Email already exists'
        return
      }
      const user = {
        id: crypto?.randomUUID?.() ?? `u_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password,
      }
      state.users.push(user)
      state.currentUser = { id: user.id, name: user.name, email: user.email }
      state.error = null
    },
    logIn: (state, action) => {
      const { email, password } = action.payload
      const user = findUserByEmail(state.users, email)
      if (!user || user.password !== password) {
        state.error = 'Invalid credentials'
        return
      }
      state.currentUser = { id: user.id, name: user.name, email: user.email }
      state.error = null
    },
    logOut: (state) => {
      state.currentUser = null
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
})

export const { signUp, logIn, logOut, clearAuthError } = authSlice.actions
export default authSlice.reducer

