import dotenv from 'dotenv'
import minimist from 'minimist'

interface Output {
  PORT: string
  HOST: string
  DB_NAME_ONE: string
  DB_NAME_TWO: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_USERS_COLLECTION: string
  DB_TWEETS_COLLECTION: string
  DB_HASHTAGS_COLLECTION: string
  DB_BOOKMARKS_COLLECTION: string
  DB_LIKES_COLLECTION: string
  DB_REFRESH_TOKENS_COLLECTION: string
  DB_FOLLOWERS_COLLECTION: string
  DB_VIDEO_STATUS_COLLECTION: string
  DB_CONVERSATION_COLLECTION: string
  PASSWORD_SECRET: string
  JWT_SECRET_ACCESS_TOKEN: string
  JWT_SECRET_REFRESH_TOKEN: string
  JWT_SECRET_EMAIL_VERIFY_TOKEN: string
  JWT_SECRET_FORGOT_PASSWORD_TOKEN: string
  REFRESH_TOKEN_EXPIRES_IN: string
  ACCESS_TOKEN_EXPIRES_IN: string
  EMAIL_VERIFY_TOKEN_EXPIRES_IN: string
  FORGOT_PASSWORD_TOKEN_EXPIRES_IN: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REDIRECT_URI: string
  CLIENT_REDIRECT_CALLBACK: string
  CLIENT_URL: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: string
  SES_FROM_ADDRESS: string
  S3_BUCKET_NAME: string
  //
  DB_PRODUCT_COLLECTION: string
  //
  DB_DEVICE_COLLECTION: string
  //
  DB_IMAGEPOST_COLLECTION: string
}

class LoadEnv {
  public output: Output
  constructor() {
    const getEnvFile = () => {
      switch (minimist(process.argv.slice(2)).env) {
        case 'production':
          return '.env.production'
        case 'staging':
          return '.env.staging'
        case 'development':
          return '.env.development'
        default:
          return '.env'
      }
    }
    const _output = dotenv.config({ path: getEnvFile() })
    if (_output.error) {
      throw _output.error
    }
    this.output = _output.parsed as unknown as Output
  }

  // check: Nếu --env= production thì là true
  public isProduction = minimist(process.argv.slice(2)).env === 'production'
}
const loadEnv = new LoadEnv()
export default loadEnv
