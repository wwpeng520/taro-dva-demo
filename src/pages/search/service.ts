import Request from '../../utils/request'
import { API_ROUTE } from '../../constants'

export async function queryByKeyword({ keyword }: { keyword: string }) {
  try {
    const res: any = await Request({
      url: `${API_ROUTE.GTP_PIC_SEARCH}?keyword=${keyword}`
    })
    console.log('service queryByKeyword res: ', res)
    return (res && res.data) || res
  } catch (e) {
    console.log('queryByKeyword ERROR: ', e)
    return e
  }
}
