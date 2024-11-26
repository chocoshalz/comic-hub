import { Observable, from } from 'rxjs';
import { get, post, put, patch, remove } from './apiservices'; // Assuming these methods handle HTTP requests
import { API_PATHS } from './apipathservices';

class RoleClient {
  // Get all roles
  getAllRoles(): Observable<any> {
    return from(get(API_PATHS.GetAllRoles_Get));
  }

  // Get role by ID
  getRoleById(roleName: number): Observable<any> {
    return from(get(API_PATHS.GetRoleId(roleName)));
  }

  // Create a new role
  createRole(roleData: { roleName: string; description: string }): Observable<any> {
    return from(post(API_PATHS.CreateRole, roleData));
  }

  // Update an existing role (PUT)
  updateRole(roleId: number, roleData: { roleName?: string; description?: string }): Observable<any> {
    return from(put(API_PATHS.GetRoleId(roleId), roleData));
  }

  // Partially update an existing role (PATCH)
  patchRole(roleId: number, roleData: { roleName?: string; description?: string }): Observable<any> {
    return from(patch(API_PATHS.PatchRoleId(roleId), roleData));
  }

  // Delete a role
  deleteRole(roleId: number): Observable<any> {
    return from(remove(API_PATHS.DelRoleId(roleId)));
  }
}

export default RoleClient;
