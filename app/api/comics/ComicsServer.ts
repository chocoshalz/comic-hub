import { comics } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

class ComicsServer {
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
  async getAllComics() {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select()
      .from(comics)
      .then((allComicsRes: any) => {
        console.log("allComicsRes =>", allComicsRes);
        results['comics'] = allComicsRes;
        results['status'] = 200;
        results['message'] = 'Fetched all comics successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching comics:', error);
        results['error'] = error;
      });

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
