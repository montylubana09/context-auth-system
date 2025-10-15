export interface LocationData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  isp: string;
}

export async function getLocationFromIP(ip: string): Promise<LocationData> {
  // Handle localhost/development IPs
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    return {
      country: 'Local Development',
      city: 'Localhost',
      region: 'Development',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: 0,
      longitude: 0,
      isp: 'Local Network'
    };
  }

  try {
    // Using ipapi.co with native fetch
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      isp: data.org || 'Unknown ISP'
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    
    // Fallback data
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      timezone: 'Unknown',
      latitude: 0,
      longitude: 0,
      isp: 'Unknown'
    };
  }
}

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}