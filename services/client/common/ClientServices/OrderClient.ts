// userservicesClient.ts
import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class OrderClient {

    getGlobalOrdersList()
    {
      return from(get(API_PATHS.GetGlobalOrders))
    }

    getAllOrderList(userId:string)
    {
      return from(get(API_PATHS.GetOrdersById(userId)))
    }

    CreateOrder(payload:{userId :string, comicId:string, status:string})
    {
      // let reqObj:any = { action:"addtocart", payload:payload }
      return from(post(API_PATHS.Order,payload))
    }

    RemoveOrder(orderId:string)
    {
      return from(remove(API_PATHS.DelOrdersById(orderId)))
    }

    updateOrder(orderId:string, status:string)
    {
      let payload = { id:orderId, status }
      return from(put(API_PATHS.Order,payload))
    }
  
}
let orderService = new OrderClient()
export default orderService