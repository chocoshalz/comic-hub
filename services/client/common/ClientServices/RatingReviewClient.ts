import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class RatingReviewClient {

    addRatingReview(payload:{userId :string, comicId:string, rating:number, reviewText:string})
    {
        return from(post(API_PATHS.RatingReview,payload))
    }

    getAllReviewsbyComicId(comicId:string)
    {
        return from(get(`${API_PATHS.GetRatingReviewByComicId}${comicId}`))
    }

    updateReview(reviewId:string, payload:{userId:string, comicId:string, rating:number, reviewText:string, comment?:string})
    {
        let reqObj = {userId:payload.userId, comicId:payload.comicId, rating:payload.rating, reviewText:payload.comment}
        return from(put(API_PATHS.UpdateReview(reviewId), reqObj ))
    }

    deleteReview(reviewId:string)
    {
        return from(remove(API_PATHS.UpdateReview(reviewId)))
    }

}

export default RatingReviewClient