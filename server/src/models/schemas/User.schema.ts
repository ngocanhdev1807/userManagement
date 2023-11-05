import { ObjectId } from 'mongodb'
import { DeviceType } from './Device.schema'
import { CheckUser60daysAnd3EditsType } from './CheckUser60daysAnd3Edits.schema'
import Image from './Images.schemas'

enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

interface User_Input_Type {
  _id?: ObjectId
  name: string
  names?: CheckUser60daysAnd3EditsType[]
  email: string
  date_of_birth: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  twitter_circle?: ObjectId[]
  bio?: string
  location?: string
  phone?: string
  address?: string
  website?: string
  username?: string
  gioitinh?: string
  avatar?: string
  cover_photo?: string
  job?: string
  device?: object
  devices?: DeviceType[]
  check?: {
    checkStatus?: {
      isCheck?: boolean
      date?: string
    }
    checkNinetyDays?: {
      isCheck?: boolean
      date?: string
    }
    checkSixtyDays?: boolean
  }
  images?: Image[]
}

export default class User {
  _id?: ObjectId
  name: string
  names: CheckUser60daysAnd3EditsType[]
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token: string // jwt hoặc '' nếu đã xác thực email
  verify: UserVerifyStatus
  twitter_circle: ObjectId[] // danh sách id của những người user này add vào circle
  bio: string // optional
  location: string // optional
  phone: string
  address: string
  website: string // optional
  username: string // optional
  gioitinh: string // optional
  avatar: string // optional
  cover_photo: string // optional
  job: string
  device: object
  devices: DeviceType[]
  check: {
    checkStatus: {
      isCheck: boolean
      date: string
    }
    checkNinetyDays: {
      isCheck: boolean
      date: string
    }
    checkSixtyDays: boolean
  }
  images: Image[]
  constructor(input: User_Input_Type) {
    const date = new Date()
    this._id = input._id
    // this.name = limitProductsArray(input.name, 3) || limitProductsArray([], 3)
    this.check = {
      // checkStatus: (input.check && input.check.checkStatus) || false,
      checkStatus: {
        isCheck: input.check?.checkStatus?.isCheck || false,
        date: input.check?.checkStatus?.date || new Date().toISOString()
      },
      checkNinetyDays: {
        isCheck: input.check?.checkNinetyDays?.isCheck || false,
        date: input.check?.checkNinetyDays?.date || new Date().toISOString()
      },
      checkSixtyDays: (input.check && input.check.checkSixtyDays) || false
    }
    this.names = input.names || []
    this.name = input.name || ''
    this.email = input.email
    this.date_of_birth = input.date_of_birth || new Date()
    this.password = input.password
    this.created_at = input.created_at || date
    this.updated_at = input.updated_at || date
    this.email_verify_token = input.email_verify_token || ''
    this.forgot_password_token = input.forgot_password_token || ''
    this.verify = input.verify || UserVerifyStatus.Unverified
    this.twitter_circle = input.twitter_circle || []
    this.bio = input.bio || ''
    this.location = input.location || ''
    this.phone = input.phone || ''
    this.address = input.address || ''
    this.website = input.website || ''
    this.username = input.username || ''
    this.gioitinh = input.gioitinh || ''
    this.avatar = input.avatar || ''
    this.cover_photo = input.cover_photo || ''
    this.job = input.job || ''
    this.devices = input.devices || []
    this.device = input.device || {}
    this.images = input.images || []
  }
}
