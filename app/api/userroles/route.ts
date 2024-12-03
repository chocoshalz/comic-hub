
import UserRoleServer from './UserRoleServer';
import { NextRequest, NextResponse } from 'next/server';
const roleuserServ = new UserRoleServer()
//assign role to user

/*
{
  "userId": "uuid-of-super-admin-user",
  "roleId": "uuid-of-super-admin-role"
}

{
  "userId": "uuid-of-regular-user",
  "roleId": "uuid-of-admin-role"
}

*/
export async function POST(request: Request) {
  const data = await request.json();
  const assignrole = await roleuserServ.assignRoletouser(data)
  return NextResponse.json(assignrole, { status: 201 });
}


export async function GET(request: Request) {
    // Parse the request URL to extract query parameters
    const { searchParams } = await new URL(request.url);
  
    // Example: Get the value of 'getbyid' and 'removebyid'
    const getById = await searchParams.get('getbyid');
    const removeById = await searchParams.get('removebyid');
    const getUserRoleNamebyUserId = await searchParams.get("getUserRoleNamebyUserId")
  
    if (getById) {
      // Handle fetching user by ID
      console.log("getById => ",getById)
      const user = await roleuserServ.getUserRoleByUserId(getById)
      return await NextResponse.json(user);
    } else if (removeById) {
      // Handle removing user by ID
      const result = await roleuserServ.removeAssignedrolefromuser(removeById); 
      return await NextResponse.json(result);
    } 
    else if(getUserRoleNamebyUserId)
    {
      const result = await roleuserServ.getUserRoleNamebyUserId(getUserRoleNamebyUserId); 
      return await NextResponse.json(result);
    }
    else {
      // Handle cases where no specific action is provided
      return NextResponse.json({ success: false, message: 'No valid query parameters provided' });
    }
  }