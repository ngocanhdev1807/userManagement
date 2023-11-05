import { ObjectId } from 'mongodb'
import { addDays, addHours, addMinutes, addMonths, addSeconds, addYears } from 'date-fns'

export interface CheckUser60daysAnd3EditsType {
  _id?: ObjectId
  name: string
  first_time?: {
    stringDate?: string
    timestamp?: number
  }
  last_time?: {
    stringDate?: string
    timestamp?: number
  }
  created_at?: Date
  updated_at?: Date
}

///////////////hàm hay dùng////////////////////
const addToDate = ({ initialDate, timeToAdd }: { initialDate: Date; timeToAdd: string }): Date => {
  const match = timeToAdd.match(/^(\d+)([smhdMy])$/)
  if (!match) {
    throw new Error('Invalid time parameter')
  }

  const amount = parseInt(match[1], 10)
  const unit = match[2]

  if (isNaN(amount)) {
    throw new Error('Invalid time parameter')
  }

  switch (unit) {
    case 's':
      return addSeconds(initialDate, amount)
    case 'm':
      return addMinutes(initialDate, amount)
    case 'h':
      return addHours(initialDate, amount)
    case 'd':
      return addDays(initialDate, amount)
    case 'M':
      return addMonths(initialDate, amount)
    case 'y':
      return addYears(initialDate, amount)
    default:
      throw new Error('Invalid time unit')
  }
}

export default class CheckUser60daysAnd3Edits {
  _id?: ObjectId
  name: string
  first_time: {
    stringDate: string
    timestamp: number
  }
  last_time: {
    stringDate: string
    timestamp: number
  }
  created_at: Date
  updated_at: Date
  constructor({ _id, created_at, updated_at, name }: CheckUser60daysAnd3EditsType) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.name = name
    this.first_time = { stringDate: String(date.toISOString()), timestamp: date.getTime() }
    this.last_time = {
      stringDate: String(addToDate({ initialDate: date, timeToAdd: '60d' }).toISOString()),
      timestamp: addToDate({ initialDate: date, timeToAdd: '60d' }).getTime()
    }
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
