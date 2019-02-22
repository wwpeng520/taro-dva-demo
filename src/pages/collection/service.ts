import Request from '../../utils/request'
import { API_ROUTE } from '../../constants'

export async function getCollections() {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.USER_COLLECTION}`
    })
    console.log('service getCollections res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('getCollections ERROR: ', e)
    return e
  }
}
