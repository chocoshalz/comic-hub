// userservicesClient.ts
import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class WishListClient {

    getWishListByuserId(userId:string)
    {
      return from(get(API_PATHS.WishListById(userId)))
    }
    addToWishList(payload:{userId :string, comicId:string})
    {
      let reqObj:any = { action: "addtowishlist", payload:payload }
      return from(post(API_PATHS.WishList,reqObj))
    }

    removeFromWishList(wishlistid:string)
    {
      let reqObj:any = { action: "removewishlist", wishlistid }
      return from(post(API_PATHS.WishList,reqObj))
    }

    CheckWishList(payload:{userId :string, comicId:string})
    {
      let reqObj:any = { action: "checkwishlist", payload:payload }
      return from(post(API_PATHS.WishList,reqObj))
    }

}

export default WishListClient