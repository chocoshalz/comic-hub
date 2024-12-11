import { comics, orders, profile, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
class OrdersServer {
  // Create a new order
  async createOrder(payload: any) {
    let results: any = { status: "something went wrong" };

    await db
      .insert(orders)
      .values(payload)
      .returning()
      .then((createOrderRes: any) => {
        console.log("createOrderRes =>", createOrderRes);
        results["orderInfo"] = createOrderRes;
        results["status"] = 200;
        results["message"] = "Order created successfully";
      })
      .catch((error: any) => {
        console.error("Error creating order:", error);
        results["error"] = error;
      });

    return results;
  }

  // Get all orders for a user
  async getOrdersByUserId(userId: string) {
    let results: any = { status: "something went wrong" };
  
    try {
      // Query orders along with comic data, profile data, and user data
      const ordersWithDetails = await db
        .select({
          order: orders, // Select all fields from orders table
          comicData: comics, // Select all fields from the comics table
          profileData: profile, // Select all fields from the profile table
          // userData: users, // Select all fields from the users table
        })
        .from(orders)
        .leftJoin(comics, eq(orders.comicId, comics.id)) // Join with the comics table on comicId
        .leftJoin(profile, eq(orders.userId, profile.userId)) // Join with the profile table on userId
        // .leftJoin(users, eq(orders.userId, users.id)) // Join with the users table on userId
        .where(eq(orders.userId, userId)); // Filter by userId
  
      results["orders"] = ordersWithDetails;
      results["status"] = 200;
      results["message"] = "Orders retrieved successfully";
    } catch (error: any) {
      console.error(`Error fetching orders for user ID ${userId}:`, error);
      results["error"] = error.message || error;
      results["status"] = 500;
    }
  
    return results;
  }
  


// get all global orders
async getAllGlobalOrders() {
  let results: any = { status: "something went wrong" };

  try {
    // Query all orders along with comic data, profile data, and user data
    const ordersWithComics = await db
      .select({
        order: orders, // Select all fields from orders table
        comicData: comics, // Select all fields from the comics table
        profileData: profile, // Select all fields from the profile table
        // userData: users, // Select all fields from the users table
      })
      .from(orders)
      .leftJoin(comics, eq(orders.comicId, comics.id)) // Join with the comics table on comicId
      .leftJoin(profile, eq(orders.userId, profile.userId)) // Join with the profile table on userId
      // .leftJoin(users, eq(orders.userId, users.id)); // Join with the users table on userId

    results["orders"] = ordersWithComics;
    results["status"] = 200;
    results["message"] = "All global orders retrieved successfully";
  } catch (error: any) {
    console.error(`Error fetching global orders:`, error);
    results["error"] = error.message || error;
    results["status"] = 500;
  }

  return results;
}



  // Update order status
  async updateOrderStatus(id: string, status: string) {
    let results: any = { status: "something went wrong" };

    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning()
      .then((updateOrderRes: any) => {
        console.log("updateOrderRes =>", updateOrderRes);
        results["updatedOrder"] = updateOrderRes;
        results["status"] = 200;
        results["message"] = "Order status updated successfully";
      })
      .catch((error: any) => {
        console.error(`Error updating order with ID ${id}:`, error);
        results["error"] = error;
      });

    return results;
  }

  // Delete an order
  async deleteOrder(id: string) {
    let results: any = { status: "something went wrong" };

    await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning()
      .then((deleteOrderRes: any) => {
        console.log("deleteOrderRes =>", deleteOrderRes);
        results["deletedOrder"] = deleteOrderRes;
        results["status"] = 200;
        results["message"] = "Order deleted successfully";
      })
      .catch((error: any) => {
        console.error(`Error deleting order with ID ${id}:`, error);
        results["error"] = error;
      });

    return results;
  }
}


export default OrdersServer