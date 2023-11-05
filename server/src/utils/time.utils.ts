import {
  format,
  parseISO,
  differenceInSeconds,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
  intervalToDuration,
  fromUnixTime,
  differenceInMilliseconds,
  differenceInDays,
  differenceInMonths,
  differenceInHours,
  differenceInMinutes
} from 'date-fns'
import vi from 'date-fns/locale/vi'

class Format_Date {
  public formatDate = (timestamp: number) => format(new Date(timestamp * 1000), 'dd/MM/yyyy hh:mm:ss a') // dùng jwt để convert (iat và exp)...

  public formatDateTimeString = (inputDate: string) => format(parseISO(inputDate), 'dd/MM/yyyy hh:mm:ss a')

  public formatDateTimeStringUpdate = (inputDate: string) =>
    format(parseISO(inputDate), "EEEE 'ngày' d 'tháng' M 'năm' yyyy h:mm:ss a", {
      locale: vi
    })

  public formatDateTime = (inputDate: string) => format(parseISO(inputDate), 'yyyy-MM-dd HH:mm:ss')
}

class CalculateDate {
  public tinhKhoangThoiGian = ({
    hienTai,
    tuongLai,
    returnTimeEnd = 'kết thúc khuyến mại'
  }: {
    hienTai: string
    tuongLai: string
    returnTimeEnd: string
  }): string => {
    const hienTaiDate = new Date(hienTai)
    const tuongLaiDate = new Date(tuongLai)

    const khoangThoiGianMillis = differenceInMilliseconds(tuongLaiDate, hienTaiDate)

    if (khoangThoiGianMillis <= 0) {
      return returnTimeEnd
    }

    // Kiểm tra nếu thời gian là ít hơn một ngày
    if (differenceInDays(tuongLaiDate, hienTaiDate) < 1) {
      const seconds = differenceInSeconds(tuongLaiDate, hienTaiDate)
      return `0 ngày ${Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    }

    const months = differenceInMonths(tuongLaiDate, hienTaiDate)
    const days = differenceInDays(tuongLaiDate, hienTaiDate) % 30 // Adjust for months
    const hours = differenceInHours(tuongLaiDate, hienTaiDate) % 24 // Adjust for days
    const minutes = differenceInMinutes(tuongLaiDate, hienTaiDate) % 60 // Adjust for hours
    const seconds = differenceInSeconds(tuongLaiDate, hienTaiDate) % 60 // Adjust for minutes

    let result = ''
    if (months > 0) {
      result += `${months} tháng `
    }
    if (days > 0) {
      result += `${days} ngày `
    }

    result += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`

    return result
  }

  public calculateTimeDifference = (futureTime: Date): string => {
    // Thời điểm hiện tại
    const currentTime = new Date()
    // Tính khoảng thời gian dưới dạng giây
    const diffInSeconds = differenceInSeconds(futureTime, currentTime)
    // Chuyển đổi giây thành định dạng duration
    const duration = intervalToDuration({ start: 0, end: diffInSeconds * 1000 })
    // Lấy các thành phần thời gian từ duration
    const { days, hours, minutes, seconds } = duration
    // Sử dụng padStart để thêm số 0 vào trước giây nếu cần
    const formattedDuration = `${days} days ${hours} hours ${minutes} minutes ${String(seconds).padStart(
      2,
      '0'
    )} seconds`
    return formattedDuration
  }
  // Sử dụng hàm với thời điểm trong tương lai như tham số
  // console.log(calculateTimeDifference(new Date('2023-09-28T23:20:00'))) // 9 days 6 hours 16 minutes 35 seconds

  public calculateTimeDifferenceUpdate = (currentTime: number, futureTime: number) => {
    const currentTimeDate = fromUnixTime(currentTime / 1000) // Chia cho 1000 để có thời gian tính theo giây
    const futureTimeDate = fromUnixTime(futureTime / 1000)
    return differenceInSeconds(futureTimeDate, currentTimeDate)
  }
  // const currentTime = 1696168434836 // Thời gian hiện tại
  // const futureTime = 1696168414836 // Thời gian tương lai
  // const difference = calculateTimeDifference(currentTime, futureTime)
  // console.log(difference) // Kết quả sẽ là -20

  //// method + dồn thời gian hiện tại: nhận vào Date trả về Date cộng dồn
  public addToDate = (initialDate: Date, timeToAdd: string): Date => {
    const match = timeToAdd.match(/^(\d+)([smhdMy])$/)
    if (!match) {
      throw new Error('Invalid time parameter')
    }
    const amount = parseInt(match[1], 10)
    const unit = match[2]
    if (isNaN(amount)) {
      throw new Error('Invalid time parameter')
    }
    switch (unit) {
      case 's':
        return addSeconds(initialDate, amount)
      case 'm':
        return addMinutes(initialDate, amount)
      case 'h':
        return addHours(initialDate, amount)
      case 'd':
        return addDays(initialDate, amount)
      case 'M':
        return addMonths(initialDate, amount)
      case 'y':
        return addYears(initialDate, amount)
      default:
        throw new Error('Invalid time unit')
    }
  }
}

export const format_Date = new Format_Date()
export const calculateDate = new CalculateDate()
