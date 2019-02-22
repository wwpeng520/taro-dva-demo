import qs from 'qs'
import Request from '../utils/request'
import { API_ROUTE } from '../constants'

export async function getGtps(params: any) {
  try {
    let url;
    if (params && params.next_link) {
      url = params.next_link
    } else {
      url = `${API_ROUTE.GTP_PIC}?${qs.stringify(params)}`
    }

    const res: any = await Request({ url })
    console.log('service getGtps res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('getGtps ERROR: ', e)
    return e
  }
}
