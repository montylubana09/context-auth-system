// test-sms.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import { sendSMSOTP } from '@lib/sms';

async function test() {
  console.log('🧪 Testing Twilio SMS...');
  console.log('Twilio Number:', process.env.TWILIO_PHONE_NUMBER);
  
  // Use your personal verified number
  const result = await sendSMSOTP('+1234567890', '123456'); // Replace with your personal number
  
  console.log('Test Result:', result);
}

test();