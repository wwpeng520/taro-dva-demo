import qs from 'qs'
import Request from '../../utils/request'
import { API_ROUTE } from '../../constants'

export async function getGtps(params: Object) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.GTP_PIC}?${qs.stringify(params)}`
    })
    console.log('service getGtps res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('getGtps ERROR: ', e)
    return e
  }
}
