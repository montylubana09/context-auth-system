export function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOTPExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

export function validateOTPFormat(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}