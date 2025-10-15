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
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loginLocation, setLoginLocation] = useState<LoginLocation | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   // Get real user data from localStorage or API
  //   const userData = localStorage.getItem("user");
  //   const loginData = localStorage.getItem("loginData");

  //   if (userData) {
  //     const userObj = JSON.parse(userData);
  //     setUser(userObj);
  //   } else {
  //     // Redirect to login if no user data
  //     router.push("/login");
  //     return;
  //   }

  //   if (loginData) {
  //     const loginObj = JSON.parse(loginData);
  //     setLoginLocation(loginObj.location);

  //     // Generate recent activity from login data
  //     if (loginObj.location) {
  //       setRecentActivity([
  //         {
  //           action: "Login",
  //           location: `${loginObj.location.city}, ${loginObj.location.country}`,
  //           time: "Just now",
  //           status: "success",
  //           ip: loginObj.location.ip,
  //         },
  //       ]);
  //     }
  //   }

  //   setLoading(false);
  // }, [router]);

  useEffect(() => {
    console.log("🏠 Dashboard mounted");
    console.log("📊 localStorage user:", localStorage.getItem("user"));
    console.log(
      "📊 localStorage loginData:",
      localStorage.getItem("loginData")
    );

    const userData = localStorage.getItem("user");
    const loginData = localStorage.getItem("loginData");

    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      console.log("✅ User data set:", userObj);
    } else {
      console.log("❌ No user data found, redirecting to login...");
      router.push("/login");
      return;
    }

    if (loginData) {
      const loginObj = JSON.parse(loginData);
      setLoginLocation(loginObj.location);
      console.log("📍 Login location set:", loginObj.location);
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginData");
    router.push("/");
  };

  const securityStats = [
    {
      label: "Trusted Devices",
      value: loginLocation ? "1" : "0",
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
      value: "High",
      icon: "🛡️",
      color: "purple",
    },
    {
      label: "Alerts",
      value: "0",
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
                  {loginLocation
                    ? `${loginLocation.city}, ${loginLocation.country}`
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
        {/* {loginLocation && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Login Session
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">IP Address</p>
                <p className="font-semibold text-blue-900 text-lg">
                  {loginLocation.ipAddress || "Unknown"}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 mb-1">Country</p>
                <p className="font-semibold text-green-900 text-lg">
                  {loginLocation.country}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">City</p>
                <p className="font-semibold text-purple-900 text-lg">
                  {loginLocation.city}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Region</p>
                <p className="font-semibold text-orange-900 text-lg">
                  {loginLocation.region}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {loginLocation && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Login Session
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">IP Address</p>
                <p className="font-semibold text-blue-900 text-lg">
                  {loginLocation.ip || "127.0.0.1 (Local)"}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 mb-1">Country</p>
                <p className="font-semibold text-green-900 text-lg">
                  {loginLocation.country}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">City</p>
                <p className="font-semibold text-purple-900 text-lg">
                  {loginLocation.city}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Environment</p>
                <p className="font-semibold text-orange-900 text-lg">
                  Development
                </p>
              </div>
            </div>
            {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> In production, this would show real
                geolocation data. Currently showing local development
                environment.
              </p>
            </div> */}
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
                      {loginLocation
                        ? `Active - Logged in from ${loginLocation.city}`
                        : "Geolocation monitoring enabled"}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 text-sm">📧</span>
                      </div>
                      <h3 className="font-semibold text-purple-900">
                        Email Verified
                      </h3>
                    </div>
                    <p className="text-purple-700 text-sm">
                      OTP authentication active
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
                            {activity.action}
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
                    feature: "Geolocation API",
                    status: loginLocation ? "operational" : "checking",
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
                  <span className="text-purple-600 text-lg mr-3">📧</span>
                  <span className="text-purple-800 text-sm">Email OTP</span>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600 text-lg mr-3">📱</span>
                  <span className="text-orange-800 text-sm">
                    Device Tracking
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
