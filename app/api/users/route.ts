import UserServer from './UserServer';
import { NextRequest, NextResponse } from 'next/server';
const userServ = new UserServer()
// GET: Fetch all users
export async function GET(request: Request) {
  const { searchParams } = await new URL(request.url);
  
    // Example: Get the value of 'getbyid' and 'removebyid'
    const getById = await searchParams.get('getbyid');
    const getRoleUser = await searchParams.get('getspecificusers');
    
    if (getById) {
      // Handle fetching user by ID
      console.log("getById => ",getById)
      const user = await userServ.getUserByEmailId(getById)
      return await NextResponse.json(user);
    } 
    else if (getRoleUser) {
      // Handle fetching user by ID
      console.log("getRoleUser => ",getRoleUser)
      const user = await userServ.getSpecificUsers(getRoleUser)
      return await NextResponse.json(user);
    } 
    else {
      const allUsers = await userServ.getUsersList()
      return NextResponse.json(allUsers);
    }
  
}

// POST: Create a new user
/*
{
  "username": "newUser5",
  "email": "newUser1@example.com",
  "password": "securepassword1",
  "accountStatus": "active"
}
*/
export async function POST(request: Request) {
  const data:any = await request.json();
  if(data.userType === "User")
  {
    const newUser = await userServ.createUser(data.payload)
    return NextResponse.json(newUser, { status: 201 });
  }
  else if(data.userType === "Admin")
  {
    const newUser = await userServ.CreateAdmin(data.payload)
    return NextResponse.json(newUser, { status: 201 });
  }
 
}


export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get the 'updateuser' parameter and 'userid' from the query string
  const updateUserId = await searchParams.get('userid');
  const userData = await request.json(); // Parse the JSON body for the user data

  if (updateUserId && userData) {
    try {
      // Call your update service to update the user by ID
      const updateResult = await userServ.updateUser(updateUserId, userData);

      if (updateResult.status === 200) {
        return NextResponse.json({
          status: updateResult.status,
          message: updateResult.message,
          userInfo: updateResult.userInfo,
        });
      } else {
        return NextResponse.json({
          status: updateResult.status,
          message: updateResult.message || 'Error updating user',
          error: updateResult.error || 'Unknown error',
        });
      }
    } catch (error:any) {
      console.error('Error in PUT request:', error);
      return NextResponse.json({
        status: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  } else {
    return NextResponse.json({
      status: 400,
      message: 'Missing user ID or data to update.',
    });
  }
}


export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get the 'userid' from the query string
  const updateUserId = await searchParams.get('userid');
  const userData = await request.json(); // Parse the JSON body for the user data

  if (updateUserId && userData && userData.accountStatus) {
    try {
      // Call your patch service to update the accountStatus for the user
      const patchResult = await userServ.patchUser(updateUserId, userData);

      if (patchResult.status === 200) {
        return NextResponse.json({
          status: patchResult.status,
          message: patchResult.message,
          userInfo: patchResult.userInfo,
        });
      } else {
        return NextResponse.json({
          status: patchResult.status,
          message: patchResult.message || 'Error patching user',
          error: patchResult.error || 'Unknown error',
        });
      }
    } catch (error: any) {
      console.error('Error in PATCH request:', error);
      return NextResponse.json({
        status: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  } else {
    return NextResponse.json({
      status: 400,
      message: 'Missing user ID or accountStatus data to patch.',
    });
  }
}
