import { roles } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

class RolesServer {
// Insert a new role
async insertRole(roleData: any) {
  let results: any = {
    status: "something went wrong",
  };

  try {
    // Check if a role with the same name already exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.roleName, roleData.roleName));

    if (existingRole.length > 0) {
      // Role with the same name already exists
      results['status'] = 200; // Conflict
      results['message'] = `Role with name "${roleData.roleName}" already exists.`;
      return results;
    }

    // Insert the new role
    const createRoleRes = await db
      .insert(roles)
      .values(roleData)
      .returning();

    results['roleInfo'] = createRoleRes;
    results['status'] = 201; // Created
    results['message'] = 'Role created successfully';
  } catch (error: any) {
    console.error('Error creating role:', error);
    results['error'] = error;
  }

  return results;
}


  // Get all roles
  async getRoles() {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select()
      .from(roles)
      .then((rolesRes: any) => {
        console.log("rolesRes =>", rolesRes);
        results['roles'] = rolesRes;
        results['status'] = 200;
        results['message'] = 'Roles fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching roles:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get role by ID
  async getRoleById(roleId: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .then((roleRes: any) => {
        console.log("roleRes =>", roleRes);
        results['role'] = roleRes;
        results['status'] = 200;
        results['message'] = 'Role fetched successfully';
      })
      .catch((error: any) => {
        console.error('Error fetching role by ID:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get role by name
async getRoleByName(roleName: string) {
  let results: any = {
    status: "something went wrong",
  };

  await db
    .select()
    .from(roles)
    .where(eq(roles.roleName, roleName))
    .then((roleRes: any) => {
      console.log("roleRes =>", roleRes);
      results['role'] = roleRes;
      results['status'] = 200;
      results['message'] = 'Role fetched successfully';
    })
    .catch((error: any) => {
      console.error('Error fetching role by name:', error);
      results['error'] = error;
    });

  return results;
}


  // Update role (PUT)
  async updateRole(roleId: string, roleData: any) {
    let results: any = {
      status: "something went wrong",
    };
  
    try {
      // Check if the role exists
      const existingRole = await db
        .select()
        .from(roles)
        .where(eq(roles.id, roleId));
  
      if (existingRole.length === 0) {
        results['status'] = 404; // Not Found
        results['message'] = `Role with ID "${roleId}" does not exist.`;
        return results;
      }
  
      // Perform the full update
      const updateRoleRes = await db
        .update(roles)
        .set(roleData)
        .where(eq(roles.id, roleId))
        .returning();
  
      results['roleInfo'] = updateRoleRes;
      results['status'] = 200; // OK
      results['message'] = 'Role updated successfully';
    } catch (error: any) {
      console.error('Error updating role:', error);
      results['error'] = error;
    }
  
    return results;
  }
  

  // Update partial role data (PATCH)
  async patchRole(roleId: string, roleData: any) {
    let results: any = {
      status: "something went wrong",
    };
  
    try {
      // Check if the role exists
      const existingRole = await db
        .select()
        .from(roles)
        .where(eq(roles.id, roleId));
  
      if (existingRole.length === 0) {
        results['status'] = 404; // Not Found
        results['message'] = `Role with ID "${roleId}" does not exist.`;
        return results;
      }
  
      // Perform the partial update
      const patchRoleRes = await db
        .update(roles)
        .set(roleData)
        .where(eq(roles.id, roleId))
        .returning();
  
      results['roleInfo'] = patchRoleRes;
      results['status'] = 200; // OK
      results['message'] = 'Role Updated successfully';
    } catch (error: any) {
      console.error('Error patching role:', error);
      results['error'] = error;
    }
  
    return results;
  }
  

  // Delete role
  async deleteRole(roleId: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .delete(roles)
      .where(eq(roles.id, roleId))
      .then((deleteRoleRes: any) => {
        console.log("deleteRoleRes =>", deleteRoleRes);
        results['status'] = 200;
        results['message'] = 'Role deleted successfully';
      })
      .catch((error: any) => {
        console.error('Error deleting role:', error);
        results['error'] = error;
      });

    return results;
  }
}

export default RolesServer;
