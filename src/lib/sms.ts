import twilio from 'twilio';

export async function sendSMSOTP(phoneNumber: string, otp: string): Promise<{success: boolean; message?: string}> {
  console.log(`📱 [SMS] Attempting to send OTP to ${phoneNumber}`);
  
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    console.log('🔐 Twilio Config Check:');
    console.log('   - Account SID:', accountSid ? 'Set' : 'NOT SET');
    console.log('   - Auth Token:', authToken ? 'Set' : 'NOT SET');
    console.log('   - Twilio Phone:', twilioPhone || 'NOT SET');

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    if (!twilioPhone) {
      throw new Error('Twilio phone number not configured');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📞 Formatted phone: ${phoneNumber} -> ${formattedPhone}`);

    const client = twilio(accountSid, authToken);
    
    console.log(`📤 Sending SMS via Twilio...`);
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhone,
      to: formattedPhone
    });

    console.log('✅ SMS sent via Twilio successfully!');
    console.log('   - Message SID:', message.sid);
    console.log('   - Status:', message.status);
    console.log('   - To:', formattedPhone);
    console.log('   - OTP:', otp);
    
    return { success: true, message: 'SMS sent successfully' };
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('❌ Twilio SMS failed:');
    console.log('   - Error:', error.message);
    console.log('   - Error Code:', error.code);
    console.log('   - Error More Info:', error.moreInfo);
    
    // Fallback: Log to console for demo
    console.log(`💡 DEMO SMS - OTP for ${phoneNumber}: ${otp}`);
    
    return { 
      success: false, 
      message: `SMS failed: ${error.message}. Check server logs for demo OTP.`
    };
  }
}

function formatPhoneNumber(phone: string): string {
  console.log(`📞 Original phone number: "${phone}"`);
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  console.log(`📞 After removing non-digits: "${cleaned}"`);
  
  // If it's a 10-digit US number without country code, add +1
  if (cleaned.length === 10) {
    cleaned = `+1${cleaned}`;
    console.log(`📞 Added US country code: "${cleaned}"`);
  }
  // If it's 11 digits and starts with 1, ensure it has +
  else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = `+${cleaned}`;
    console.log(`📞 Added + prefix: "${cleaned}"`);
  }
  // If it doesn't start with +, add it
  else if (!cleaned.startsWith('+')) {
    cleaned = `+${cleaned}`;
    console.log(`📞 Added + prefix: "${cleaned}"`);
  }
  
  console.log(`📞 Final formatted number: "${cleaned}"`);
  return cleaned;
}