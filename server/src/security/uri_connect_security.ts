import loadEnv from './env.security'

class UriConnectDatabase {
  public uri: string
  constructor() {
    this.uri = `mongodb+srv://${loadEnv.output.DB_USERNAME}:${loadEnv.output.DB_PASSWORD}@twitter.slfpwuz.mongodb.net/?retryWrites=true&w=majority`
  }
}

const uriConnectDatabase = new UriConnectDatabase()
export default uriConnectDatabase
