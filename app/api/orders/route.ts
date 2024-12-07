import { NextResponse } from "next/server";
import OrdersServer from "./OrdersServer";

// Create an instance of the OrdersServer class
const ordersService = new OrdersServer();

// Create a new order
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await ordersService.createOrder(payload);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in POST /orders:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// Get orders by user ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    // if (!userId) {
    //   return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    // }

    if(userId)
    {
      const result = await ordersService.getOrdersByUserId(userId);
      return NextResponse.json(result, { status: result.status });
    }
    else
    {
      const result = await ordersService.getAllGlobalOrders();
      return NextResponse.json(result, { status: result.status });
    }
    
  } catch (error) {
    console.error("Error in GET /orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Update order status
export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const { id, status } = payload;

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const result = await ordersService.updateOrderStatus(id, status);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in PUT /orders:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

// Delete an order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const result = await ordersService.deleteOrder(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in DELETE /orders:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
