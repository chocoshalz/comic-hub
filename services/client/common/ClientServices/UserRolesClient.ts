// userservicesClient.ts
import { Observable, from } from 'rxjs';
import { get, patch, post, put, remove } from './apiservices';  // Assuming get is an observable-returning method
import { API_PATHS } from './apipathservices';

class UserRolesClient 
{
  
  //assign role to user
  assignRoleToUser(payload:{userId:string, roleId:string})
  {
    return from(post(API_PATHS.AssignRoleToUser,payload))
  }

}

export default UserRolesClient