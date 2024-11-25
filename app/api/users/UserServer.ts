'use server'
import { roles, userRoles, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, ne, sql } from "drizzle-orm";

class UserServer {

  userrolesList: any = [];

  constructor() {}

  // Insert a new user
  async insertUser(userData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .insert(users)
      .values(userData)
      .returning()
      .then((insertedUser: any) => {
        console.log("insertedUser =>", insertedUser);
        results['userInfo'] = insertedUser;
        results['status'] = 200;
        results['message'] = 'User created successfully';
      })
      .catch((error: any) => {
        console.error('Error inserting user:', error);
        results['error'] = error;
      });

    return results;
  }

  // Create a new user with a role
  async createUser(userData: any) {
    let results: any = {
      status: "something went wrong",
    };

    // Check if the user already exists based on email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      results['status'] = 400;
      results['message'] = "User already exists";
      return results;
    }

    // Insert the new user
    await db
      .insert(users)
      .values(userData)
      .returning()
      .then(async (insertedUser: any) => {
        console.log("insertedUser =>", insertedUser);

        // Fetch the "User" role
        const userRole = await db
          .select()
          .from(roles)
          .where(eq(roles.roleName, 'User'))
          .limit(1);

        if (userRole.length === 0) {
          results['status'] = 400;
          results['message'] = "User role not found";
          return results;
        }

        // Assign the "User" role to the new user
        const userRoleId = userRole[0].id;
        const userId = insertedUser[0].id;

        await db.insert(userRoles).values({
          userId,
          roleId: userRoleId,
        });

        results['userInfo'] = insertedUser;
        results['status'] = 200;
        results['message'] = 'User created successfully';
      })
      .catch((error: any) => {
        console.error('Error creating user:', error);
        results['error'] = error;
      });

    return results;
  }

  async CreateAdmin(userData:any)
  {
    let results: any = {
      status: "something went wrong",
    };

    // Check if the user already exists based on email
    const existingUser = await db .select().from(users).where(eq(users.email, userData.email)).limit(1);

    if (existingUser.length > 0) {
      results['status'] = 400;
      results['message'] = "Admin User already exists";
      return results;
    }

    // Insert the new user
    await db
      .insert(users).values(userData).returning()
      .then(async (insertedUser: any) => {
        console.log("insertedUser =>", insertedUser);

        // Fetch the "User" role
        const userRole = await db.select().from(roles).where(eq(roles.roleName, 'Admin')).limit(1);

        if (userRole.length === 0) {
          results['status'] = 400;
          results['message'] = "Admin role not found";
          return results;
        }

        // Assign the "User" role to the new user
        const userRoleId = userRole[0].id;
        const userId = insertedUser[0].id;

        await db.insert(userRoles).values({
          userId,
          roleId: userRoleId,
        });

        results['userInfo'] = insertedUser;
        results['status'] = 200;
        results['message'] = 'Admin User created successfully';
      })
      .catch((error: any) => {
        console.error('Error creating user:', error);
        results['error'] = error;
      });

    return results;
  }

  
}

export default UserServer
