import { ObjectId } from 'mongodb'

interface ImageType {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  updated_at?: Date
  result?: {
    url: string
    type: number
  }[]
}
export default class Image {
  _id: ObjectId
  user_id: ObjectId
  created_at: Date
  updated_at: Date
  result: {
    url: string
    type: number
  }[]
  constructor({ _id, user_id, created_at, updated_at, result }: ImageType) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this.user_id = user_id
    this.result = result || []
  }
}
