import { ObjectId } from 'mongodb'
import { format_Date } from '~/utils/time.utils'

interface RefreshTokenInput {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  iat: number
  exp: number
  iat_convert: string
  exp_convert: string
}
interface RefreshTokenOutput {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  iat: Date
  exp: Date
  iat_convert: string
  exp_convert: string
  createdAt_convert: string
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  iat: Date
  exp: Date
  iat_convert: string
  exp_convert: string
  createdAt_convert: string
  constructor({ _id, token, created_at, user_id, iat, exp }: RefreshTokenInput) {
    this._id = _id
    this.token = token
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.iat = new Date(iat * 1000) // Convert Epoch time to Date
    this.exp = new Date(exp * 1000) // Convert Epoch time to Date
    this.iat_convert = format_Date.formatDate(iat)
    this.exp_convert = format_Date.formatDate(exp)
    this.createdAt_convert = format_Date.formatDateTimeString(new Date().toISOString())
  }
}
