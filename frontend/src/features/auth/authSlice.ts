import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api, axiosClient } from '../../services/api'
import type { LoginPayload, SignupPayload, User } from '../../types/api'

export const logIn = createAsyncThunk('auth/logIn', async (payload: LoginPayload) =>
  api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
)

export const signUp = createAsyncThunk('auth/signUp', async (payload: SignupPayload) =>
  api<{ user: User }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
)

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  try {
    const res = await axiosClient.get<{ ok: true; data: { user: User } }>('/api/auth/me')
    return res.data.data
  } catch (e) {
    const status = (e as { response?: { status?: number } })?.response?.status
    if (status === 401) return null
    throw e
  }
})

export const logOutServer = createAsyncThunk('auth/logOutServer', async () =>
  api<{ loggedOut: true }>('/api/auth/logout', { method: 'POST' }),
)

type AuthState = {
  currentUser: User | null
  bootstrapped: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  currentUser: null,
  bootstrapped: false,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.currentUser = null
      state.status = 'idle'
      state.error = null
      state.bootstrapped = true
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (b) => {
    b.addCase(logIn.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })
      .addCase(logIn.fulfilled, (state, action: PayloadAction<{ user: User } | null>) => {
        state.status = 'succeeded'
        state.currentUser = action.payload?.user ?? null
        state.bootstrapped = true
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Login failed'
        state.bootstrapped = true
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<{ user: User } | null>) => {
        state.status = 'succeeded'
        state.currentUser = action.payload?.user ?? null
        state.bootstrapped = true
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Signup failed'
        state.bootstrapped = true
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(bootstrapAuth.fulfilled, (state, action: PayloadAction<{ user: User } | null>) => {
        state.status = 'succeeded'
        state.currentUser = action.payload?.user ?? null
        state.bootstrapped = true
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.status = 'idle'
        state.currentUser = null
        state.bootstrapped = true
      })
      .addCase(logOutServer.fulfilled, (state) => {
        state.currentUser = null
        state.status = 'idle'
        state.error = null
        state.bootstrapped = true
      })
  },
})

export const { logOut, clearAuthError } = authSlice.actions
export default authSlice.reducer

