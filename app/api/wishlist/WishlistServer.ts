import { comics, wishlist } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
class WishlistServer {
    // Add to wishlist  
    async addToWishlist(payload: any) {
        let results: any = { status: "something went wrong" };
    
        try {
            // Check if the comic is already in the wishlist
            const existingItem = await db
                .select()
                .from(wishlist)
                .where(and(eq(wishlist.userId, payload.userId), eq(wishlist.comicId, payload.comicId)));
    
            if (existingItem.length > 0) {
                // Comic is already in the wishlist
                results["status"] = 200;
                results["message"] = "You have already added this comic to your wishlist";
                return results;
            }
    
            // If not, add the comic to the wishlist
            const addWishlistRes = await db
                .insert(wishlist)
                .values(payload)
                .returning();
    
            results["wishlistItem"] = addWishlistRes;
            results["status"] = 200;
            results["message"] = "Item added to wishlist successfully";
        } catch (error: any) {
            console.error("Error adding to wishlist:", error);
            results["status"] = 500; // Internal Server Error
            results["error"] = error.message || error;
        }
    
        return results;
    }
    
  
    // Get all wishlist items by user ID
    async getWishlistByUserId(userId: string) {
    let results: any = { status: "something went wrong" };

    try {
        // Query wishlist items along with comic data
        const wishlistItems = await db
            .select({
                wishlistItem: wishlist, // Select all fields from wishlist
                comicData: comics // Select all fields from the comics table
            })
            .from(wishlist)
            .leftJoin(comics, eq(wishlist.comicId, comics.id)) // Join with the comics table on comicId
            .where(eq(wishlist.userId, userId));

        results["wishlistItems"] = wishlistItems;
        results["status"] = 200;
        results["message"] = "Wishlist items retrieved successfully";
    } catch (error: any) {
        console.error(`Error fetching wishlist for user ID ${userId}:`, error);
        results["error"] = error.message || error;
        results["status"] = 500;
    }

    return results;
}


    async getWishlistIdsByUserId(userId: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .select()
        .from(wishlist)
        .where(eq(wishlist.userId, userId))
        .then((wishlistRes: any) => {
          console.log("wishlistRes =>", wishlistRes);
          results["wishlistItems"] = wishlistRes;
          results["status"] = 200;
          results["message"] = "Wishlist items retrieved successfully";
        })
        .catch((error: any) => {
          console.error(`Error fetching wishlist for user ID ${userId}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Remove from wishlist
    async removeFromWishlist(wishlistid: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .delete(wishlist)
        .where(eq(wishlist.id, wishlistid))
        .returning()
        .then((removeWishlistRes: any) => {
          console.log("removeWishlistRes =>", removeWishlistRes);
          results["removedItem"] = removeWishlistRes;
          results["status"] = 200;
          results["message"] = "Item removed from wishlist successfully";
        })
        .catch((error: any) => {
          console.error(`Error removing wishlist item with ID ${wishlistid}:`, error);
          results["error"] = error;
        });
  
      return results;
    }

    async checkWishList(payload:any)
    {
      let results: any = { status: "something went wrong" };
    
        try {
            // Check if the comic is already in the wishlist
            const existingItem = await db
                .select()
                .from(wishlist)
                .where(and(eq(wishlist.userId, payload.userId), eq(wishlist.comicId, payload.comicId)));
    
            if (existingItem.length > 0) {
                // Comic is already in the wishlist
                results["status"] = 200;
                results["message"] = "You have already added this comic to your wishlist";
                return results;
            }
          } catch (error: any) {
            console.error("Error adding to wishlist:", error);
            results["status"] = 500; // Internal Server Error
            results["error"] = error.message || error;
        }
    
        return results;
    }
  }
  
export default WishlistServer;