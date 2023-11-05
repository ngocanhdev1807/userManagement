import { app } from './app/app'
import { update } from './update/update'

Promise.all([update(), app()])
