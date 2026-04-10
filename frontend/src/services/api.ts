import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: { message: string; details?: unknown } }

export type ApiOptions = {
  method?: string
  body?: string
  headers?: Record<string, string>
}

type ApiError = Error & { status?: number; details?: unknown }

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')

export const axiosClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let onUnauthorized: (() => void) | null = null
export const setOnUnauthorized = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const method = (options.method || 'GET').toLowerCase()
  const url = path
  const data = options.body ? (JSON.parse(options.body) as unknown) : undefined

  try {
    const cfg = options.headers ? { headers: options.headers } : {}
    const res = await axiosClient.request<ApiEnvelope<T>>({ url, method, data, ...cfg })
    const envelope = res.data as ApiEnvelope<T>
    return envelope.ok ? envelope.data : null
  } catch (e) {
    const err0 = e as AxiosError<ApiEnvelope<unknown>>
    const status = err0.response?.status
    const message =
      err0.response?.data && 'error' in err0.response.data
        ? err0.response.data.error.message
        : err0.message || `Request failed (${status || 'unknown'})`

    const err = new Error(message) as ApiError
    if (status !== undefined) err.status = status
    const details =
      err0.response?.data && 'error' in err0.response.data ? err0.response.data.error.details : undefined
    if (details !== undefined) err.details = details
    throw err
  }
}

