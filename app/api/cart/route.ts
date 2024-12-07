import { NextResponse } from "next/server";
import CartServer from "./CartServer";

// Create an instance of the WishlistServer class
const cartService = new CartServer();

// Add to cart
/*
{
  "userId": "user-uuid",
  "comicId": "comic-uuid"
}
*/
export async function POST(request: Request) {
  try {
    const reqObj = await request.json();
    if(reqObj.action === "addtocart")
    {
      const result = await cartService.addToCart(reqObj.payload);
      return NextResponse.json(result, { status: result.status });
    }
    else if(reqObj.action === "removecart")
    {
      const result = await cartService.removeFromCart(reqObj.cartId)
      return NextResponse.json(result, { status: result.status });
    }
    else if(reqObj.action === "checkcart")
    {
      const result = await cartService.checkCartbyIds(reqObj.payload);
      return NextResponse.json(result, { status: result.status });
    }
   
  } catch (error) {
    console.error("Error in POST /Cart:", error);
    return NextResponse.json({ error: "Failed to add item to Cart" }, { status: 500 });
  }
}

// Get wishlist items by user ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await cartService.getCartByUserId(userId);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in GET /Cart:", error);
    return NextResponse.json({ error: "Failed to fetch Cart items" }, { status: 500 });
  }
}

// Remove item from wishlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    const result = await cartService.removeFromCart(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in DELETE /Cart:", error);
    return NextResponse.json({ error: "Failed to remove Cart item" }, { status: 500 });
  }
}
