import dbConnect from '@/lib/db';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In a real application, you would integrate an email service (Nodemailer, SendGrid, etc.)
// to send the user a link like: `http://<your-domain>/reset-password/<token>`

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      // To prevent email enumeration, we send a success message even if the user doesn't exist.
      return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiry on the user object
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();
    
    // In a real app, you would send an email here. For now, the user can't proceed without manually getting the token.
    // console.log(`Password reset link: /reset-password/${resetToken}`);

    return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
