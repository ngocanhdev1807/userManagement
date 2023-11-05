import { format_Date } from './time.utils'

export const messageNotification = (message: string) =>
  `${format_Date.formatDateTime(String(new Date().toISOString()))}: ${message}`
