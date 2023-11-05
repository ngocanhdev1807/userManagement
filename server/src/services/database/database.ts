import { Collection, Db, MongoClient } from 'mongodb'
import now from 'performance-now'
import Device from '~/models/schemas/Device.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import loadEnv from '~/security/env.security'
import uriConnectDatabase from '~/security/uri_connect_security'
import logger from '~/utils/logger.utils'
import { messageNotification } from '~/utils/messageNotification.utils'

interface Collections_Input_Type {
  users: string
  refreshTokens: string
  devices: string
}

interface Collections_Output_Type {
  users: string
  refreshTokens: string
  devices: string
}

export interface Collections_Type {
  users: User
  refreshTokens: RefreshToken
  devices: Device
}

class Database {
  private client: MongoClient
  private db: Db
  private collections: Collections_Output_Type
  private log: boolean

  constructor({
    uri,
    dbName,
    collections,
    log = false
  }: {
    uri: string
    dbName: string
    collections: Collections_Input_Type
    log: boolean
  }) {
    this.client = new MongoClient(uri)
    this.db = this.client.db(dbName)
    this.collections = collections
    this.log = log
    this.connect()
    this.indexUsers()
  }

  private async connect() {
    try {
      const start = now() // Bắt đầu đo thời gian
      await this.db.command({ ping: 1 })
      const end = now() // Kết thúc đo thời gian
      const executionTime = end - start // Tính thời gian thực hiện

      if (this.log) {
        logger.logAsync(
          `Pinged your deployment. You successfully connected to MongoDB! Thời gian thực hiện: ${executionTime} milliseconds`
        )
      } else {
        console.log(
          messageNotification(`Successfully connected to the database. Execution time: ${executionTime} milliseconds`)
        )
      }
    } catch (error) {
      if (this.log) {
        logger.logAsync('Error')
      } else {
        console.log(messageNotification('Error'))
      }
      throw error
    }
  }

  private async indexUsers() {
    const exists = await this.getCollection('users').indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.getCollection('users').createIndex({ email: 1, password: 1 })
      this.getCollection('users').createIndex({ email: 1 }, { unique: true })
      this.getCollection('users').createIndex({ username: 1 }, { unique: true })
    }
  }

  public getCollection<T extends keyof Collections_Type>(name: T): Collection<Collections_Type[T]> {
    if (!this.collections[name]) {
      throw new Error(`Collection name ${name} is not defined in collections object.`)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.db.collection<Collections_Type[T]>(this.collections[name]!)
  }
}

const database = new Database({
  uri: uriConnectDatabase.uri,
  dbName: loadEnv.output.DB_NAME_TWO,
  collections: {
    users: loadEnv.output.DB_USERS_COLLECTION,
    refreshTokens: loadEnv.output.DB_REFRESH_TOKENS_COLLECTION,
    devices: loadEnv.output.DB_DEVICE_COLLECTION
  },
  log: false
})
export default database
