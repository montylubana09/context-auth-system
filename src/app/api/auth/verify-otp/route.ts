// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/database';
// import User from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, otp } = await request.json();

//     console.log('🔐 OTP verification for:', email);

//     const user = await User.findOne({ 
//       email,
//       otp,
//       otpExpires: { $gt: new Date() }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid or expired OTP' },
//         { status: 400 }
//       );
//     }

//     // Get client IP for the verification request
//     const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
//                     request.headers.get('x-real-ip') || 
//                     'unknown';

//     console.log('✅ OTP verified successfully for:', email);

//     // Clear OTP
//     await User.findByIdAndUpdate(user._id, {
//       $unset: { otp: 1, otpExpires: 1 }
//     });

//     // Return success with user data
//     return NextResponse.json({
//       success: true,
//       message: 'Login successful',
//       user: { 
//         id: user._id, 
//         email: user.email 
//       },
//       location: {
//         ip: clientIP,
//         country: 'Local Development',
//         city: 'Localhost',
//         region: 'Development Environment'
//       }
//     });
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await request.json();

    console.log('🔐 OTP verification for:', email);

    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Get client IP properly
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded ? forwarded.split(',')[0].trim() : (realIP || 'unknown');

    console.log('🌍 Client IP during OTP verification:', clientIP);

    // Update user with login information
    await User.findByIdAndUpdate(user._id, {
      $unset: { otp: 1, otpExpires: 1 },
      lastLoginIP: clientIP,
      lastLoginAt: new Date(),
      $push: {
        loginHistory: {
          timestamp: new Date(),
          device: 'web',
          userAgent: request.headers.get('user-agent') || 'unknown',
          ipAddress: clientIP,
          location: {
            country: 'Local Development',
            city: 'Localhost', 
            region: 'Development',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude: 0,
            longitude: 0
          },
          riskScore: 0,
          riskFactors: ['development_environment'],
          status: 'success'
        }
      }
    });

    console.log('✅ OTP verified successfully for:', email);
    console.log('💾 User updated with IP:', clientIP);

    // Return success with user data including real IP
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { 
        id: user._id, 
        email: user.email 
      },
      location: {
        ip: clientIP,
        country: 'Local Development',
        city: 'Localhost',
        region: 'Development Environment'
      },
      ipAddress: clientIP
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}