'use server'
import { NextRequest, NextResponse } from 'next/server';
import RolesServer from './RolesServer';

const roleServ= new RolesServer

// GET: Fetch all roles or role by ID (if query parameter is provided)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('id');
  const roleName = searchParams.get('name');

  if (roleId) {
    const role = await roleServ.getRoleById(roleId);
    return NextResponse.json(role);
  } 
  else if(roleName)
  {
    const role = await roleServ.getRoleByName(roleName);
    return NextResponse.json(role);
  }
  else {
    const allRoles = await roleServ.getRoles();
    return NextResponse.json(allRoles);
  }
}
  
// POST: Create a new role
/*
{
  "roleName": "Super Admin",
  "description": "Has full control over the system",
}

{
  "roleName": "Admin",
  "description": "Can manage users, orders, and reviews",
}
{
  "roleName": "User",
  "description": "Has limited access to the system, primarily for viewing and interacting with content"
}
*/
export async function POST(request: Request) {
  const data = await request.json();
  const newRole = await roleServ.insertRole(data)
  return NextResponse.json(newRole, { status: 201 });
}


// PUT: Update an existing role
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('id');

  if (!roleId) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  const data = await request.json();
  const updatedRole = await roleServ.updateRole(roleId, data);
  return NextResponse.json(updatedRole);
}

// PATCH: Partially update an existing role
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('id');

  if (!roleId) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  const data = await request.json();
  const patchedRole = await roleServ.patchRole(roleId, data);
  return NextResponse.json(patchedRole);
}

// DELETE: Remove a role by ID
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('id');

  if (!roleId) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  const deleteResult = await roleServ.deleteRole(roleId);
  return NextResponse.json(deleteResult);
}
