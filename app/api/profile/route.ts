import ProfileServer from './ProfileServer';
import { NextRequest, NextResponse } from 'next/server';

const profileServ = new ProfileServer();

// GET: Fetch profile by userId or all profiles
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Check if 'userid' is provided as a query parameter
  const userId = searchParams.get('userid');

  if (userId) {
    // Fetch profile by userId
    const profile = await profileServ.getProfileByUserId(userId);
    return NextResponse.json(profile);
  } else {
    return NextResponse.json(
      { status: 400, message: "User ID is required to fetch the profile." },
      { status: 400 }
    );
  }
}

// POST: Create a new profile
/*
{
  "userId": "uuid-of-user",
  "fullName": "John Doe",
  "address": "123 Main St",
  "city": "Metropolis",
  "state": "NY",
  "pinCode": "123456",
  "phone": "9876543210"
}
*/
export async function POST(request: Request) {
  const data = await request.json();
  const newProfile = await profileServ.insertProfile(data);
  return NextResponse.json(newProfile, { status: 201 });
}

// PUT: Update a profile by ID
/*
{
  "fullName": "Updated Name",
  "address": "Updated Address",
  ...
}
*/
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('id');

  if (!profileId) {
    return NextResponse.json(
      { status: 400, message: "Profile ID is required for update." },
      { status: 400 }
    );
  }

  const data = await request.json();
  const updatedProfile = await profileServ.updateProfile(profileId, data);
  return NextResponse.json(updatedProfile);
}

// PATCH: Partially update a profile by ID
/*
{
  "address": "New Partial Address"
}
*/
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('id');

  if (!profileId) {
    return NextResponse.json(
      { status: 400, message: "Profile ID is required for partial update." },
      { status: 400 }
    );
  }

  const data = await request.json();
  const patchedProfile = await profileServ.patchProfile(profileId, data);
  return NextResponse.json(patchedProfile);
}

// DELETE: Delete a profile by ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('id');

  if (!profileId) {
    return NextResponse.json(
      { status: 400, message: "Profile ID is required for deletion." },
      { status: 400 }
    );
  }

  const deletedProfile = await profileServ.deleteProfile(profileId);
  return NextResponse.json(deletedProfile);
}
