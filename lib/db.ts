import "@/lib/config"
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { users } from "../db/schema"
import * as schema from "../db/schema"
import { desc, eq } from "drizzle-orm";
// import { Product } from "@/types";

export const db = drizzle(sql, { schema })
export const getUsers = async () =>{
    const selectResult = await db.select().from(users)
    console.log("results => ", selectResult)
    return selectResult
}

export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
    return db.insert(users).values(user).returning()  
}

export const getusers = async () => {
    const result = await db.query.users.findMany();
    return result;
}

// Function to fetch user by email (updated to ensure proper syntax for Drizzle ORM)
export const getUserByEmail = async (email: string) => {
    try {
      // Use Drizzle's query methods
    //   const result = db.query.users.findFirst()
      const result = await db.query.users.findFirst({
        where: eq(users.email, email),  // Use `eq` to match the email
      });
  
      if (!result) {
        console.log('No user found for email:', email);
        return null;  // No user found
      }
  
      console.log('User found:', result);
      return result;  // Return the user object
    } catch (error: any) {
      console.log('Error fetching user by email:', error);
    //   throw new Error(`Internal Server Error: ${error.message}`);
    }
  };

export const test = () => {
    return "testing";
}

// Insert roles into the 'roles' table
// export const insertRoles = async () => {
//     const rolesResult = await db.insert(schema.roles).values([
//         { name: 'admin' },
//         { name: 'user' },
//     ]);
//     console.log("Roles inserted =>", rolesResult);
//     return rolesResult;
// }



// Fetch the 'admin' role by name to get its ID
// export const getRoleId = async (roleName: string) => {
//     const role = await db
//         .select()
//         .from(schema.roles)
//         .where(eq(schema.roles.name, roleName))  // Use `eq` for comparison
//         .limit(1);

//     console.log("Role ID for", roleName, "=>", role);
//     return role[0]?.id;  // Return the ID of the role (or null if not found)
// }

// export const insertProduct = async (product: any) => {
//     return db.insert(schema.products).values(product).returning()  
// }

// export async function getLatestProducts() {
//     const data = await db.query.products.findMany({
//       orderBy: [desc(schema.products.createdAt)],
//       limit: 4,
//     })
//     return data
//   }
  
//   export async function getProductBySlug(slug: string) {
//     return await db.query.products.findFirst({
//       where: eq(schema.products.slug, slug),
//     })
//   }