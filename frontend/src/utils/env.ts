import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api'),
  VITE_APP_NAME: z.string().min(1).default('Careerku'),
})

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || undefined,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || undefined,
})

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors)
  throw new Error('Invalid frontend environment configuration.')
}

export const env = parsedEnv.data
