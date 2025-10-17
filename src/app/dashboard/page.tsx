/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  lastLogin?: string;
  loginCount?: number;
}

interface LoginLocation {
  country: string;
  city: string;
  region: string;
  ip?: string;
  ipAddress?: string;
  timezone?: string;
}

interface LoginData {
  location: LoginLocation;
  ipAddress: string;
  timestamp: string;
  mfaMethod?: string;
}
const TRUSTED_IPS = [
  "73.251.99.119", // Your primary IP address
  "::1", // Localhost IPv6
  "127.0.0.1", // Localhost IPv4
];

const isTrustedIP = (ip: string) => {
  return TRUSTED_IPS.includes(ip);
};

const isDevelopmentEnvironment = (location: any) => {
  return (
    location?.country === "Local Development" ||
    location?.city === "Localhost" ||
    location?.region === "Development"
  );
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 Dashboard mounted");
    console.log("📊 localStorage user:", localStorage.getItem("user"));
    console.log(
      "📊 localStorage loginData:",
      localStorage.getItem("loginData")
    );

    const userData = localStorage.getItem("user");
    const loginDataStr = localStorage.getItem("loginData");

    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      console.log("✅ User data set:", userObj);
    } else {
      console.log("❌ No user data found, redirecting to login...");
      router.push("/login");
      return;
    }

    if (loginDataStr) {
      const loginObj = JSON.parse(loginDataStr);
      setLoginData(loginObj);
      console.log("📍 Login data set:", loginObj);

      // Generate recent activity from login data
      if (loginObj.location) {
        setRecentActivity([
          {
            action: "Login",
            location: `${loginObj.location.city}, ${loginObj.location.country}`,
            time: "Just now",
            status: "success",
            ip: loginObj.ipAddress || loginObj.location.ip,
            mfaMethod: loginObj.mfaMethod || "email",
          },
        ]);
      }
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginData");
    router.push("/");
  };

  // Risk assessment component - dynamic based on actual data
  const RiskAssessmentBar = ({
    loginData,
  }: {
    loginData: LoginData | null;
  }) => {
    // Calculate risk score based on actual data
    const calculateRiskScore = () => {
      let score = 0;
      const factors = [];

      if (!loginData) {
        return { score: 50, factors: ["No login data available"] };
      }

      const currentIP = loginData.ipAddress || loginData.location?.ip;
      const YOUR_PRIMARY_IP = "73.251.99.119";

      // Primary IP Match Check (Most Important - 50% weight)
      if (currentIP && currentIP === YOUR_PRIMARY_IP) {
        score += 10; // Very low risk for primary IP
        factors.push("✅ Login from your primary trusted IP address");
      } else if (currentIP && isTrustedIP(currentIP)) {
        score += 20; // Low risk for other trusted IPs
        factors.push("✅ Login from trusted IP address");
      } else {
        score += 50; // High risk for unknown IPs
        factors.push("⚠️ Login from unknown IP address");
      }

      // Environment Detection (15% weight)
      const isDev = isDevelopmentEnvironment(loginData.location);
      if (isDev) {
        score += 5; // Low risk for development
        factors.push("Development environment");
      } else {
        score += 15; // Normal risk for production
        factors.push("Production environment");
      }

      // Time Analysis (15% weight)
      const loginTime = new Date(loginData.timestamp);
      const hours = loginTime.getHours();
      const isNormalHours = hours >= 6 && hours <= 22;

      if (isNormalHours) {
        score += 5; // Low risk during normal hours
        factors.push("Normal login hours");
      } else {
        score += 15; // Higher risk at unusual times
        factors.push("Unusual login time");
      }

      // MFA Method (20% weight)
      if (loginData.mfaMethod === "phone") {
        score += 5; // Lower risk for SMS
        factors.push("SMS OTP authentication");
      } else {
        score += 10; // Medium risk for email
        factors.push("Email OTP authentication");
      }

      // Special case: If it's your primary IP, override to very low risk
      if (currentIP === YOUR_PRIMARY_IP) {
        score = 15; // Force low risk for primary IP
        if (factors[0].includes("unknown")) {
          factors[0] = "✅ Login from your primary trusted IP address";
        }
      }

      return { score: Math.min(score, 100), factors };
    };

    const { score, factors } = calculateRiskScore();

    const getRiskLevel = (score: number) => {
      if (score <= 20) return "low";
      if (score <= 50) return "medium";
      if (score <= 80) return "high";
      return "critical";
    };

    const getRiskColor = (level: string) => {
      switch (level) {
        case "low":
          return "from-green-500 to-green-600";
        case "medium":
          return "from-yellow-500 to-yellow-600";
        case "high":
          return "from-orange-500 to-orange-600";
        case "critical":
          return "from-red-500 to-red-600";
        default:
          return "from-gray-500 to-gray-600";
      }
    };

    const getRiskLevelText = (level: string) => {
      switch (level) {
        case "low":
          return "Low Risk";
        case "medium":
          return "Medium Risk";
        case "high":
          return "High Risk";
        case "critical":
          return "Critical Risk";
        default:
          return "Unknown Risk";
      }
    };

    const level = getRiskLevel(score);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Security Risk Assessment
        </h2>

        {/* Risk Score Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">
              Risk Level: {getRiskLevelText(level)}
            </span>
            <span className="text-gray-900 font-bold text-lg">{score}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${getRiskColor(
                level
              )} transition-all duration-500 ease-out`}
              style={{ width: `${score}%` }}
            ></div>
          </div>

          {/* Risk Scale Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium mb-3">Risk Factors:</h3>
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-blue-800 font-medium mb-2">Security Status</h3>
          <p className="text-blue-700 text-sm">
            {level === "low" &&
              "✅ Your account security is excellent. Continue using multi-factor authentication for optimal protection."}
            {level === "medium" &&
              "⚠️ Review your login locations and consider enabling additional security measures."}
            {level === "high" &&
              "🚨 We recommend changing your password and reviewing recent account activity."}
            {level === "critical" &&
              "🔴 Immediate action required. Please contact support and change your password immediately."}
          </p>
        </div>
      </div>
    );
  };

  // Dynamic security stats based on actual data
  const securityStats = [
    {
      label: "Trusted Devices",
      value: "1", // You could track this from user data
      icon: "💻",
      color: "green",
    },
    {
      label: "Login Attempts",
      value: user?.loginCount?.toString() || "1",
      icon: "📊",
      color: "blue",
    },
    {
      label: "Security Level",
      value: loginData?.mfaMethod ? "High" : "Medium",
      icon: "🛡️",
      color: "purple",
    },
    {
      label: "Active Alerts",
      value: "0", // You could calculate this from risk score
      icon: "🔔",
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                SecureAuth
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {loginData?.location
                    ? `${loginData.location.city}, ${loginData.location.country}`
                    : "Online"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Your account is secure and actively monitored.
          </p>
        </div>

        {/* Login Location Card */}
        {/* {loginData?.location && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Login Session
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">IP Address</p>
                <p className="font-semibold text-blue-900 text-lg">
                  {loginData.ipAddress || loginData.location.ip || "::1"}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 mb-1">Country</p>
                <p className="font-semibold text-green-900 text-lg">
                  {loginData.location.country || "Local Development"}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">City</p>
                <p className="font-semibold text-purple-900 text-lg">
                  {loginData.location.city || "Localhost"}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Environment</p>
                <p className="font-semibold text-orange-900 text-lg">
                  {loginData.location.country === "Local Development"
                    ? "Development"
                    : "Production"}
                </p>
              </div>
            </div>
          </div>
        )} */}
        {/* Login Location Card */}
        {loginData?.location && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Login Session
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">IP Address</p>
                <p className="font-semibold text-blue-900 text-lg">
                  {loginData.ipAddress || loginData.location.ip || "Unknown"}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {loginData.ipAddress === "73.251.99.119"
                    ? "✅ Your primary IP"
                    : "🔍 Unknown IP"}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 mb-1">Country</p>
                <p className="font-semibold text-green-900 text-lg">
                  {loginData.location.country || "Unknown"}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">City</p>
                <p className="font-semibold text-purple-900 text-lg">
                  {loginData.location.city || "Unknown"}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">IP Trust Level</p>
                <p className="font-semibold text-orange-900 text-lg">
                  {loginData.ipAddress === "73.251.99.119"
                    ? "Trusted"
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Risk Assessment */}
            <RiskAssessmentBar loginData={loginData} />

            {/* Security Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Security Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-lg">✅</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Account Protected
                      </h3>
                      <p className="text-green-700 text-sm">
                        Multi-factor authentication is active
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">🌍</span>
                      </div>
                      <h3 className="font-semibold text-blue-900">
                        Location Tracking
                      </h3>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {loginData?.location
                        ? `Active - Logged in from ${loginData.location.city}`
                        : "Geolocation monitoring enabled"}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 text-sm">
                          {loginData?.mfaMethod === "phone" ? "📱" : "📧"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-purple-900">
                        {loginData?.mfaMethod === "phone"
                          ? "SMS Verified"
                          : "Email Verified"}
                      </h3>
                    </div>
                    <p className="text-purple-700 text-sm">
                      {loginData?.mfaMethod === "phone"
                        ? "SMS OTP authentication active"
                        : "Email OTP authentication active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                            activity.status === "success"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <span
                            className={
                              activity.status === "success"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {activity.status === "success" ? "✅" : "❌"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {activity.action} via{" "}
                            {activity.mfaMethod || "email"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {activity.location} • {activity.time}
                          </p>
                          {activity.ip && (
                            <p className="text-gray-500 text-xs mt-1">
                              IP: {activity.ip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Authentication Success Banner */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎉</span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Authentication Successful!
                </h3>
                <p className="text-green-100 text-sm">
                  {loginData?.mfaMethod === "phone"
                    ? "SMS multi-factor authentication completed successfully."
                    : "Email multi-factor authentication completed successfully."}
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                {[
                  {
                    feature: "Authentication API",
                    status: "operational",
                  },
                  {
                    feature: "Database",
                    status: "operational",
                  },
                  {
                    feature: "Email Service",
                    status: "operational",
                  },
                  {
                    feature: "SMS Service",
                    status:
                      loginData?.mfaMethod === "phone"
                        ? "operational"
                        : "standby",
                  },
                  {
                    feature: "Geolocation API",
                    status: loginData?.location ? "operational" : "checking",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{item.feature}</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "operational"
                          ? "bg-green-100 text-green-800"
                          : item.status === "standby"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Active Security Features
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-lg mr-3">🔒</span>
                  <span className="text-green-800 text-sm">
                    Multi-Factor Auth
                  </span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-lg mr-3">🌍</span>
                  <span className="text-blue-800 text-sm">IP Geolocation</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 text-lg mr-3">
                    {loginData?.mfaMethod === "phone" ? "📱" : "📧"}
                  </span>
                  <span className="text-purple-800 text-sm">
                    {loginData?.mfaMethod === "phone" ? "SMS OTP" : "Email OTP"}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600 text-lg mr-3">📊</span>
                  <span className="text-orange-800 text-sm">
                    Risk Assessment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
