import dbConnect from '@/lib/db';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { token, password } = await request.json();

    if (!token || !password) {
        return NextResponse.json({ message: 'Token and password are required.' }, { status: 400 });
    }

    // Find user by token that has not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
