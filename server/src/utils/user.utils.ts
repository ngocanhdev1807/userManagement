import { faker } from '@faker-js/faker'
import toPlainObject from 'lodash/toPlainObject'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { hashPassword } from '~/security/hashPassword.security'
import CheckUser60daysAnd3Edits from '~/models/schemas/CheckUser60daysAnd3Edits.schema'
import random from 'lodash/random'
import sample from 'lodash/sample'
import times from 'lodash/times'
import encoded_decoded_jwt from './jwt.utils'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import loadEnv from '~/security/env.security'
import testerDatabase from '~/services/database/database'
import every from 'lodash/every'
import { calculateDate } from './time.utils'
import find from 'lodash/find'

class HandleUser {
  public createRandomUser = async ({ USER_COUNT, PASSWORD = 'Anh123!' }: { USER_COUNT: number; PASSWORD: string }) => {
    // tạo một cái object user
    const createRandomUser = () => {
      const user_id = new ObjectId()
      const name = faker.internet.displayName()
      return toPlainObject(
        new User({
          _id: user_id,
          email: faker.internet.email(),
          password: hashPassword(PASSWORD),
          date_of_birth: new Date(faker.date.past().toISOString()),
          name,
          names: [new CheckUser60daysAnd3Edits({ name })],
          username: `user${user_id.toString()}`,
          verify: random(0, 1),
          gioitinh: sample(['male', 'female']),
          job: sample(['Developer', 'Programmer', 'Designer', 'Web Designer'])
        })
      )
    }
    //tạo một mảng gồn 5 item
    const users = times(USER_COUNT, createRandomUser)
    // insert nhiều object user vào collection users
    await testerDatabase.getCollection('users').insertMany(users)
  }

  public createUser = async ({
    name,
    email,
    date_of_birth,
    password,
    gioitinh
  }: {
    name: string
    email: string
    date_of_birth: string
    password: string
    gioitinh: string
  }) => {
    const user_id = new ObjectId()
    const signEmailVerifyToken = ({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) => {
      return encoded_decoded_jwt.encoded({
        payload: {
          user_id,
          token_type: TokenType.EmailVerifyToken,
          verify
        },
        secretKey: loadEnv.output.JWT_SECRET_EMAIL_VERIFY_TOKEN,
        options: {
          expiresIn: loadEnv.output.EMAIL_VERIFY_TOKEN_EXPIRES_IN
        }
      })
    }
    const email_verify_token = await signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    // tạo một cái object user
    const user = new User({
      _id: user_id,
      email,
      username: `user${user_id.toString()}`,
      email_verify_token,
      date_of_birth: new Date(date_of_birth),
      password: hashPassword(password),
      name,
      names: [new CheckUser60daysAnd3Edits({ name })],
      gioitinh
    })
    // insert nhiều object user vào collection users
    await testerDatabase.getCollection('users').insertOne(user)
  }

  public updateMe = async ({ body, user_id, user }: { body: Partial<User>; user_id: string; user: User }) => {
    const namesLength = Number(user?.names.length) // lấy ra length của names (khi đăng ký thì length = 1)
    const check60day = every(
      user.names,
      (item) =>
        calculateDate.calculateTimeDifferenceUpdate(new Date().getTime(), Number(item?.last_time?.timestamp)) < 0
    )

    const findName = (targetName: string, nameList: any[]) => find(nameList, { name: targetName })?.name
    const resName = findName(body.name as string, user?.names)

    if (namesLength <= 3 && check60day) {
      await testerDatabase.getCollection('users').updateOne(
        { _id: new ObjectId(user_id) },
        {
          $push: {
            names: new CheckUser60daysAnd3Edits({ name: body.name as string })
          },
          $set: { name: body.name },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } else if (resName) {
      await testerDatabase.getCollection('users').updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: { name: resName },
          $currentDate: {
            updated_at: true
          }
        }
      )
    }
    await testerDatabase.getCollection('users').updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          gioitinh: body.gioitinh,
          phone: body.phone,
          address: body.address,
          date_of_birth: body.date_of_birth,
          avatar: body.avatar
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
}
const handleUser = new HandleUser()
export default handleUser
