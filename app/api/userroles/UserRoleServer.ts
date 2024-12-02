import { roles, userRoles, users } from "@/db/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm";

class UserRoleServer {
  
  constructor() {
    
  }

  // Get all userRolesTable rows
  async getUserroles() {
    let results: any = { status: "something went wrong" };
    await db
      .select()
      .from(userRoles)
      .then((userRolesRes: any) => {
        results['userRoles'] = userRolesRes;
        results['status'] = 200;
        results['message'] = 'User roles fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching user roles:', error);
        results['error'] = error;
      });

    return results;
  }

  // Assign role to user
  async assignRoletouser(userroleIds: any) {
    let results: any = { status: "something went wrong" };
    await db
      .insert(userRoles)
      .values(userroleIds)
      .returning()
      .then((assignRoleRes: any) => {
        results['assignedRole'] = assignRoleRes;
        results['status'] = 200;
        results['message'] = 'Role assigned to user successfully';
      })
      .catch((error: any) => {
        console.error('Error assigning role to user:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get user role row using userId
  async getUserRoleByUserId(userId: string) {
    let results: any = { status: "something went wrong" };
    await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .then((userRoleRes: any) => {
        results['userRole'] = userRoleRes;
        results['status'] = 200;
        results['message'] = 'User role fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching user role by userId:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get user role name by userId
  async getUserRoleNamebyUserId(userId: string) {
    let results: any = { status: "something went wrong" };
    await db
      .select({
        roleName: roles.roleName
      })
      .from(roles)
      .innerJoin(userRoles, eq(roles.id, userRoles.roleId))
      .innerJoin(users, eq(userRoles.userId, users.id))
      .where(eq(users.id, userId))
      .then((roleNameRes: any) => {
        results['roleName'] = roleNameRes;
        results['status'] = 200;
        results['message'] = 'User role name fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching role name by userId:', error);
        results['error'] = error;
      });

    return results;
  }

  // Remove assigned role from user
  async removeAssignedrolefromuser(userId: any) {
    let results: any = { status: "something went wrong" };
    await db
      .delete(userRoles)
      .where(eq(userRoles.userId, userId))
      .then(() => {
        results['status'] = 200;
        results['message'] = 'Role removed from user successfully';
      })
      .catch((error: any) => {
        console.error('Error removing assigned role from user:', error);
        results['error'] = error;
      });

    return results;
  }
}

export default UserRoleServer;
