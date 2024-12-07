// userservicesClient.ts
import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class CartClient {

    getAllCartList(userId:string)
    {
      return from(get(API_PATHS.GetCartById(userId)))
    }
// if(reqObj.action === "addtocart")
      //   {
    
      //   }
      //   else if(reqObj.action === "refovecart")
      //   {
    
      //   }
      //   else if(reqObj.action === "checkcart")
      //   {
      
      //   }
    addTotCart(payload:{userId :string, comicId:string})
    {
      let reqObj:any = { action:"addtocart", payload:payload }
      return from(post(API_PATHS.Cart,reqObj))
    }

    RemoveFromtCart(cartId:string)
    {
      let reqObj:any = { action:"removecart", cartId }
      return from(post(API_PATHS.Cart,reqObj))
    }

    checkCart(payload:{userId :string, comicId:string})
    {
      let reqObj:any = { action:"checkcart", payload:payload }
      return from(post(API_PATHS.Cart,reqObj))
    }
  
}

export default CartClient