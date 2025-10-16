/* eslint-disable @typescript-eslint/no-explicit-any */

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

//     // Get client IP properly
//     const forwarded = request.headers.get('x-forwarded-for');
//     const realIP = request.headers.get('x-real-ip');
//     const clientIP = forwarded ? forwarded.split(',')[0].trim() : (realIP || 'unknown');

//     console.log('🌍 Client IP during OTP verification:', clientIP);

//     // Get the OTP method for logging
//     const otpMethod = user.otpMethod || 'email';

//     // Update user with login information
//     await User.findByIdAndUpdate(user._id, {
//       $unset: { otp: 1, otpExpires: 1, otpMethod: 1 },
//       lastLoginIP: clientIP,
//       lastLoginAt: new Date(),
//       $push: {
//         loginHistory: {
//           timestamp: new Date(),
//           device: 'web',
//           userAgent: request.headers.get('user-agent') || 'unknown',
//           ipAddress: clientIP,
//           mfaMethod: otpMethod, // Store which method was used
//           location: {
//             country: 'Local Development',
//             city: 'Localhost', 
//             region: 'Development',
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             latitude: 0,
//             longitude: 0
//           },
//           riskScore: 0,
//           riskFactors: ['development_environment'],
//           status: 'success'
//         }
//       }
//     });

//     console.log('✅ OTP verified successfully for:', email);
//     console.log('📱 OTP Method used:', otpMethod);
//     console.log('💾 User updated with IP:', clientIP);

//     // Return success with user data including real IP
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
//       },
//       ipAddress: clientIP,
//       mfaMethod: otpMethod
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
import { calculateRiskScore, LoginData } from '@/lib/risk';

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

    // Get the OTP method for logging
    const otpMethod = user.otpMethod || 'email';

    // Calculate risk score based on previous login history
    const previousLogins: LoginData[] = user.loginHistory
      .filter((login: any) => login.status === 'success')
      .map((login: any) => ({
        ipAddress: login.ipAddress,
        location: {
          country: login.location.country,
          city: login.location.city
        },
        timestamp: new Date(login.timestamp),
        userAgent: login.userAgent
      }));

    const riskAssessment = calculateRiskScore(
      {
        ipAddress: clientIP,
        location: {
          country: 'Local Development',
          city: 'Localhost'
        },
        userAgent: request.headers.get('user-agent') || 'unknown'
      },
      previousLogins
    );

    console.log('📊 Risk Assessment:', {
      score: riskAssessment.score,
      level: riskAssessment.level,
      factors: riskAssessment.factors
    });

    // Update user with login information including risk assessment
    await User.findByIdAndUpdate(user._id, {
      $unset: { otp: 1, otpExpires: 1, otpMethod: 1 },
      lastLoginIP: clientIP,
      lastLoginAt: new Date(),
      $push: {
        loginHistory: {
          timestamp: new Date(),
          device: 'web',
          userAgent: request.headers.get('user-agent') || 'unknown',
          ipAddress: clientIP,
          mfaMethod: otpMethod,
          location: {
            country: 'Local Development',
            city: 'Localhost', 
            region: 'Development',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude: 0,
            longitude: 0
          },
          riskScore: riskAssessment.score,
          riskFactors: riskAssessment.factors,
          status: 'success'
        }
      }
    });

    console.log('✅ OTP verified successfully for:', email);
    console.log('📱 OTP Method used:', otpMethod);
    console.log('📊 Risk Score:', riskAssessment.score, '- Level:', riskAssessment.level);
    console.log('💾 User updated with IP:', clientIP);

    // Return success with user data including risk assessment
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
      ipAddress: clientIP,
      mfaMethod: otpMethod,
      riskAssessment: {
        score: riskAssessment.score,
        level: riskAssessment.level,
        factors: riskAssessment.factors,
        recommendations: riskAssessment.recommendations
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}