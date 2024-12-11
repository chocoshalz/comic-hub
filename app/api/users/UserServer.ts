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

  // Get all users except superadmin
  async getUsersList() {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        accountStatus: users.accountStatus,
        createdAt: users.createdAt,
        roleName: roles.roleName,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(sql`${roles.roleName} IS NULL OR ${roles.roleName} != 'Admin'`) //'Super Admin
      .then((usersRes: any) => {
        console.log("usersRes =>", usersRes);
        results['users'] = usersRes;
        results['status'] = 200;
        results['message'] = 'Users fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching users:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get specific users based on role
  async getSpecificUsers(userType: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        accountStatus: users.accountStatus,
        createdAt: users.createdAt,
      })
      .from(users)
      .innerJoin(userRoles, eq(users.id, userRoles.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(roles.roleName, userType)) // 'Super Admin' or 'Admin'
      .then((usersRes: any) => {
        console.log("usersRes =>", usersRes);
        results['users'] = usersRes;
        results['status'] = 200;
        results['message'] = 'Specific users fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching specific users:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get user by email
  async getUserByEmail(email: string) {
    let results: any = {
      status: "something went wrong",
    };

    try {
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (user.length > 0) {
        results['status'] = 200;
        results['message'] = "User found";
        results['data'] = user[0];
      } else {
        results['status'] = 404;
        results['message'] = "User not found";
        results['data'] = null;
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      results['error'] = error;
    }

    return results;
  }

  // Get user by ID
  async getUserByEmailId(emailId: string) {
    let results: any = {
      status: "something went wrong",
    };
  
    await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        accountStatus: users.accountStatus,
        createdAt: users.createdAt,
        roleName: sql`COALESCE(${roles.roleName}, 'User')`.as('roleName'),
        password: users.password,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.email, emailId))
      .then((userRes: any) => {
        // Check if user account is inactive or deleted
        if (userRes[0]?.accountStatus === 'inactive') {
          results['status'] = 403; // Forbidden (or 404 Not Found)
          results['message'] = 'User is inactive or deleted';
          results['data'] = null; // Don't send user data if inactive
        } else {
          results['status'] = 200;
          results['message'] = 'User found';
          results['data'] = userRes[0]; // Send user data if active
        }
      })
      .catch((error: any) => {
        console.error('Error fetching user by email ID:', error);
        results['error'] = error;
      });
  
    return results;
  }
  
  async getUserByEmailId1(emailId: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        accountStatus: users.accountStatus,
        createdAt: users.createdAt,
        roleName: sql`COALESCE(${roles.roleName}, 'User')`.as('roleName'),
        password: users.password,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.email, emailId))
      .then((userRes: any) => {
        console.log("userRes =>", userRes);
        results['status'] = 200;
        results['message'] = 'User found';
        results['data'] = userRes[0];
      })
      .catch((error: any) => {
        console.error('Error fetching user by email ID:', error);
        results['error'] = error;
      });

    return results;
  }

  // Update user (PUT)
  async updateUser(userId: string, userData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .then((updatedUser: any) => {
        console.log("updatedUser =>", updatedUser);
        results['userInfo'] = updatedUser;
        results['status'] = 200;
        results['message'] = 'User updated successfully';
      })
      .catch((error: any) => {
        console.error('Error updating user:', error);
        results['error'] = error;
      });

    return results;
  }

  // Update partial user data (PATCH)
  async patchUser(userId: string, userData: any) {
    let results: any = {
      status: "something went wrong",
    };
  
    // Ensure that userData only contains accountStatus (patch update)
    if (!userData.accountStatus) {
      results['message'] = 'No accountStatus provided to update';
      return results;
    }
  
    await db
      .update(users)
      .set({ accountStatus: userData.accountStatus }) // Only update accountStatus
      .where(eq(users.id, userId))
      .then((patchedUser: any) => {
        console.log("patchedUser =>", patchedUser);
        results['userInfo'] = patchedUser;
        results['status'] = 200;
        results['message'] = 'User accountStatus patched successfully';
      })
      .catch((error: any) => {
        console.error('Error patching user:', error);
        results['error'] = error;
      });
  
    return results;
  }
  
  async patchUser1(userId: string, userData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .then((patchedUser: any) => {
        console.log("patchedUser =>", patchedUser);
        results['userInfo'] = patchedUser;
        results['status'] = 200;
        results['message'] = 'User patched successfully';
      })
      .catch((error: any) => {
        console.error('Error patching user:', error);
        results['error'] = error;
      });

    return results;
  }

  // Delete user
  async deleteUser(userId: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .delete(users)
      .where(eq(users.id, userId))
      .then((deletedUser: any) => {
        console.log("deletedUser =>", deletedUser);
        results['status'] = 200;
        results['message'] = 'User deleted successfully';
      })
      .catch((error: any) => {
        console.error('Error deleting user:', error);
        results['error'] = error;
      });

    return results;
  }
}

export default UserServer
