'use server'
import { profile, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

class ProfileServer {

  constructor() {}

  // Insert a new profile
  async insertProfile(profileData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .insert(profile)
      .values(profileData)
      .returning()
      .then((insertedProfile: any) => {
        console.log("insertedProfile =>", insertedProfile);
        results['profileInfo'] = insertedProfile;
        results['status'] = 200;
        results['message'] = 'Profile created successfully';
      })
      .catch((error: any) => {
        console.error('Error inserting profile:', error);
        results['error'] = error;
      });

    return results;
  }

  // Get profile by user ID
  async getProfileByUserId(userId: string) {
    let results: any = {
      status: "something went wrong",
    };
  
    try {
      const profileRes = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, userId)) // Correct column name is referenced here
        .limit(1);
  
      console.log("profileRes =>", profileRes);
  
      if (profileRes.length > 0) {
        results['status'] = 200;
        results['message'] = 'Profile found';
        results['data'] = profileRes[0];
      } else {
        results['status'] = 200;
        results['message'] = 'Profile not found';
      }
    } catch (error: any) {
      console.error('Error fetching profile by user ID:', error);
  
      results['error'] = error;
      results['status'] = 500;
    }
  
    return results;
  }


  // Update profile (PUT)
  async updateProfile(profileId: string, profileData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .update(profile)
      .set(profileData)
      .where(eq(profile.id, profileId))
      .then((updatedProfile: any) => {
        console.log("updatedProfile =>", updatedProfile);
        results['profileInfo'] = updatedProfile;
        results['status'] = 200;
        results['message'] = 'Profile updated successfully';
      })
      .catch((error: any) => {
        console.error('Error updating profile:', error);
        results['error'] = error;
      });

    return results;
  }

  // Update partial profile data (PATCH)
  async patchProfile(profileId: string, profileData: any) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .update(profile)
      .set(profileData)
      .where(eq(profile.id, profileId))
      .then((patchedProfile: any) => {
        console.log("patchedProfile =>", patchedProfile);
        results['profileInfo'] = patchedProfile;
        results['status'] = 200;
        results['message'] = 'Profile patched successfully';
      })
      .catch((error: any) => {
        console.error('Error patching profile:', error);
        results['error'] = error;
      });

    return results;
  }

  // Delete profile
  async deleteProfile(profileId: string) {
    let results: any = {
      status: "something went wrong",
    };

    await db
      .delete(profile)
      .where(eq(profile.id, profileId))
      .then((deletedProfile: any) => {
        console.log("deletedProfile =>", deletedProfile);
        results['status'] = 200;
        results['message'] = 'Profile deleted successfully';
      })
      .catch((error: any) => {
        console.error('Error deleting profile:', error);
        results['error'] = error;
      });

    return results;
  }
}

export default ProfileServer;
