import { orderItems } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
class OrderItemsServer {
    // Add items to an order
    async addOrderItems(payload: any[]) {
      let results: any = { status: "something went wrong" };
  
      await db
        .insert(orderItems)
        .values(payload)
        .returning()
        .then((addOrderItemsRes: any) => {
          console.log("addOrderItemsRes =>", addOrderItemsRes);
          results["orderItems"] = addOrderItemsRes;
          results["status"] = 200;
          results["message"] = "Order items added successfully";
        })
        .catch((error: any) => {
          console.error("Error adding order items:", error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Get all items for an order
    async getOrderItemsByOrderId(orderId: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId))
        .then((orderItemsRes: any) => {
          console.log("orderItemsRes =>", orderItemsRes);
          results["orderItems"] = orderItemsRes;
          results["status"] = 200;
          results["message"] = "Order items retrieved successfully";
        })
        .catch((error: any) => {
          console.error(`Error fetching order items for order ID ${orderId}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  
    // Remove an item from an order
    async removeOrderItem(id: string) {
      let results: any = { status: "something went wrong" };
  
      await db
        .delete(orderItems)
        .where(eq(orderItems.id, id))
        .returning()
        .then((removeOrderItemRes: any) => {
          console.log("removeOrderItemRes =>", removeOrderItemRes);
          results["removedItem"] = removeOrderItemRes;
          results["status"] = 200;
          results["message"] = "Order item removed successfully";
        })
        .catch((error: any) => {
          console.error(`Error removing order item with ID ${id}:`, error);
          results["error"] = error;
        });
  
      return results;
    }
  }

export default OrderItemsServer;