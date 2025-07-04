import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import dbConnect from "@/lib/db";
import { writeFile } from 'fs/promises';
import path from 'path';

dbConnect();

export async function PUT(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const formData = await request.formData();
        const email = formData.get('email') as string | null;
        const profilePicture = formData.get('profilePicture') as File | null;

        if (email) {
            // Optional: Add email validation
            user.email = email;
        }

        if (profilePicture) {
            const buffer = Buffer.from(await profilePicture.arrayBuffer());
            // Define the path to save the image
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures');
            const filename = `${userId}-${Date.now()}-${profilePicture.name}`;
            const filePath = path.join(uploadDir, filename);

            // Ensure the upload directory exists
            await require('fs').promises.mkdir(uploadDir, { recursive: true });

            await writeFile(filePath, buffer);
            // Save the public path to the database
            user.profilePicture = `/uploads/profile-pictures/${filename}`;
        }

        await user.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}