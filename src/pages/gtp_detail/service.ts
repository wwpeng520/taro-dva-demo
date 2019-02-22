// import qs from 'qs'
import Request from '../../utils/request'
import { API_ROUTE } from '../../constants'

export async function getDetail({ id }: { id: number }) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.GTP_PIC}/${id}}`
    })
    console.log('service getDetail res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('getDetail ERROR: ', e)
    return e
  }
}

export async function favor({ id, type }: { id: number; type: string }) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.GTP_PIC_FAVOR}/${id}}`,
      method: 'PUT',
      data: { type }
    })
    console.log('service favor res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('favor ERROR: ', e)
    return e
  }
}

export async function collect({ id, type }: { id: number; type: string }) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.GTP_PIC_COLLECTION}/${id}}`,
      method: 'PUT',
      data: { type }
    })
    console.log('service collect res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('collect ERROR: ', e)
    return e
  }
}
