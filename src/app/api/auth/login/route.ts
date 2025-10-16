
// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectDB } from '@/lib/database';
// // import { generateOTP, sendOTP } from '@/lib/email';
// import { sendOTP } from '@/lib/email'; // Remove generateOTP from here
// import { generateOTP } from '@/lib/otputils'; 
// import { getLocationFromIP, getClientIP } from '@/lib/geolocation';
// import User from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, password } = await request.json();

//     console.log('🔍 Login attempt for email:', email);

//     // Get client IP and location
//     const clientIP = getClientIP(request);
//     const userAgent = request.headers.get('user-agent') || 'unknown';
    
//     console.log('🌍 Client IP:', clientIP);
//     console.log('💻 User Agent:', userAgent);

//     // Get location from IP
//     let location;
//     if (clientIP && clientIP !== 'unknown') {
//       location = await getLocationFromIP(clientIP);
//       console.log('📍 User location:', location);
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Please enter a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'No account found with this email. Please register first.' },
//         { status: 400 }
//       );
//     }

//     // Check if user is verified
//     if (!user.isVerified) {
//       return NextResponse.json(
//         { error: 'Please verify your email address before logging in.' },
//         { status: 400 }
//       );
//     }

//     // Verify password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return NextResponse.json(
//         { error: 'Invalid password' },
//         { status: 400 }
//       );
//     }

//     // Generate and send OTP
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//     await User.findByIdAndUpdate(user._id, {
//       otp,
//       otpExpires
//     });

//     // Store login attempt with location data
//     user.loginHistory.push({
//       timestamp: new Date(),
//       device: 'web',
//       userAgent: userAgent,
//       ipAddress: clientIP,
//       location: location || {
//         country: 'Unknown',
//         city: 'Unknown',
//         region: 'Unknown',
//         timezone: 'Unknown',
//         latitude: 0,
//         longitude: 0
//       },
//       riskScore: 0,
//       riskFactors: [],
//       status: 'otp_required'
//     });

//     await user.save();

//     // Send OTP to email
//     const emailSent = await sendOTP(email, otp, 'Your SecureAuth Login Code');

//     if (!emailSent) {
//       return NextResponse.json(
//         { error: 'Failed to send verification code. Please try again.' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       message: 'Verification code sent to your email',
//       requiresOTP: true,
//       email,
//       location: location ? {
//         city: location.city,
//         country: location.country,
//         ip: clientIP
//       } : null
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectDB } from '@/lib/database';
// import { getLocationFromIP, getClientIP } from '@/lib/geolocation';
// import User from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, password } = await request.json();

//     console.log('🔍 Login attempt for email:', email);

//     // Get client IP and location
//     const clientIP = getClientIP(request);
//     const userAgent = request.headers.get('user-agent') || 'unknown';
    
//     console.log('🌍 Client IP:', clientIP);
//     console.log('💻 User Agent:', userAgent);

//     // Get location from IP
//     let location;
//     if (clientIP && clientIP !== 'unknown') {
//       location = await getLocationFromIP(clientIP);
//       console.log('📍 User location:', location);
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Please enter a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'No account found with this email. Please register first.' },
//         { status: 400 }
//       );
//     }

//     // Check if user is verified
//     if (!user.isVerified) {
//       return NextResponse.json(
//         { error: 'Please verify your email address before logging in.' },
//         { status: 400 }
//       );
//     }

//     // Verify password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return NextResponse.json(
//         { error: 'Invalid password' },
//         { status: 400 }
//       );
//     }

//     // Store login attempt with location data
//     user.loginHistory.push({
//       timestamp: new Date(),
//       device: 'web',
//       userAgent: userAgent,
//       ipAddress: clientIP,
//       location: location || {
//         country: 'Unknown',
//         city: 'Unknown',
//         region: 'Unknown',
//         timezone: 'Unknown',
//         latitude: 0,
//         longitude: 0
//       },
//       riskScore: 0,
//       riskFactors: [],
//       status: 'mfa_choice_required' // Changed this status
//     });

//     await user.save();

//     console.log('✅ Password verified, redirecting to MFA method choice');

//     // Return success - NO OTP generated here anymore
//     return NextResponse.json({
//       success: true,
//       message: 'Please choose your verification method',
//       requiresMFAChoice: true, // Changed from requiresOTP
//       email,
//       hasPhone: !!user.phone, // Indicate if user has phone for SMS option
//       location: location ? {
//         city: location.city,
//         country: location.country,
//         ip: clientIP
//       } : null
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/database';
import { getLocationFromIP, getClientIP } from '@/lib/geolocation';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    console.log('🔍 Login attempt for email:', email);

    // Get client IP and location
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    console.log('🌍 Client IP:', clientIP);
    console.log('💻 User Agent:', userAgent);

    // Get location from IP
    let location;
    if (clientIP && clientIP !== 'unknown') {
      location = await getLocationFromIP(clientIP);
      console.log('📍 User location:', location);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please register first.' },
        { status: 400 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email address before logging in.' },
        { status: 400 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      );
    }

    // Store login attempt with location data - NO OTP GENERATED HERE
    user.loginHistory.push({
      timestamp: new Date(),
      device: 'web',
      userAgent: userAgent,
      ipAddress: clientIP,
      location: location || {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'Unknown',
        latitude: 0,
        longitude: 0
      },
      riskScore: 0,
      riskFactors: [],
      status: 'mfa_choice_required' // Important: Changed status
    });

    await user.save();

    console.log('✅ Password verified, redirecting to MFA method choice');
    console.log('📱 User has phone:', !!user.phone);

    // Return success - NO OTP generated here anymore
    return NextResponse.json({
      success: true,
      message: 'Please choose your verification method',
      requiresMFAChoice: true, // This tells frontend to go to MFA method page
      email,
      hasPhone: !!user.phone, // Indicate if user has phone for SMS option
      location: location ? {
        city: location.city,
        country: location.country,
        ip: clientIP
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}