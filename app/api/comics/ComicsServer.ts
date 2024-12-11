import { comics, orders, reviews } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import ReviewsServer from "../reviews/ReviewsServer";
class ComicsServer {
  reviewServ!:ReviewsServer
  constructor()
  {
    this.reviewServ = new ReviewsServer()
  }

  // Create a new comic
  async createComic(payload: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .insert(comics)
      .values(payload)
      .returning()
      .then((createComicRes: any) => {
        console.log("createComicRes =>", createComicRes);
        results['comicInfo'] = createComicRes;
        results['status'] = 200;
        results['message'] = 'Comic created successfully';
      })
      .catch((error: any) => {
        console.error('Error creating comic:', error);
        results['error'] = error;
        results['status'] = 200
        results['message'] = `Error creating comic: ${error}`;
      });

    return await results;
  }

  // Get all comics  
  // Get all comics
async getAllComics() {
  let results: any = { status: "something went wrong" };

  try {
    // Fetch all comics with aggregated review data
    const comicsWithReviews = await db
      .select({
        id: comics.id,
        title: comics.title,
        genre: comics.genre,
        author: comics.author,
        publisher: comics.publisher,
        publicationyear: comics.publicationyear,
        price: comics.price,
        description: comics.description,
        banner: comics.banner,
        createdAt: comics.createdAt,
        reviewCount: sql`COUNT(${reviews.id})`.as("reviewCount"), // Count of reviews
        averageRating: sql`COALESCE(AVG(${reviews.rating}), 0)`.as("averageRating"), // Average rating
      })
      .from(comics)
      .leftJoin(reviews, eq(comics.id, reviews.comicId)) // Join reviews table
      .groupBy(comics.id); // Group by comic ID

    results["comics"] = comicsWithReviews;
    results["status"] = 200;
    results["message"] = "Fetched all comics successfully";
  } catch (error: any) {
    console.error("Error fetching comics:", error);
    results["error"] = error.message || error;
    results["status"] = 500;
  }

  return results;
}

  
  
  async getAllComicsworking() {
    let results: any = {
      status: "something went wrong",
    };
  
    try {
      // Fetch all comics with aggregated review data
      const allComicsRes = await db
        .select({
          id: comics.id,
          title: comics.title,
          genre: comics.genre,
          author: comics.author,
          publisher: comics.publisher,
          publicationyear: comics.publicationyear,
          price: comics.price,
          description: comics.description,
          banner: comics.banner,
          createdAt: comics.createdAt,
          reviewCount: sql`COUNT(${reviews.id})`.as("reviewCount"), // Count of reviews
          averageRating: sql`AVG(${reviews.rating})`.as("averageRating"), // Average rating
        })
        .from(comics)
        .leftJoin(reviews, eq(comics.id, reviews.comicId)) // Join reviews table
        .groupBy(comics.id); // Group by comic ID
  
      // Fetch detailed reviews for each comic
      const formattedComics = await Promise.all(
        allComicsRes.map(async (comic: any) => {
          const reviewDetails = await this.reviewServ.getReviewsByComicId(comic.id); // Fetch reviews
          const reviewCount = reviewDetails?.reviews?.length || 0; // Ensure accurate count from the method
          const averageRating = comic.averageRating || 0; // Default averageRating to null if no reviews
          const ratingPercentage = averageRating
            ? ((averageRating / 5) * 100).toFixed(2)
            : "0.00"; // Convert rating to percentage
          
          return {
            id: comic.id,
            title: comic.title,
            genre: comic.genre,
            author: comic.author,
            publisher: comic.publisher,
            publicationyear: comic.publicationyear,
            price: comic.price,
            description: comic.description,
            banner: comic.banner,
            createdAt: comic.createdAt,
            reviewCount: reviewCount.toString() , // Convert count to string for consistency
            averageRating: parseInt(averageRating, 10),
            ratingPercentage: ratingPercentage,
            reviews: reviewDetails.reviews, // Include the reviews for further use
          };
        })
      );
  
      results.comics = formattedComics;
      results.status = 200;
      results.message = "Fetched all comics successfully";
    } catch (error) {
      console.error("Error fetching comics:", error);
      results.error = error;
    }
  
    return results;
  }
  
