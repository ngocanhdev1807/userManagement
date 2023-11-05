import { map } from 'lodash'
import database from '~/services/database/database'
import { calculateDate } from '~/utils/time.utils'

export const update = () => {
  const users = database.getCollection('users').find().toArray()
  const updateUsser = async () => {
    const fetchAPI = map(await users, (item) => item.verify)
    map(await users, async (item) => {
      if (
        calculateDate.tinhKhoangThoiGian({
          hienTai: new Date().toISOString(),
          tuongLai: item.check.checkStatus.date as string,
          returnTimeEnd: 'Khóa tài khoản'
        }) === 'Khóa tài khoản'
      ) {
        await database.getCollection('users').updateMany(
          { _id: item._id },
          {
            $set: {
              'check.checkNinetyDays.isCheck': false,
              'check.checkNinetyDays.date': calculateDate.addToDate(new Date(), '90d')
            }
          }
        )
      }
    })

    // console.log('fetchAPI', fetchAPI)
  }
  updateUsser()
}
