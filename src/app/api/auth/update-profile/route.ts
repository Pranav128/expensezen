import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import dbConnect from "@/lib/db";
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import fs from 'fs';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const email = formData.get("email") as string | null;
    const profilePicture = formData.get("profilePicture") as File | null;

    if (email) {
      // Optional: Add more robust email validation if needed
      user.email = email;
    }

    if (profilePicture) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures');

      // *** Add this section to delete the old profile picture ***
      if (user.profilePicture) {
        const oldProfilePicturePath = path.join(process.cwd(), 'public', user.profilePicture);
        try {
          await fs.promises.unlink(oldProfilePicturePath);
        //   console.log(`Deleted old profile picture: ${oldProfilePicturePath}`);
        } catch (error) {
          return NextResponse.json({ message: "Error deleting old profile picture" }, { status: 404 });
          // You might want to handle this error more gracefully in a production environment
          // For now, we'll just log it and proceed with saving the new picture
        }
      }
      // *** End of deletion section ***
      // Convert the File object to a Buffer and save it
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const filename = `${userId}-${Date.now()}-${profilePicture.name}`;
      const filePath = path.join(uploadDir, filename);

      await mkdir(uploadDir, { recursive: true });

      await writeFile(filePath, buffer);
      user.profilePicture = `/uploads/profile-pictures/${filename}`;
    }

        const updatedUser = await user.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            success: true,
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
