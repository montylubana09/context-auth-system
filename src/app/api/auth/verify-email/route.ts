import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await request.json(); // Fixed: remove .body

    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Mark user as verified and clear OTP
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      $unset: { otp: 1, otpExpires: 1 }
    });

    return NextResponse.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}