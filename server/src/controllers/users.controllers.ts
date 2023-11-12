import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { every, find, get, isEqual, map, random, sample, times, toPlainObject } from 'lodash'
import { ObjectId } from 'mongodb'
import path from 'path'
import { File } from 'formidable'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import {
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import jwtSecurity from '~/security/jwt.security'
import { wrapRequestHandler } from '~/utils/handlers .utils'
import encoded_decoded_jwt from '~/utils/jwt.utils'
import { calculateDate } from '~/utils/time.utils'
import { Media } from '~/models/Other.ts'
import { getNameFromFullname } from '~/utils/file.utils'
import loadEnv from '~/security/env.security'
import Device from '~/models/schemas/Device.schema'
import Image from '~/models/schemas/Images.schemas'
import handleUser from '~/utils/user.utils'
import database, { Collections_Type } from '~/services/database/database'

class UsersControllers {
  public registerController = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response, next: NextFunction) => {
      handleUser.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth,
        gioitinh: req.body.gioitinh
      })
      return res.json({
        message: 'Register success'
      })
    }
  )

  public loginController = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response, next: NextFunction) => {
      const data = await database.getCollection('users').findOne({ _id: req.user?._id })
      const check90days = data?.check.checkNinetyDays.isCheck
      const body_device = new Device({
        uAParse: {
          deviceUAParse_name: (req.body as any).deviceUAParse_name,
          deviceUAParse_cpu_architecture: (req.body as any).deviceUAParse_cpu_architecture,
          deviceUAParse_engine_name: (req.body as any).deviceUAParse_engine_name,
          deviceUAParse_engine_version: (req.body as any).deviceUAParse_engine_version,
          deviceUAParse_os_name: (req.body as any).deviceUAParse_os_name,
          deviceUAParse_os_version: (req.body as any).deviceUAParse_os_version,
          deviceUAParse_ua: (req.body as any).deviceUAParse_ua,
          deviceUAParse_version: (req.body as any).deviceUAParse_version
        },
        device: {
          hostname: (req.body as any).device.result.hostname,
          platform: (req.body as any).device.result.platform,
          cpuInfo: (req.body as any).device.result.cpuInfo,
          fileInfo: (req.body as any).device.result.fileInfo,
          networkInfo: {
            Ethernet: (req.body as any).device.result.networkInfo.Ethernet,
            'Loopback Pseudo-Interface 1': (req.body as any).device.result.networkInfo['Loopback Pseudo-Interface 1'],
            'Teredo Tunneling Pseudo-Interface': (req.body as any).device.result.networkInfo[
              'Teredo Tunneling Pseudo-Interface'
            ]
          },
          osType: (req.body as any).device.result.osType,
          osPlatform: (req.body as any).device.result.osPlatform,
          osArch: (req.body as any).device.result.osArch,
          userInfo: {
            uid: (req.body as any).device.result.userInfo.uid,
            gid: (req.body as any).device.result.userInfo.gid,
            username: (req.body as any).device.result.userInfo.username,
            homedir: (req.body as any).device.result.userInfo.homedir,
            shell: (req.body as any).device.result.userInfo.shell
          },
          totalMemory: (req.body as any).device.result.totalMemory,
          freeMemory: (req.body as any).device.result.freeMemory,
          uptime: (req.body as any).device.result.uptime,
          osConstants: {
            UV_UDP_REUSEADDR: (req.body as any).device.result.osConstants.UV_UDP_REUSEADDR,
            dlopen: (req.body as any).device.result.osConstants.dlopen,
            errno: (req.body as any).device.result.osConstants.errno,
            signals: (req.body as any).device.result.osConstants.signals,
            priority: (req.body as any).device.result.osConstants.priority
          },
          is64Bit: (req.body as any).device.result.is64Bit,
          loadAvg: (req.body as any).device.result.loadAvg,
          isLittleEndian: (req.body as any).device.result.isLittleEndian
        }
      })
      if (req?.user?.devices?.length === 0) {
        // Thêm body_device vào trường device
        Promise.all([
          await database
            .getCollection('users')
            .updateOne({ _id: req.user?._id }, { $set: { device: { ...body_device } } }),
          await database
            .getCollection('users')
            .updateOne({ _id: req.user?._id }, { $push: { devices: { ...body_device } } })
        ])
      }

      const uAParseData = get(req.user?.devices, '[0].uAParse', {})
      const deviceData = get(req.user?.devices, '[0].device', {}) as any

      //////////////////
      const uAParse_data = uAParseData
      const hostname_data = deviceData.hostname
      const uAParse_body = get(body_device, 'uAParse', {}) // lấy  uAParse từ trong {} ra
      const hostname_body = (get(body_device, 'device', {}) as any).hostname // lấy device từ trong {} ra
      const isCheck_uAParse = isEqual(uAParse_data, uAParse_body)
      const isCheck_hostname = isEqual(hostname_data, hostname_body)

      if (isCheck_uAParse && isCheck_hostname) {
        const userIdQuery = { _id: new ObjectId(req.user?._id) }
        const devicesUpdateQuery = {
          $set: {
            'devices.$[device].updated_at': new Date()
          }
        }
        const devicesArrayFilter = { arrayFilters: [{ 'device._id': new ObjectId((req.user?.device as any)._id) }] }

        await database.getCollection('users').updateOne(userIdQuery, devicesUpdateQuery, devicesArrayFilter)

        const deviceUpdateQuery = {
          $set: {
            'device.updated_at': new Date()
          }
        }

        await database.getCollection('users').updateOne(userIdQuery, deviceUpdateQuery)
      }

      if (!isCheck_uAParse && !isCheck_hostname) {
        await database
          .getCollection('users')
          .updateOne({ _id: req.user?._id }, { $set: { device: { ...body_device } } })

        await database
          .getCollection('users')
          .updateOne({ _id: req.user?._id }, { $push: { devices: { ...body_device } } })
      }

      const { verify, _id } = req.user as { verify: UserVerifyStatus; _id: ObjectId }
      const user_id = _id.toString()

      const [access_token, refresh_token] = await jwtSecurity.signAccessAndRefreshToken({
        user_id,
        verify
      })
      const { iat, exp, iat_convert, exp_convert } = await encoded_decoded_jwt.decoded({
        token: refresh_token,
        secretKey: loadEnv.output.JWT_SECRET_REFRESH_TOKEN
      })

      await database.getCollection('refreshTokens').insertOne(
        new RefreshToken({
          user_id: new ObjectId(user_id),
          token: refresh_token,
          iat,
          exp,
          iat_convert,
          exp_convert
        })
      )
      // trả về người dùng access_token và refresh_token vừa sign (mới nhất)

      const result = {
        access_token,
        refresh_token
      }

      const res_check = check90days
        ? {
            message: 'Đã khóa tài khoản'
          }
        : {
            message: 'Login success',
            result
          }
      return res.json(res_check)
    }
  )

  public logoutController = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response, next: NextFunction) => {
      const { refresh_token } = req.body
      const result = await database.getCollection('refreshTokens').deleteOne({ token: refresh_token })
      return res.json({
        message: 'LOGOUT_SUCCESS',
        result
      })
    }
  )

  public updateMeController = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
      const { body } = req
      const { user_id } = req.decoded_authorization as TokenPayload
      const user = (await database.getCollection('users').findOne({ _id: new ObjectId(user_id) })) as User // trả về object user
      handleUser.updateMe({ body, user, user_id })
      return res.json({
        res: user,
        message: 'UPLOAD ME SUCCESS'
      })
    }
  )

  public updateLinkFilesController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req
    await database.getCollection('users').updateOne(
      { _id: new ObjectId(body?._id) },
      {
        $push: {
          images: new Image({
            user_id: new ObjectId(body?._id),
            result: body.linkFiles
          })
        }
      }
    )

    return res.json({
      message: 'UPDATE LINKS FILES SUCCESS'
    })
  })

  public getMeController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization as TokenPayload // lấy từ accessTokenValidator
    const user = await database.getCollection('users').findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $currentDate: {
          updated_at: true
        }
      },
      {
        upsert: true,
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    const findName = (searchName: string, dataArray: any[]) => find(dataArray, { name: searchName })
    const usersObj = (await database.getCollection('users').findOne({ _id: new ObjectId(user_id) })) as User
    const names = await database
      .getCollection('users')
      .findOne({ _id: new ObjectId(user_id), 'names.name': usersObj.name }) // nếu có thì trả về cái mảng names, còn không trả về null
    const time_thoiginthuc = findName(usersObj.name, names?.names as any)

    const calculate = {
      ...time_thoiginthuc,
      calculateDate:
        calculateDate.tinhKhoangThoiGian({
          hienTai: new Date().toISOString(),
          tuongLai: time_thoiginthuc?.last_time?.stringDate as string,
          returnTimeEnd: 'Có thể chỉnh sửa'
        }) === 'NaN:NaN:NaN' && Number(names?.names.length) === 3
          ? ''
          : calculateDate.tinhKhoangThoiGian({
              hienTai: new Date().toISOString(),
              tuongLai: time_thoiginthuc?.last_time?.stringDate as string,
              returnTimeEnd: 'Có thể chỉnh sửa'
            })
    }

    const check90days = user.value?.updated_at as Date
    const hienTaiTotal90days = String(calculateDate.addToDate(check90days, '90d').toISOString())

    const result = {
      ...user.value,
      check90days: {
        calculateDate: `Còn ${calculateDate.tinhKhoangThoiGian({
          hienTai: new Date().toISOString(),
          tuongLai: hienTaiTotal90days,
          returnTimeEnd: 'Khóa tài khoản'
        })} `
      },
      time_thoigianthuc: calculate || {}
    }

    return res.json({
      message: 'GET_ME_SUCCESS',
      result
    })
  })

  public uploadAvatarController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const formidable = (await import('formidable')).default
    const form = formidable({
      uploadDir: path.resolve('uploads/images/avatar'),
      maxFiles: 4, // 1
      keepExtensions: true,
      maxFileSize: 1000 * 1024 * 1024, // 300KB
      maxTotalFileSize: 1000 * 1024 * 1024 * 4,
      filter: function ({ name, originalFilename, mimetype }) {
        const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return valid
      }
    })

    const files = await new Promise<File[]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err)
        }
        // eslint-disable-next-line no-extra-boolean-cast
        if (!Boolean(files.image)) {
          return reject(new Error('File is empty'))
        }
        resolve(files.image as File[])
      })
    })

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const url = loadEnv.isProduction
          ? `${loadEnv.output.HOST}/users/2023/${newFullFilename}`
          : `http://localhost:${loadEnv.output.PORT}/users/2023/${newFullFilename}`
        return {
          url,
          type: 0
        }
      })
    )

    return res.json({
      result,
      message: 'UPLOAD AVATAR SUCCESS'
    })
  })

  public uploadFilesController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)

    const formidable = (await import('formidable')).default
    const form = formidable({
      uploadDir: path.resolve('uploads/images/avatar'),
      maxFiles: 4, // 1
      keepExtensions: true,
      maxFileSize: 1000 * 1024 * 1024, // 300KB
      maxTotalFileSize: 1000 * 1024 * 1024 * 4,
      filter: function ({ name, originalFilename, mimetype }) {
        const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return valid
      }
    })

    const files = await new Promise<File[]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err)
        }
        // eslint-disable-next-line no-extra-boolean-cast
        if (!Boolean(files.image)) {
          return reject(new Error('File is empty'))
        }
        resolve(files.image as File[])
      })
    })

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const url = loadEnv.isProduction
          ? `${loadEnv.output.HOST}/users/2023/${newFullFilename}`
          : `http://localhost:${loadEnv.output.PORT}/users/2023/${newFullFilename}`
        return {
          url,
          type: 0
        }
      })
    )

    return res.json({
      result,
      message: 'UPLOAD FILES SUCCESS'
    })
  })

  public getImgAvatarController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params
    // console.log(name)
    return res.sendFile(path.resolve(path.resolve('uploads/images/avatar'), name), (err) => {
      if (err) {
        res.status((err as any).status).send('Not found')
      }
    })
  })

  public refreshTokenController = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, RefreshTokenReqBody>, res: Response) => {
      const { refresh_token } = req.body
      const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload

      const [new_access_token, new_refresh_token] = await Promise.all([
        jwtSecurity.signAccessToken({
          payload: { user_id, verify, token_type: 0 },
          secretKey: loadEnv.output.JWT_SECRET_ACCESS_TOKEN
        }),
        jwtSecurity.signRefreshToken({
          payload: { user_id, verify, token_type: 1, exp },
          secretKey: loadEnv.output.JWT_SECRET_REFRESH_TOKEN
        }),
        database.getCollection('refreshTokens').deleteOne({ token: refresh_token })
      ])
      const decoded_refresh_token = await encoded_decoded_jwt.decoded({
        token: new_refresh_token,
        secretKey: loadEnv.output.JWT_SECRET_REFRESH_TOKEN
      })
      await database.getCollection('refreshTokens').insertOne(
        new RefreshToken({
          user_id: new ObjectId(user_id),
          token: new_refresh_token,
          iat: decoded_refresh_token.iat,
          exp: decoded_refresh_token.exp,
          iat_convert: decoded_refresh_token.iat_convert,
          exp_convert: decoded_refresh_token.exp_convert
        })
      )

      const result = {
        access_token: new_access_token,
        refresh_token: new_refresh_token
      }
      return res.json({
        message: 'REFRESH_TOKEN_SUCCESS',
        result
      })
    }
  )

  public deviceController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const hostname = req.hostname
    const find_hostname = await database.getCollection('devices').findOne({ hostname })
    return res.json({
      find_hostname
    })
  })

  public check90daysController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, check90days, date } = req.body
    await database.getCollection('users').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          'check.checkNinetyDays.isCheck': check90days,
          'check.checkNinetyDays.date': date
        }
      }
    )
    return res.json({
      message: 'check 90days success'
    })
  })

  public check60daysController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, date, check60days, timestamp } = req.body
    await database.getCollection('users').updateOne(
      { _id: new ObjectId(_id), 'names.name': name },
      {
        $set: {
          'names.$.last_time.stringDate': date,
          'names.$.last_time.timestamp': timestamp,
          'check.checkSixtyDays': check60days
        }
      }
    )

    return res.json({
      message: 'check 60days success'
    })
  })

  public checkStatusController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, checkStatus, date } = req.body
    await database.getCollection('users').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          'check.checkStatus.isCheck': checkStatus,
          'check.checkStatus.date': date
        }
      }
    )
    return res.json({
      message: 'check 60days success'
    })
  })

  public checkerverifyController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { _id, check } = req.body
    await database.getCollection('users').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          verify: check
        }
      }
    )
    return res.json({
      message: 'check verify success'
    })
  })

  // delete item deleteUserController
  public deleteUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    await database.getCollection('users').deleteOne({ _id: new ObjectId(userId) })

    return res.json({
      message: 'delete user success'
    })
  })

  // delete many item deleteManyUsersController
  public deleteManyUsersController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userIds = req.params.userIds
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty userIds' })
    }

    // Xóa nhiều người dùng
    await database.getCollection('users').deleteMany({
      _id: { $in: userIds.split(',').map((id) => new ObjectId(id)) }
    })

    return res.json({
      message: 'delete selected users success'
    })
  })

  public deleteCollectionController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const collection: string = req.params.collection // Note: Assuming collection is a comma-separated string

    const deleteManyCollections = async (collections: (keyof Collections_Type)[]) => {
      await Promise.all(collections.map((collection) => database.getCollection(collection).deleteMany({})))
      console.log(`Deleted ${collections.join(', ')} collections.`)
    }

    const collectionArray = collection.split(',').map((item) => item.trim())
    await deleteManyCollections(collectionArray as [])

    return res.json({
      message: 'delete selected users success'
    })
  })

  public createRandomUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { USER_COUNT, PASSWORD } = req.body
    handleUser.createRandomUser({ USER_COUNT, PASSWORD })
    return res.json({
      message: 'CreateRandomUser success'
    })
  })
}
const usersControllers = new UsersControllers()
export default usersControllers
