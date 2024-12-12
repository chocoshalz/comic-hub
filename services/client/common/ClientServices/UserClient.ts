// userservicesClient.ts
import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class UserClient {
  // Get all users
   getAllUsers(): Observable<any> {
    // We wrap the 'get' method, which returns a promise, in an observable using `from()`
    return from(get(API_PATHS.USERS));  // from() converts the promise to an observable
  }

  // Get user by ID
  getUserById(userId: number): Observable<any> {
    return from(get(API_PATHS.USER_BY_ID(userId)));
  }

  getSpecificUsers(roleName:string)
  {
    return from(get(API_PATHS.GetSpecificUsers(roleName)));
  }

  // Create new user
  createUser(userData: { username: string; email: string, password:string }): Observable<any> {
    let reqObj:any = {
      userType:"User",
      payload:userData
    }
    return from(post(API_PATHS.USERS, reqObj));
  }

  //create admin
  createAdmin(userData: { username: string; email: string, password:string }): Observable<any> {
    let reqObj:any = {
      userType:"Admin",
      payload:userData
    }
    return from(post(API_PATHS.USERS, reqObj));
  }

  // Update user (PUT)
 updateUser(userId: string, userData: { username?: string; email?: string, accountStatus:string }): Observable<any> {
    return from(put(API_PATHS.UpdateUserById(userId), userData));
  }

  // Partially update user (PATCH)
  patchUser(userId: string, userData:any): Observable<any> {
    return from(patch(API_PATHS.UpdateUserById(userId), userData));
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return from(remove(API_PATHS.USER_BY_ID(userId)));
  }
}

export default UserClient