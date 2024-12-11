import { NextResponse } from "next/server";
import WishlistServer from "./WishlistServer";

// Create an instance of the WishlistServer class
const wishlistService = new WishlistServer();

// Add to wishlist
/*
{
  "userId": "user-uuid",
  "comicId": "comic-uuid"
}
*/
export async function POST(request: Request) {
  try {
    const reqObj = await request.json();
    const payload = reqObj.payload
    if(reqObj.action === "addtowishlist")
    {
      const result = await wishlistService.addToWishlist(payload);
      return NextResponse.json(result, { status: result.status });
    }
    else if(reqObj.action === "removewishlist")
    {
      const result = await wishlistService.removeFromWishlist(reqObj.wishlistid);
      return NextResponse.json(result, { status: result.status });
    }
    else if(reqObj.action === "checkwishlist")
    {
      const result = await wishlistService.checkWishList(payload);
      return NextResponse.json(result, { status: result.status });
    }
    
  } catch (error) {
    console.error("Error in POST /wishlist:", error);
    return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 });
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

    const result = await wishlistService.getWishlistByUserId(userId);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in GET /wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist items" }, { status: 500 });
  }
}

// Remove item from wishlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Wishlist item ID is required" }, { status: 400 });
    }

    const result = await wishlistService.removeFromWishlist(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in DELETE /wishlist:", error);
    return NextResponse.json({ error: "Failed to remove wishlist item" }, { status: 500 });
  }
}
