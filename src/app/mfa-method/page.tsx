"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MFAMethodContent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleMethodSelect = async (method: "email" | "phone") => {
    if (!email) return;

    setLoading(true);

    try {
      // Send OTP to selected method
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          method 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to verification page
        router.push(`/mfa-verify?email=${encodeURIComponent(email)}&method=${method}`);
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (error) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Verification Method</h1>
          <p className="mt-2 text-gray-600">How would you like to receive your verification code?</p>
          {email && (
            <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
          )}
        </div>

        {/* Method Selection Cards */}
        <div className="space-y-4">
          {/* Email Option */}
          <button
            onClick={() => handleMethodSelect("email")}
            disabled={loading}
            className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email OTP</h3>
                <p className="text-sm text-gray-600 mt-1">Send code to your email address</p>
              </div>
            </div>
          </button>

          {/* Phone Option */}
          <button
            onClick={() => handleMethodSelect("phone")}
            disabled={loading}
            className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SMS OTP</h3>
                <p className="text-sm text-gray-600 mt-1">Send code to your phone via SMS</p>
              </div>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-blue-700 text-sm font-medium">Sending code...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MFAMethod() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <MFAMethodContent />
    </Suspense>
  );
}