  async getAllComics1() {
    let results: any = {
      status: "something went wrong",
    };

    // await db
    //   .select()
    //   .from(comics)
    //   .then((allComicsRes: any) => {
    //     console.log("allComicsRes =>", allComicsRes);
    //     results['comics'] = allComicsRes;
    //     results['status'] = 200;
    //     results['message'] = 'Fetched all comics successfully';
    //   })
    //   .catch((error: any) => {
    //     console.error('Error fetching comics:', error);
    //     results['error'] = error;
    //   });
    await db
    .select({
    id: comics.id,
    title: comics.title,
    genre: comics.genre,
    author: comics.author,
    publisher: comics.publisher,
    publicationyear: comics.publicationyear,
    price: comics.price,
    description: comics.description,
    banner: comics.banner,
    createdAt: comics.createdAt,
    reviewCount: sql`COUNT(${reviews.id})`.as('reviewCount'), // Count of reviews
    averageRating: sql`AVG(${reviews.rating})`.as('averageRating'), // Average rating
  })
  .from(comics)
  .leftJoin(reviews, eq(comics.id, reviews.comicId)) // Join reviews
  .groupBy(comics.id) // Group by comics.id to get aggregated values
  .then((allComicsRes: any) => {
    const formattedComics = allComicsRes.map((comic: any) => {
      const reviewCount = parseInt(comic.reviewCount, 10) || 0; // Ensure it's an integer
      const averageRating = comic.averageRating || null; // Default to null if no averageRating
      const ratingPercentage = averageRating ? ((averageRating / 5) * 100).toFixed(2) : "0.00"; // Calculate rating percentage

      return {
        id: comic.id,
        title: comic.title,
        genre: comic.genre,
        author: comic.author,
        publisher: comic.publisher,
        publicationyear: comic.publicationyear,
        price: comic.price,
        description: comic.description,
        banner: comic.banner,
        createdAt: comic.createdAt,
        reviewCount: reviewCount.toString(), // Convert to string for consistency
        averageRating: averageRating,
        ratingPercentage: ratingPercentage,
      };
    });

    results['comics'] = formattedComics;
    results['status'] = 200;
    results['message'] = 'Fetched all comics successfully';
  })
  .catch((error: any) => {
    console.error('Error fetching comics:', error);
    results['error'] = error;
  });

return results;


    return results;
  }

  // Get a comic by ID
  async getComicById(id: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select()
      .from(comics)
      .where(eq(comics.id, id))
      .limit(1)
      .then((comicRes: any) => {
        console.log("comicRes =>", comicRes);
        if (comicRes.length > 0) {
          results['comicInfo'] = comicRes[0];
          results['status'] = 200;
          results['message'] = 'Comic fetched successfully';
        } else {
          results['status'] = 404;
          results['message'] = 'Comic not found';
        }
      })
      .catch((error: any) => {
        console.error(`Error fetching comic with ID ${id}:`, error);
        results['error'] = error;
      });

    return results;
  }

  // Update a comic by ID
  async updateComic(id: string, data: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .update(comics)
      .set(data)
      .where(eq(comics.id, id))
      .returning()
      .then((updateComicRes: any) => {
        console.log("updateComicRes =>", updateComicRes);
        results['comicInfo'] = updateComicRes;
        results['status'] = 200;
        results['message'] = 'Comic updated successfully';
      })
      .catch((error: any) => {
        console.error(`Error updating comic with ID ${id}:`, error);
        results['error'] = error;
      });

    return results;
  }

  // Delete a comic by ID
  async deleteComic(id: string) {
    let results: any = {
      status: "something went wrong",
    };
  
    try {
      console.log("Checking for related orders...");
  
      // Step 1: Check for references in the orders table
      const relatedOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.comicId, id));
  
      if (relatedOrders.length > 0) {
        // If references exist, return an error message
        console.warn(`Comic with ID ${id} is referenced in ${relatedOrders.length} orders.`);
        results.status = 400;
        results.message = `Cannot delete comic with ID ${id}: it is referenced in ${relatedOrders.length} orders.`;
        results.relatedOrders = relatedOrders;
        return results;
      }
  
      console.log("No related orders found. Proceeding to delete the comic...");
  
      // Step 2: Delete the comic if no references exist
      const deleteComicRes = await db
        .delete(comics)
        .where(eq(comics.id, id))
        .returning();
  
      if (deleteComicRes.length > 0) {
        results.status = 200;
        results.message = "Comic deleted successfully";
        results.comicInfo = deleteComicRes;
      } else {
        results.status = 404;
        results.message = `No comic found with ID ${id}`;
      }
    } catch (error) {
      console.error(`Error deleting comic with ID ${id}:`, error);
      results.status = 500;
      results.message = "An error occurred while deleting the comic";
      results.error = error;
    }
  
    return results;
  }
  
  async deleteComic_121(id: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .delete(comics)
      .where(eq(comics.id, id))
      .returning()
      .then((deleteComicRes: any) => {
        console.log("deleteComicRes =>", deleteComicRes);
        results['comicInfo'] = deleteComicRes;
        results['status'] = 200;
        results['message'] = 'Comic deleted successfully';
      })
      .catch((error: any) => {
        console.error(`Error deleting comic with ID ${id}:`, error);
        results['error'] = error;
      });

    return results;
  }
}

export default ComicsServer
