import jwt from 'jsonwebtoken'
import { calculateDate, format_Date } from './time.utils'

class Encoded_decoded_jwt {
  public encoded = async ({
    payload,
    secretKey,
    options = {
      algorithm: 'HS256'
    }
  }: {
    payload: string | Buffer | object
    secretKey: string
    options?: jwt.SignOptions
  }) => {
    const result = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, secretKey, options, (error, token) => {
        if (error) {
          throw reject(error)
        }
        resolve(token as string)
      })
    })
    return result
  }

  public decoded = async ({ token, secretKey }: { token: string; secretKey: string }) => {
    const _result: any = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
          throw reject(error)
        }
        resolve(decoded)
      })
    })

    const result = {
      ..._result,
      iat_convert: format_Date.formatDate(_result.iat),
      exp_convert: format_Date.formatDate(_result.exp),
      calculateDate: `Còn ${calculateDate.tinhKhoangThoiGian({
        hienTai: new Date().toISOString(),
        tuongLai: format_Date.formatDate(_result.exp),
        returnTimeEnd: 'hết hạn token'
      })}`
    }

    // console.log(result)
    return result
  }
}
const encoded_decoded_jwt = new Encoded_decoded_jwt()
export default encoded_decoded_jwt
