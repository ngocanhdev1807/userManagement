import { createHash } from 'crypto'
import loadEnv from './env.security'

const sha256 = (content: string) => createHash('sha256').update(content).digest('hex')
export const hashPassword = (password: string) => sha256(password + loadEnv.output.PASSWORD_SECRET)
