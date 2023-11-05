import winston from 'winston'
import { format_Date } from './time.utils'
import { createAndWriteFileUpdate } from './file.utils'

class Logger {
  private logger: winston.Logger
  private output: any
  constructor() {
    const result: any = []
    // Define transports for console and file
    const transports = [new winston.transports.Console(), new winston.transports.File({ filename: 'src/log/log.log' })]
    // Cấu hình Winston để ghi log vào tệp
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message }) => {
          const formattedMessage = `${format_Date.formatDateTimeStringUpdate(String(timestamp))}: ${message}`
          // Thêm thông điệp vào mảng khi nó được ghi
          result.push(formattedMessage)
          return formattedMessage
        })
      ),
      transports: transports // Specify the transports here
    })

    this.logger = logger
    this.output = result
  }

  // Hàm ghi log bất đồng bộ
  public logAsync = async (message: string) => {
    // console.log('message', message) // In log ra console nếu cần
    try {
      await this.logger.log('info', message)
      // console.log('Đã ghi log bất đồng bộ thành công.')
    } catch (err) {
      // console.error('Lỗi khi ghi log bất đồng bộ:', err)
    }
  }

  // Hàm ghi log đồng bộ
  public logSync = (message: string) => {
    // console.log(message) // In log ra console nếu cần
    this.logger.log('info', message, (err) => {
      if (err) {
        console.error('Lỗi khi ghi log:', err)
      } else {
        console.log('Đã ghi log đồng bộ thành công.')
      }
    })
  }

  public addFile = () =>
    createAndWriteFileUpdate({
      filePath: 'src/log/log.ts',
      currentContent: 'const result =',
      content: this.output,
      overwrite: true,
      createFolder: true
    })
}

const logger = new Logger()
export default logger
