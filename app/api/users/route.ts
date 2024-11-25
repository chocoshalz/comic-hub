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
