// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectDB } from '@/lib/database';
// import { generateOTP, sendOTP } from '@/lib/email';
// import User from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, password } = await request.json();

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Please enter a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email already exists. Please login instead.' },
//         { status: 400 }
//       );
//     }

//     // Hash the system password (not email password)
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate OTP for email verification
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Create user (not verified yet)
//     const user = await User.create({
//       email,
//       password: hashedPassword, // This is your system password, not email password
//       otp,
//       otpExpires,
//       isVerified: false,
//       trustedDevices: [],
//       loginHistory: []
//     });

//     // Send verification OTP to real email
//     const emailSent = await sendOTP(email, otp, 'Verify your email for SecureAuth');

//     if (!emailSent) {
//       // If email fails, delete the user
//       await User.findByIdAndDelete(user._id);
//       return NextResponse.json(
//         { error: 'Failed to send verification email. Please check your email address and try again.' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       message: 'Verification code sent to your email',
//       requiresVerification: true,
//       email
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectDB } from '@/lib/database';
// import { generateOTP, sendOTP } from '@/lib/email';
// import User from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, password, phone } = await request.json(); // Add phone

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Please enter a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Validate phone format (if provided)
//     if (phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
//       return NextResponse.json(
//         { error: 'Please enter a valid phone number' },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email already exists. Please login instead.' },
//         { status: 400 }
//       );
//     }

//     // Hash the system password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate OTP for email verification
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Create user (not verified yet)
//     const user = await User.create({
//       email,
//       password: hashedPassword,
//       phone: phone || null, // Store phone if provided
//       otp,
//       otpExpires,
//       isVerified: false,
//       trustedDevices: [],
//       loginHistory: []
//     });

//     // Send verification OTP to real email
//     const emailSent = await sendOTP(email, otp, 'Verify your email for SecureAuth');

//     if (!emailSent) {
//       // If email fails, delete the user
//       await User.findByIdAndDelete(user._id);
//       return NextResponse.json(
//         { error: 'Failed to send verification email. Please check your email address and try again.' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       message: 'Verification code sent to your email',
//       requiresVerification: true,
//       email,
//       hasPhone: !!phone // Return if user provided phone
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/database';
// import { generateOTP, sendOTP } from '@/lib/email';
import { sendOTP } from '@/lib/email'; // Remove generateOTP from here
import { generateOTP } from '@/lib/otputils';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, phone } = await request.json(); // Add phone

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (if provided)
    if (phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists. Please login instead.' },
        { status: 400 }
      );
    }

    // Hash the system password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (not verified yet)
    const user = await User.create({
      email,
      password: hashedPassword,
      phone: phone || null, // Store phone if provided
      otp,
      otpExpires,
      isVerified: false,
      trustedDevices: [],
      loginHistory: []
    });

    // Send verification OTP to real email
    const emailSent = await sendOTP(email, otp, 'Verify your email for SecureAuth');

    if (!emailSent) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please check your email address and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification code sent to your email',
      requiresVerification: true,
      email,
      hasPhone: !!phone // Return if user provided phone
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}