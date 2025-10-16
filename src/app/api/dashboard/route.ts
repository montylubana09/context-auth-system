import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { calculateRiskScore, LoginData } from '@/lib/risk';

interface UserLoginHistory {
  ipAddress: string;
  location: {
    country: string;
    city: string;
    region: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  userAgent: string;
  status: string;
  riskScore?: number;
  riskFactors?: string[];
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate current session risk
    const loginHistory = user.loginHistory as UserLoginHistory[];
    const currentLogin = loginHistory[loginHistory.length - 1];
    
    const previousLogins: LoginData[] = loginHistory
      .slice(0, -1) // Exclude current login
      .filter(login => login.status === 'success')
      .map(login => ({
        ipAddress: login.ipAddress,
        location: {
          country: login.location.country,
          city: login.location.city
        },
        timestamp: new Date(login.timestamp),
        userAgent: login.userAgent
      }));

    const riskAssessment = currentLogin ? calculateRiskScore(
      {
        ipAddress: currentLogin.ipAddress,
        location: {
          country: currentLogin.location.country,
          city: currentLogin.location.city
        },
        userAgent: currentLogin.userAgent
      },
      previousLogins
    ) : null;

    // Calculate statistics
    const totalLogins = loginHistory.filter(login => login.status === 'success').length;
    
    // Count unique IPs
    const ipCounts: { [key: string]: number } = {};
    loginHistory.forEach(login => {
      if (login.status === 'success') {
        ipCounts[login.ipAddress] = (ipCounts[login.ipAddress] || 0) + 1;
      }
    });
    
    const uniqueIPs = Object.keys(ipCounts).length;
    const uniqueLocations = [...new Set(loginHistory.map(login => 
      `${login.location.city}, ${login.location.country}`
    ))].length;

    // Get recent activity (last 5 logins)
    const recentActivity = loginHistory
      .slice(-5)
      .reverse()
      .map(login => ({
        action: 'Login',
        location: `${login.location.city}, ${login.location.country}`,
        time: new Date(login.timestamp).toLocaleString(),
        status: login.status,
        ip: login.ipAddress,
        riskScore: login.riskScore || 0,
        riskFactors: login.riskFactors || []
      }));

    // Calculate trusted devices (IPs used 3+ times)
    const trustedDevices = Object.values(ipCounts).filter(count => count >= 3).length;

    return NextResponse.json({
      user: {
        email: user.email,
        lastLogin: user.lastLoginAt,
        loginCount: totalLogins,
        phone: user.phone
      },
      currentSession: {
        location: currentLogin?.location,
        ipAddress: currentLogin?.ipAddress,
        riskAssessment: riskAssessment || {
          score: 0,
          level: 'low',
          factors: ['No risk data available'],
          recommendations: []
        }
      },
      statistics: {
        totalLogins,
        uniqueIPs,
        uniqueLocations,
        trustedDevices,
        securityLevel: riskAssessment?.level === 'low' ? 'High' : 
                      riskAssessment?.level === 'medium' ? 'Medium' : 'Low'
      },
      recentActivity
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}