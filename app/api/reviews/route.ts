import { NextResponse } from "next/server";
import ReviewsServer from "./ReviewsServer";

// Create an instance of the WishlistServer class
const ratingreviewService = new ReviewsServer();

// Add to cart
/*
{
  "userId": "user-uuid",
  "comicId": "comic-uuid",
  "rating":"",
  "reviewText":""
}
*/
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await ratingreviewService.addReview(payload);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in POST /Cart:", error);
    return NextResponse.json({ error: "Failed to add Review" }, { status: 500 });
  }
}

// Get wishlist items by user ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("comicId");

    if (!userId) {
      return NextResponse.json({ error: "comic ID is required" }, { status: 400 });
    }

    const result = await ratingreviewService.getReviewsByComicId(userId);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in GET /Cart:", error);
    return NextResponse.json({ error: "Failed to fetch Reviews" }, { status: 500 });
  }
}

// Update review by ID
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const payload = await request.json();

    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    const result = await ratingreviewService.updateReview(reviewId, payload);

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in PUT /Review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// Remove item from wishlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const result = await ratingreviewService.deleteReview(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error("Error in DELETE /Review:", error);
    return NextResponse.json({ error: "Failed to remove Review item" }, { status: 500 });
  }
}
