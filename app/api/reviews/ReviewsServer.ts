import { profile, reviews, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
class ReviewsServer {
    // Add a review
    async addReview(payload: any) {
      let results: any = { status: "something went wrong" };
  
      await db
        .insert(reviews)
        .values(payload)
        .returning()
        .then((addReviewRes: any) => {
          console.log("addReviewRes =>", addReviewRes);
          results["reviewInfo"] = addReviewRes;
          results["status"] = 200;
          results["message"] = "Review added successfully";
        })
        .catch((error: any) => {
          console.error("Error adding review:", error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Get reviews by comic ID
    async getReviewsByComicId(comicId: string) {
      let results: any = { status: "something went wrong" };
    
      try {
        // Join `reviews`, `users`, and `profile` to get username and fullName
        const getReviewsRes = await db
          .select({
            id: reviews.id,
            userId: reviews.userId,
            comicId: reviews.comicId,
            rating: reviews.rating,
            reviewText: reviews.reviewText,
            createdAt: reviews.createdAt,
            username: users.username, // Include the username column
            fullName: profile.fullName, // Include the fullName column from profile
          })
          .from(reviews)
          .leftJoin(users, eq(reviews.userId, users.id)) // Join reviews with users on userId
          .leftJoin(profile, eq(users.id, profile.userId)) // Join users with profile on userId
          .where(eq(reviews.comicId, comicId));
    
        console.log("getReviewsRes =>", getReviewsRes);
        results["reviews"] = getReviewsRes;
        results["status"] = 200;
        results["message"] = "Reviews retrieved successfully";
      } catch (error: any) {
        console.error(`Error fetching reviews for comic ID ${comicId}:`, error);
        results["error"] = error;
      }
    
      return results;
    }
    
    
    async getReviewsByComicId1(comicId: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .select()
        .from(reviews)
        .where(eq(reviews.comicId, comicId))
        .then((getReviewsRes: any) => {
          console.log("getReviewsRes =>", getReviewsRes);
          results["reviews"] = getReviewsRes;
          results["status"] = 200;
          results["message"] = "Reviews retrieved successfully";
        })
        .catch((error: any) => {
          console.error(`Error fetching reviews for comic ID ${comicId}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Update a review
    async updateReview(id: string, payload: any) {
      let results: any = { status: "something went wrong" };
  
      await db
        .update(reviews)
        .set(payload)
        .where(eq(reviews.id, id))
        .returning()
        .then((updateReviewRes: any) => {
          console.log("updateReviewRes =>", updateReviewRes);
          results["updatedReview"] = updateReviewRes;
          results["status"] = 200;
          results["message"] = "Review updated successfully";
        })
        .catch((error: any) => {
          console.error(`Error updating review with ID ${id}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Delete a review
    async deleteReview(id: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .delete(reviews)
        .where(eq(reviews.id, id))
        .returning()
        .then((deleteReviewRes: any) => {
          console.log("deleteReviewRes =>", deleteReviewRes);
          results["deletedReview"] = deleteReviewRes;
          results["status"] = 200;
          results["message"] = "Review deleted successfully";
        })
        .catch((error: any) => {
          console.error(`Error deleting review with ID ${id}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  }
  
export default ReviewsServer;