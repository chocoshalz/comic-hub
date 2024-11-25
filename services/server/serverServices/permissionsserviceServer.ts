import { permissions } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
class PermissionsServiceMW  {
  // Insert a new permission
  async insertPermission(permissionData: any) {
    return await db.insert(permissions).values(permissionData).returning();
  }

  // Get all permissions
  async getPermissions() {
    return await db.select().from(permissions);
  }

  // Get permission by ID
  async getPermissionById(permissionId:any) {
    return await db.select().from(permissions).where(eq(permissions.id, permissionId));
  }

  // Update permission (PUT)
  async updatePermission(permissionId:string, permissionData:any) {
    return await db.update(permissions).set(permissionData).where(eq(permissions.id, permissionId));
  }

  // Update partial permission data (PATCH)
  async patchPermission(permissionId:string, permissionData:any) {
    return await db.update(permissions).set(permissionData).where(eq(permissions.id, permissionId));
  }

  // Delete permission
  async deletePermission(permissionId:string) {
    return await db.delete(permissions).where(eq(permissions.id, permissionId));
  }
};

export default PermissionsServiceMW;