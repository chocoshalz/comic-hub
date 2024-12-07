import { cart, comics } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
class CartServer {
    // Add to cart
    async addToCart(payload: any) {
      let results: any = { status: "something went wrong" };
  
      try {
          // Check if the comic is already in the Cart
          const existingItem = await db
              .select()
              .from(cart)
              .where(and(eq(cart.userId, payload.userId), eq(cart.comicId, payload.comicId)));
  
          if (existingItem.length > 0) {
              // Comic is already in the cart
              results["status"] = 200;
              results["message"] = "You have already added this comic to your Cart";
              return await results;
          }
  
          // If not, add the comic to the Cart
          const cartlistRes = await db
              .insert(cart)
              .values(payload)
              .returning();
  
          results["cartItem"] = cartlistRes;
          results["status"] = 200;
          results["message"] = "Item added to Cart successfully";
      } catch (error: any) {
          console.error("Error adding to Cart:", error);
          results["status"] = 500; // Internal Server Error
          results["error"] = error.message || error;
      }
  
      return await results;
  }

  async checkCartbyIds(payload: any) {
    let results: any = { status: "something went wrong" };
  
    try {
      // Check if the comic is already in the Cart
      const existingItem = await db
        .select()
        .from(cart)
        .where(and(eq(cart.userId, payload.userId), eq(cart.comicId, payload.comicId)));
  
      console.log("server cart payload => ", payload, "existingItem => ", existingItem);
  
      if (existingItem.length > 0) {
        // Comic is already in the cart
        results["status"] = 200;
        results["cartId"] = existingItem[0].id; // Assuming the `cart` table has an `id` field for `cartId`
        results["message"] = "You have already added this comic to your Cart";
        return results;
      } else {
        results["status"] = 200;
        results["cartId"] = null; // No cartId since the comic is not in the cart
        results["message"] = "You have not added this comic to your Cart";
        return results;
      }
    } catch (error: any) {
      console.error("Error checking Cart:", error);
      results["status"] = 500; // Internal Server Error
      results["error"] = error.message || error;
    }
  
    return results;
  }
  
  
  async getCartByUserId(userId: string)
  {
    let results: any = { status: "something went wrong" };

    try {
        // Query card items along with comic data
        const CardItems = await db
            .select({
                cartItems: cart, // Select all fields from card
                comicData: comics // Select all fields from the comics table
            })
            .from(cart)
            .leftJoin(comics, eq(cart.comicId, comics.id)) // Join with the comics table on comicId
            .where(eq(cart.userId, userId));

        results["CardItems"] = CardItems;
        results["status"] = 200;
        results["message"] = "Card items retrieved successfully";
    } catch (error: any) {
        console.error(`Error fetching Card for user ID ${userId}:`, error);
        results["error"] = error.message || error;
        results["status"] = 500;
    }

    return results;
  }
  
    // Get cart items by user ID
    async getCartIdsByUserId(userId: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .select()
        .from(cart)
        .where(eq(cart.userId, userId))
        .then((cartItemsRes: any) => {
          console.log("cartItemsRes =>", cartItemsRes);
          results["cartItems"] = cartItemsRes;
          results["status"] = 200;
          results["message"] = "Cart items retrieved successfully";
        })
        .catch((error: any) => {
          console.error(`Error fetching cart items for user ID ${userId}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Update cart item quantity
    async updateCartItemQuantity(id: string, quantity: number) {
      let results: any = { status: "something went wrong" };
  
      await db
        .update(cart)
        .set({ quantity })
        .where(eq(cart.id, id))
        .returning()
        .then((updateCartRes: any) => {
          console.log("updateCartRes =>", updateCartRes);
          results["updatedItem"] = updateCartRes;
          results["status"] = 200;
          results["message"] = "Cart item quantity updated successfully";
        })
        .catch((error: any) => {
          console.error(`Error updating cart item with ID ${id}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Remove item from cart
    async removeFromCart(id: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .delete(cart)
        .where(eq(cart.id, id))
        .returning()
        .then((removeCartRes: any) => {
          console.log("removeCartRes =>", removeCartRes);
          results["removedItem"] = removeCartRes;
          results["status"] = 200;
          results["message"] = "Item removed from cart successfully";
        })
        .catch((error: any) => {
          console.error(`Error removing cart item with ID ${id}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  }
export default CartServer;