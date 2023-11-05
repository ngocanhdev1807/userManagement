import encoded_decoded_jwt from '~/utils/jwt.utils'
import loadEnv from './env.security'

class JwtSecurity {
  public signAccessToken = ({
    payload,
    secretKey,
    options
  }: {
    payload: {
      user_id: string
      verify: number
      token_type: number
    }
    secretKey: string
    options?: { expiresIn: string }
  }) =>
    encoded_decoded_jwt.encoded({
      payload,
      secretKey,
      options
    })

  public signRefreshToken = ({
    payload,
    secretKey,
    options
  }: {
    payload: {
      user_id: string
      verify: number
      token_type: number
      exp?: number
    }
    secretKey: string
    options?: { expiresIn: string }
  }) => {
    if (payload.exp) {
      return encoded_decoded_jwt.encoded({
        payload,
        secretKey
      })
    }
    return encoded_decoded_jwt.encoded({
      payload,
      secretKey,
      options
    })
  }

  public signAccessAndRefreshToken = ({ user_id, verify }: { user_id: string; verify: number }) =>
    Promise.all([
      this.signAccessToken({
        payload: { user_id, verify, token_type: 0 },
        // secretKey: 'twitter12344321!@#',
        secretKey: loadEnv.output.JWT_SECRET_ACCESS_TOKEN,
        // options: { expiresIn: '15m' }
        options: { expiresIn: loadEnv.output.ACCESS_TOKEN_EXPIRES_IN }
      }),
      this.signRefreshToken({
        payload: { user_id, verify, token_type: 1 },
        // secretKey: 'twitter12344321!@#@',
        secretKey: loadEnv.output.JWT_SECRET_REFRESH_TOKEN,
        // options: { expiresIn: '100d' }
        options: { expiresIn: loadEnv.output.REFRESH_TOKEN_EXPIRES_IN }
      })
    ])
}
const jwtSecurity = new JwtSecurity()
export default jwtSecurity
