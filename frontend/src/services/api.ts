import axios from 'axios'
import type { z } from 'zod'
import { env } from '@/utils'

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function parseApiResponse<T>(schema: z.ZodType<T>, payload: unknown): T {
  return schema.parse(payload)
}
