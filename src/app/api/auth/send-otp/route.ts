// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/database';
// import User from '@/models/User';
// import { generateOTP } from '@/lib/otputils';
// import { sendOTP as sendEmailOTP } from '@/lib/email'; // Fixed import
// import { sendSMSOTP } from '@/lib/sms';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, method } = await request.json();

//     console.log('📨 Sending OTP via:', method, 'for:', email);

//     if (!email || !method) {
//       return NextResponse.json(
//         { error: 'Email and method are required' },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // For phone method, check if user has phone number
//     if (method === 'phone' && !user.phone) {
//       return NextResponse.json(
//         { 
//           error: 'Phone number not registered. Please update your profile with a phone number.',
//           needsPhone: true 
//         },
//         { status: 400 }
//       );
//     }

//     // Generate OTP
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Update user with OTP
//     await User.findOneAndUpdate(
//       { email },
//       { 
//         otp,
//         otpExpires,
//         otpMethod: method
//       }
//     );

//     console.log('🔐 Generated OTP:', otp, 'for method:', method);

//     // Send OTP via selected method
//     if (method === 'email') {
//       await sendEmailOTP(email, otp);
//       console.log('📧 Email OTP sent to:', email);
//     } else if (method === 'phone') {
//       await sendSMSOTP(user.phone, otp);
//       console.log('📱 SMS OTP processed for:', user.phone);
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: `OTP sent to your ${method}`,
//       method,
//       // For demo, include OTP in response (remove in production)
//       demoOtp: process.env.NODE_ENV === 'development' ? otp : undefined
//     });

//   } catch (error) {
//     console.error('Send OTP error:', error);
//     return NextResponse.json(
//       { error: 'Failed to send OTP' },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/database';
// import User from '@/models/User';
// import { generateOTP } from '@/lib/otputils';
// import { sendOTP as sendEmailOTP } from '@/lib/email';
// import { sendSMSOTP } from '@/lib/sms';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const { email, method } = await request.json();

//     console.log('📨 Sending OTP via:', method, 'for:', email);

//     if (!email || !method) {
//       return NextResponse.json(
//         { error: 'Email and method are required' },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // For phone method, check if user has phone number
//     if (method === 'phone' && !user.phone) {
//       return NextResponse.json(
//         { 
//           error: 'Phone number not registered. Please update your profile with a phone number.',
//           needsPhone: true 
//         },
//         { status: 400 }
//       );
//     }

//     // Generate OTP
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Update user with OTP
//     await User.findOneAndUpdate(
//       { email },
//       { 
//         otp,
//         otpExpires,
//         otpMethod: method
//       }
//     );

//     console.log('🔐 Generated OTP:', otp, 'for method:', method);

//     let smsResult;
    
//     // Send OTP via selected method
//     if (method === 'email') {
//       await sendEmailOTP(email, otp);
//       console.log('📧 Email OTP sent to:', email);
//     } else if (method === 'phone') {
//       smsResult = await sendSMSOTP(user.phone, otp);
      
//       if (smsResult.success) {
//         console.log('✅ SMS OTP sent successfully to:', user.phone);
//       } else {
//         console.log('⚠️ SMS failed, but OTP is still valid. Error:', smsResult.message);
//         // You can choose to still proceed or return an error
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: `OTP sent to your ${method}`,
//       method,
//       smsStatus: method === 'phone' ? smsResult : undefined,
//       // For demo, include OTP in response (remove in production)
//       demoOtp: process.env.NODE_ENV === 'development' ? otp : undefined
//     });

//   } catch (error) {
//     console.error('Send OTP error:', error);
//     return NextResponse.json(
//       { error: 'Failed to send OTP' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { generateOTP } from '@/lib/otputils';
import { sendOTP as sendEmailOTP } from '@/lib/email';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, method } = await request.json();

    console.log('📨 Sending OTP via:', method, 'for:', email);

    if (!email || !method) {
      return NextResponse.json(
        { error: 'Email and method are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // For phone method, check if user has phone number
    if (method === 'phone' && !user.phone) {
      return NextResponse.json(
        { 
          error: 'Phone number not registered. Please update your profile with a phone number.',
          needsPhone: true 
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await User.findOneAndUpdate(
      { email },
      { 
        otp,
        otpExpires,
        otpMethod: method
      }
    );

    console.log('🔐 Generated OTP:', otp, 'for method:', method);

    // Send OTP via selected method
    if (method === 'email') {
      await sendEmailOTP(email, otp);
      console.log('📧 Email OTP sent to:', email);
    } else if (method === 'phone') {
      // For phone, we'll use a simpler approach for now
      console.log('📱 SMS OTP (DEMO):', otp, 'for phone:', user.phone);
      console.log('💡 In production, integrate with Twilio or another SMS service');
    }

    return NextResponse.json({ 
      success: true, 
      message: `OTP sent to your ${method}`,
      method,
      // For demo, include OTP in response
      demoOtp: otp
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}