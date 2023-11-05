import { Router } from 'express'
import usersMiddlewares from '../middlewares/users.middlewares'
import usersControllers from '../controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', usersMiddlewares.registerValidator, usersControllers.registerController)

usersRouter.post('/login', usersMiddlewares.loginValidator, usersControllers.loginController)

usersRouter.post(
  '/logout',
  usersMiddlewares.accessTokenValidator,
  usersMiddlewares.refreshTokenValidator,
  usersControllers.logoutController
)

usersRouter.post('/refresh-token', usersMiddlewares.refreshTokenValidator, usersControllers.refreshTokenController)

// Get my profile
usersRouter.get('/me', usersMiddlewares.accessTokenValidator, usersControllers.getMeController)

// chỉnh sửa profile
usersRouter.patch('/me', usersMiddlewares.accessTokenValidator, usersControllers.updateMeController)

// upload avatar
usersRouter.post('/upload-avatar', usersMiddlewares.accessTokenValidator, usersControllers.uploadAvatarController)

// upload files
usersRouter.post('/upload-files', usersControllers.uploadFilesController)

// update link files
usersRouter.post('/update-link-files', usersControllers.updateLinkFilesController)

// get avatar
usersRouter.get('/2023/:name', usersControllers.getImgAvatarController)

usersRouter.post('/device', usersControllers.deviceController)

// edit check90days
usersRouter.post('/check90days', usersControllers.check90daysController)

// edit check60days
usersRouter.post('/check60days', usersControllers.check60daysController)

// edit checkStatus
usersRouter.post('/checkStatus', usersControllers.checkStatusController)

// delete item
usersRouter.delete('/deleteUser/:userId', usersControllers.deleteUserController)

// delete many item
usersRouter.delete('/deleteManyUsers/:userIds', usersControllers.deleteManyUsersController)

// delete collection
usersRouter.delete('/deleteCollection/:collection', usersControllers.deleteCollectionController)

// edit verify
usersRouter.post('/checkerverify', usersControllers.checkerverifyController)

// createRandomUser
usersRouter.post('/createRandomUser', usersControllers.createRandomUserController)

export default usersRouter
