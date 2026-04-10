import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import boardReducer from '../features/board/boardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

