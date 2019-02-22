import Request from '../utils/request'
import { API_ROUTE } from '../constants'

export async function get({ key }: { key: string }) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.CONFIG}/${key}`
    })
    console.log('service get config res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('get configERROR: ', e)
    return e
  }
}
