import express from 'express'
import capitalize from 'lodash/capitalize'
import { JsonWebTokenError } from 'jsonwebtoken'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { validationResult, ValidationChain } from 'express-validator'
import { checkSchema, ParamSchema } from 'express-validator'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import encoded_decoded_jwt from '~/utils/jwt.utils'
import database from '~/services/database/database'
import loadEnv from '~/security/env.security'

class UsersMiddlewares {
  private validateAccessToken = async (value: string, req: any) => {
    const access_token = (value || '').split(' ')[1]
    if (!access_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    try {
      const decoded_authorization = await encoded_decoded_jwt.decoded({
        token: access_token,
        secretKey: loadEnv.output.JWT_SECRET_ACCESS_TOKEN
      })
      if (req) {
        req.decoded_authorization = decoded_authorization
        return true
      }
      return decoded_authorization
    } catch (error) {
      throw new ErrorWithStatus({
        message: capitalize(error instanceof JsonWebTokenError ? error.message : ''),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
  }

  private validateRefreshToken = async (value: string, req: any) => {
    if (!value) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    try {
      const [decoded_refresh_token, refresh_token] = await Promise.all([
        encoded_decoded_jwt.decoded({ token: value, secretKey: loadEnv.output.JWT_SECRET_REFRESH_TOKEN }),
        database.getCollection('refreshTokens').findOne({ token: value })
      ])

      if (refresh_token === null) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      req.decoded_refresh_token = decoded_refresh_token
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ErrorWithStatus({
          message: capitalize(error.message),
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      throw error
    }
    return true
  }
  //
  private validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await validation.run(req)
      const errors = validationResult(req)
      // Không có lỗi thì next tiếp tục request
      if (errors.isEmpty()) {
        return next()
      }

      const errorsObject = errors.mapped()
      const entityError = new EntityError({ errors: {} })
      for (const key in errorsObject) {
        const { msg } = errorsObject[key]
        // Trả về lỗi không phải là lỗi do validate
        if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          return next(msg)
        }
        entityError.errors[key] = errorsObject[key]
      }

      next(entityError)
    }
  }

  public registerValidator = this.validate(
    checkSchema(
      {
        email: {
          isEmail: {
            errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
          },
          trim: true,
          custom: {
            options: async (value) => {
              const isExistEmail = await Boolean(await database.getCollection('users').findOne({ value }))
              if (isExistEmail) {
                throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
              }
              return true
            }
          }
        },
        password: {
          notEmpty: {
            errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
          },
          isString: {
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 6,
              max: 50
            },
            errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
          },
          isStrongPassword: {
            options: {
              minLength: 6,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1
            },
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
          }
        } as ParamSchema,
        confirm_password: {
          notEmpty: {
            errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
          },
          isString: {
            errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 6,
              max: 50
            },
            errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
          },
          isStrongPassword: {
            options: {
              minLength: 6,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1
            },
            errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
          },
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.password) {
                throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
              }
              return true
            }
          }
        } as ParamSchema
      },
      ['body']
    )
  )

  public loginValidator = this.validate(
    checkSchema(
      {
        email: {
          isEmail: {
            errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
          },
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const isCheck90days = (await database.getCollection('users').findOne({ value }))?.check.checkNinetyDays
              const user = await database.getCollection('users').findOneAndUpdate(
                {
                  email: value
                },
                {
                  $currentDate: {
                    updated_at: true
                  }
                },
                {
                  upsert: true,
                  returnDocument: 'after'
                }
              )

              if (user.value === null && isCheck90days?.isCheck === true) {
                throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
              }
              req.user = user.value
              return true
            }
          }
        },
        password: {
          notEmpty: {
            errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
          },
          isString: {
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 6,
              max: 50
            },
            errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
          },
          isStrongPassword: {
            options: {
              minLength: 6,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1
            },
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
          }
        }
      },
      ['body']
    )
  )

  //
  public refreshTokenValidator = this.validate(
    checkSchema(
      {
        refresh_token: {
          trim: true,
          custom: {
            options: async (value: string, { req }) => {
              return this.validateRefreshToken(value, req)
            }
          }
        }
      },
      ['body']
    )
  )
  //

  public accessTokenValidator = this.validate(
    checkSchema(
      {
        Authorization: {
          custom: {
            options: async (value, { req }) => {
              return await this.validateAccessToken(value, req)
            }
          }
        }
      },
      ['headers']
    )
  )
}
const usersMiddlewares = new UsersMiddlewares()
export default usersMiddlewares
