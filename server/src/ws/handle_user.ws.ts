import { format, parseISO } from 'date-fns'
import { find, map } from 'lodash'
import { ObjectId } from 'mongodb'
import { WebSocket } from 'ws'
import database from '~/services/database/database'
import { calculateDate } from '~/utils/time.utils'

class HandleUserConnection {
  result = (ws: WebSocket) => {
    console.log('User Client connected')

    const updateInterval = setInterval(() => {
      const findName = (searchName: string, dataArray: any[]) => find(dataArray, { name: searchName })
      const convertDateTime = (input: string): string => format(parseISO(input), 'MM/dd/yyyy HH:mm:ss')
      const userData = async () => {
        const res = map(await database.getCollection('users').find().toArray(), (_res) => {
          return {
            ..._res,
            names: map(_res.names, (__res) => {
              return {
                ...__res,
                calculateDate: calculateDate.tinhKhoangThoiGian({
                  hienTai: new Date().toISOString(),
                  tuongLai: __res.last_time?.stringDate as string,
                  returnTimeEnd: 'Có thể chỉnh sửa'
                })
              }
            }),
            //
            time_thoigianthuc:
              {
                ...findName(_res.name, _res?.names as any),
                calculateDate:
                  calculateDate.tinhKhoangThoiGian({
                    hienTai: new Date().toISOString(),
                    tuongLai: findName(_res.name, _res?.names)?.last_time?.stringDate as string,
                    returnTimeEnd: 'Có thể chỉnh sửa'
                  }) === 'NaN:NaN:NaN' && Number(_res?.names.length) === 3
                    ? ''
                    : calculateDate.tinhKhoangThoiGian({
                        hienTai: new Date().toISOString(),
                        tuongLai: findName(_res.name, _res?.names)?.last_time?.stringDate as string,
                        returnTimeEnd: 'Có thể chỉnh sửa'
                      })
              } || {},
            check90days: {
              calculateDate:
                _res.check.checkStatus.isCheck === false &&
                `${calculateDate.tinhKhoangThoiGian({
                  hienTai: new Date().toISOString(),
                  tuongLai: _res.check.checkNinetyDays.date,
                  returnTimeEnd: 'Khóa tài khoản'
                })}`
            },
            created_at: convertDateTime(_res.created_at.toISOString())
          }
        })

        ws.send(JSON.stringify(res))
      }
      userData()
    }, 1000)

    ws.on('message', (message) => {
      const receive_data_from_the_client_sent_up = JSON.parse(message.toString())
      console.log('receive_data_from_the_client_sent_up', receive_data_from_the_client_sent_up)
    })

    ws.on('open', () => {
      ws.send('something')
    })

    ws.on('error', () => {
      console.error
    })

    ws.on('close', () => {
      console.log('User Client disconnected')
      clearInterval(updateInterval)
    })
  }
}
const handleUserConnection = new HandleUserConnection()
export default handleUserConnection
