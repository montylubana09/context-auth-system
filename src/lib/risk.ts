// export interface RiskAssessment {
//   score: number;
//   level: 'low' | 'medium' | 'high';
//   factors: string[];
//   recommendations: string[];
// }

// export function calculateRiskScore(
//   currentLogin: {
//     ipAddress: string;
//     location: { country: string; city: string };
//     userAgent: string;
//   },
//   previousLogins: Array<{
//     ipAddress: string;
//     location: { country: string; city: string };
//     timestamp: Date;
//     userAgent: string;
//   }>
// ): RiskAssessment {
//   let score = 0;
//   const factors: string[] = [];
//   const recommendations: string[] = [];

//   // 1. Check IP consistency
//   const sameIPLogins = previousLogins.filter(
//     login => login.ipAddress === currentLogin.ipAddress
//   ).length;
  
//   if (sameIPLogins >= 3) {
//     score -= 10; // Reduce risk for familiar IP
//     factors.push('Login from trusted IP address');
//   } else if (sameIPLogins === 0) {
//     score += 30; // New IP
//     factors.push('First time login from this IP');
//     recommendations.push('Verify this new login location');
//   } else {
//     score += 10; // Occasional IP
//     factors.push('Occasional login from this IP');
//   }

//   // 2. Check location consistency
//   const sameLocationLogins = previousLogins.filter(
//     login => 
//       login.location.country === currentLogin.location.country &&
//       login.location.city === currentLogin.location.city
//   ).length;

//   if (sameLocationLogins >= 3) {
//     score -= 15; // Familiar location
//     factors.push('Login from familiar location');
//   } else if (sameLocationLogins === 0) {
//     score += 25; // New location
//     factors.push('First time login from this location');
//     recommendations.push('Confirm this new geographic location');
//   }

//   // 3. Check for frequent logins (potential suspicious activity)
//   const recentLogins = previousLogins.filter(
//     login => new Date().getTime() - login.timestamp.getTime() < 24 * 60 * 60 * 1000
//   ).length;

//   if (recentLogins > 5) {
//     score += 20;
//     factors.push('Unusually high login frequency');
//     recommendations.push('Review account for suspicious activity');
//   }

//   // 4. Check user agent changes
//   const sameUserAgent = previousLogins.some(
//     login => login.userAgent === currentLogin.userAgent
//   );

//   if (!sameUserAgent) {
//     score += 15;
//     factors.push('New device/browser detected');
//     recommendations.push('Verify this new device');
//   }

//   // 5. International access (simplified - you can expand this)
//   const commonCountries = ['United States', 'Canada', 'United Kingdom']; // Add your common countries
//   if (!commonCountries.includes(currentLogin.location.country)) {
//     score += 20;
//     factors.push('Login from uncommon country');
//     recommendations.push('Verify international access');
//   }

//   // Clamp score between 0-100
//   score = Math.max(0, Math.min(100, score));

//   // Determine risk level
//   let level: 'low' | 'medium' | 'high';
//   if (score <= 30) {
//     level = 'low';
//   } else if (score <= 70) {
//     level = 'medium';
//   } else {
//     level = 'high';
//   }

//   // Add general recommendations based on level
//   if (level === 'high') {
//     recommendations.push('Consider requiring additional verification');
//     recommendations.push('Monitor account for suspicious activity');
//   } else if (level === 'medium') {
//     recommendations.push('Enable additional security notifications');
//   }

//   return {
//     score,
//     level,
//     factors,
//     recommendations
//   };
// }

// export function getRiskLevelColor(level: string): string {
//   switch (level) {
//     case 'low':
//       return 'text-green-600 bg-green-100';
//     case 'medium':
//       return 'text-yellow-600 bg-yellow-100';
//     case 'high':
//       return 'text-red-600 bg-red-100';
//     default:
//       return 'text-gray-600 bg-gray-100';
//   }
// }

// export function getRiskScoreColor(score: number): string {
//   if (score <= 30) return 'text-green-600';
//   if (score <= 70) return 'text-yellow-600';
//   return 'text-red-600';
// }
export interface LoginData {
  ipAddress: string;
  location: {
    country: string;
    city: string;
  };
  timestamp: Date;
  userAgent: string;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
}

export function calculateRiskScore(
  currentLogin: {
    ipAddress: string;
    location: { country: string; city: string };
    userAgent: string;
  },
  previousLogins: LoginData[]
): RiskAssessment {
  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // 1. Check IP consistency
  const sameIPLogins = previousLogins.filter(
    login => login.ipAddress === currentLogin.ipAddress
  ).length;
  
  if (sameIPLogins >= 3) {
    score -= 10; // Reduce risk for familiar IP
    factors.push('Login from trusted IP address');
  } else if (sameIPLogins === 0) {
    score += 30; // New IP
    factors.push('First time login from this IP');
    recommendations.push('Verify this new login location');
  } else {
    score += 10; // Occasional IP
    factors.push('Occasional login from this IP');
  }

  // 2. Check location consistency
  const sameLocationLogins = previousLogins.filter(
    login => 
      login.location.country === currentLogin.location.country &&
      login.location.city === currentLogin.location.city
  ).length;

  if (sameLocationLogins >= 3) {
    score -= 15; // Familiar location
    factors.push('Login from familiar location');
  } else if (sameLocationLogins === 0) {
    score += 25; // New location
    factors.push('First time login from this location');
    recommendations.push('Confirm this new geographic location');
  }

  // 3. Check for frequent logins (potential suspicious activity)
  const recentLogins = previousLogins.filter(
    login => new Date().getTime() - login.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length;

  if (recentLogins > 5) {
    score += 20;
    factors.push('Unusually high login frequency');
    recommendations.push('Review account for suspicious activity');
  }

  // 4. Check user agent changes
  const sameUserAgent = previousLogins.some(
    login => login.userAgent === currentLogin.userAgent
  );

  if (!sameUserAgent) {
    score += 15;
    factors.push('New device/browser detected');
    recommendations.push('Verify this new device');
  }

  // 5. International access (simplified - you can expand this)
  const commonCountries = ['United States', 'Canada', 'United Kingdom']; // Add your common countries
  if (!commonCountries.includes(currentLogin.location.country)) {
    score += 20;
    factors.push('Login from uncommon country');
    recommendations.push('Verify international access');
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine risk level
  let level: 'low' | 'medium' | 'high';
  if (score <= 30) {
    level = 'low';
  } else if (score <= 70) {
    level = 'medium';
  } else {
    level = 'high';
  }

  // Add general recommendations based on level
  if (level === 'high') {
    recommendations.push('Consider requiring additional verification');
    recommendations.push('Monitor account for suspicious activity');
  } else if (level === 'medium') {
    recommendations.push('Enable additional security notifications');
  }

  return {
    score,
    level,
    factors,
    recommendations
  };
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getRiskScoreColor(score: number): string {
  if (score <= 30) return 'text-green-600';
  if (score <= 70) return 'text-yellow-600';
  return 'text-red-600';
}