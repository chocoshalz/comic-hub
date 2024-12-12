// profileClient.ts
import { Observable, from } from 'rxjs';
import { get, post, put, patch, remove } from './apiservices';
import { API_PATHS } from './apipathservices';

class ProfileClient {
  // Fetch all profiles
  getAllProfiles(): Observable<any> {
    return from(get(API_PATHS.PROFILES));
  }

  // Fetch a profile by ID
  getProfileById(userId: string): Observable<any> {
    return from(get(API_PATHS.PROFILE_BY_ID(userId)));
  }

  // Create a new profile
  createProfile(profileData: {
    userId: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
    profilepic:string
  }): Observable<any> {
    return from(post(API_PATHS.PROFILES, profileData));
  }

  // https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/flash-QXxgBgkLWEtchixeXxCZqGYgs3mD2E.jpg
  // https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/flash-OoNr4YuJKk8lTwYx55z5tRGGXhxWFc.jpg

  // Update a profile by ID (PUT)
  updateProfile(profileId: string, updatedData: any): Observable<any> {
    return from(put(API_PATHS.UpdatePROFILE_BY_ID(profileId), updatedData));
  }

  // Partially update a profile by ID (PATCH)
  patchProfile(profileId: string, updatedData: any): Observable<any> {
    return from(patch(API_PATHS.UpdatePROFILE_BY_ID(profileId), updatedData));
  }

  // Delete a profile by ID
  deleteProfile(profileId: string): Observable<any> {
    return from(remove(API_PATHS.UpdatePROFILE_BY_ID(profileId)));
  }
}

export default ProfileClient;
