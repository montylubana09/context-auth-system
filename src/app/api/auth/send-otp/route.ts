
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { generateOTP } from '@/lib/otputils';
import { sendOTP as sendEmailOTP } from '@/lib/email';
import { sendSMSOTP } from '@/lib/sms'; // Make sure this import is correct

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
      // ACTUALLY CALL THE SMS FUNCTION
      console.log('📱 Calling sendSMSOTP function...');
      const smsResult = await sendSMSOTP(user.phone, otp);
      
      if (smsResult.success) {
        console.log('✅ SMS sent successfully via Twilio!');
      } else {
        console.log('❌ SMS failed:', smsResult.message);
        // You can choose to throw an error or continue
        // throw new Error(smsResult.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `OTP sent to your ${method}`,
      method
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}