// "use client";

// import { useState, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// function MFAMethodContent() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   const handleMethodSelect = async (method: "email" | "phone") => {
//     if (!email) return;

//     setLoading(true);

//     try {
//       // Send OTP to selected method
//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           method
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Redirect to verification page
//         router.push(`/mfa-verify?email=${encodeURIComponent(email)}&method=${method}`);
//       } else {
//         alert(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       alert("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
//             <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">Choose Verification Method</h1>
//           <p className="mt-2 text-gray-600">How would you like to receive your verification code?</p>
//           {email && (
//             <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
//           )}
//         </div>

//         {/* Method Selection Cards */}
//         <div className="space-y-4">
//           {/* Email Option */}
//           <button
//             onClick={() => handleMethodSelect("email")}
//             disabled={loading}
//             className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
//           >
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">Email OTP</h3>
//                 <p className="text-sm text-gray-600 mt-1">Send code to your email address</p>
//               </div>
//             </div>
//           </button>

//           {/* Phone Option */}
//           <button
//             onClick={() => handleMethodSelect("phone")}
//             disabled={loading}
//             className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
//           >
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">SMS OTP</h3>
//                 <p className="text-sm text-gray-600 mt-1">Send code to your phone via SMS</p>
//               </div>
//             </div>
//           </button>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="mt-6 text-center">
//             <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
//               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//               <span className="text-blue-700 text-sm font-medium">Sending code...</span>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <button
//             onClick={() => router.push("/login")}
//             className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
//           >
//             ← Back to login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function MFAMethod() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     }>
//       <MFAMethodContent />
//     </Suspense>
//   );
// }

// "use client";

// import { useState, Suspense, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// function MFAMethodContent() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   // Add useEffect to debug on component mount
//   useEffect(() => {
//     console.log("🔍 MFA Method Page Mounted");
//     console.log("📧 Email from URL params:", email);
//     console.log(
//       "🔗 Full URL search params:",
//       Object.fromEntries(searchParams.entries())
//     );
//     console.log("🌐 Current window location:", window.location.href);
//   }, [email, searchParams]);

//   const handleMethodSelect = async (method: "email" | "phone") => {
//     if (!email) {
//       setError("Email not found");
//       return;
//     }

//     console.log(`🔄 START: handleMethodSelect for ${method}`);
//     setLoading(true);
//     setError("");

//     try {
//       console.log(`📨 Step 1: Calling /api/auth/send-otp for ${method}`);

//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, method }),
//       });

//       console.log(`📡 Step 2: Got response status:`, response.status);

//       const data = await response.json();
//       console.log(`📦 Step 3: Response data:`, data);

//       if (response.ok) {
//         console.log(`✅ Step 4: OTP sent successfully for ${method}`);
//         console.log(`🔄 Step 5: FORCING REDIRECT to /mfa-verify`);

//         // Method 1: Use window.location.href (most reliable)
//         const verifyUrl = `/mfa-verify?email=${encodeURIComponent(
//           email
//         )}&method=${method}`;
//         console.log(`🔗 Redirect URL: ${verifyUrl}`);

//         // This should definitely work
//         window.location.href = verifyUrl;
//       } else {
//         console.log(`❌ Step 4: Failed to send OTP:`, data.error);
//         setError(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.log(`❌ Step 2-3: Network error:`, error);
//       setError("Failed to send OTP. Please try again.");
//     } finally {
//       console.log(`🏁 FINALLY: handleMethodSelect completed`);
//       setLoading(false);
//     }
//   };
//   // const handleMethodSelect = async (method: "email" | "phone") => {
//   //   console.log("🔄 Method selected:", method);
//   //   console.log("📧 Email being used:", email);

//   //   if (!email) {
//   //     console.log("❌ ERROR: No email found!");
//   //     console.log(
//   //       "🔍 Current search params:",
//   //       Object.fromEntries(searchParams.entries())
//   //     );
//   //     setError("Email not found. Please try logging in again.");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     console.log(`📨 Calling /api/auth/send-otp with:`, { email, method });

//   //     const response = await fetch("/api/auth/send-otp", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ email, method }),
//   //     });

//   //     console.log(`📡 Response status:`, response.status);

//   //     const data = await response.json();
//   //     console.log(`📦 Response data:`, data);

//   //     if (response.ok) {
//   //       console.log(
//   //         `✅ ${method} OTP sent successfully, redirecting to verify...`
//   //       );
//   //       router.push(
//   //         `/mfa-verify?email=${encodeURIComponent(email)}&method=${method}`
//   //       );
//   //     } else {
//   //       const errorMsg = data.error || "Failed to send OTP";
//   //       console.log(`❌ API Error:`, errorMsg);
//   //       setError(errorMsg);
//   //     }
//   //   } catch (error) {
//   //     console.log(`❌ Network error:`, error);
//   //     setError("Failed to send OTP. Please try again.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // If no email, show error and option to go back
//   if (!email) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
//         <div className="max-w-md w-full text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Email Not Found
//             </h2>
//             <p className="text-gray-600 mb-6">
//               We couldn&apos;t find your email information. Please try logging
//               in again.
//             </p>
//             <button
//               onClick={() => router.push("/login")}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
//             >
//               Back to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
//             <svg
//               className="w-8 h-8 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Choose Verification Method
//           </h1>
//           <p className="mt-2 text-gray-600">
//             How would you like to receive your verification code?
//           </p>
//           {email && (
//             <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
//           )}
//         </div>

//         {/* Rest of your existing JSX remains the same */}
//         {/* ... */}
//       </div>
//     </div>
//   );
// }

// export default function MFAMethod() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         </div>
//       }
//     >
//       <MFAMethodContent />
//     </Suspense>
//   );
// }
"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MFAMethodContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Add useEffect to debug on component mount
  useEffect(() => {
    console.log("🔍 MFA Method Page Mounted");
    console.log("📧 Email from URL params:", email);
    console.log(
      "🔗 Full URL search params:",
      Object.fromEntries(searchParams.entries())
    );
    console.log("🌐 Current window location:", window.location.href);
  }, [email, searchParams]);

  const handleMethodSelect = async (method: "email" | "phone") => {
    if (!email) {
      setError("Email not found");
      return;
    }

    console.log(`🔄 START: handleMethodSelect for ${method}`);
    setLoading(true);
    setError("");

    try {
      console.log(`📨 Step 1: Calling /api/auth/send-otp for ${method}`);

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, method }),
      });

      console.log(`📡 Step 2: Got response status:`, response.status);

      const data = await response.json();
      console.log(`📦 Step 3: Response data:`, data);

      if (response.ok) {
        console.log(`✅ Step 4: OTP sent successfully for ${method}`);
        console.log(`🔄 Step 5: FORCING REDIRECT to /mfa-verify`);

        // Method 1: Use window.location.href (most reliable)
        const verifyUrl = `/mfa-verify?email=${encodeURIComponent(
          email
        )}&method=${method}`;
        console.log(`🔗 Redirect URL: ${verifyUrl}`);

        // This should definitely work
        window.location.href = verifyUrl;
      } else {
        console.log(`❌ Step 4: Failed to send OTP:`, data.error);
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.log(`❌ Step 2-3: Network error:`, error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      console.log(`🏁 FINALLY: handleMethodSelect completed`);
      setLoading(false);
    }
  };

  // If no email, show error and option to go back
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find your email information. Please try logging
              in again.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
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
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Verification Method
          </h1>
          <p className="mt-2 text-gray-600">
            How would you like to receive your verification code?
          </p>
          {email && (
            <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

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
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email OTP</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Send code to your email address
                </p>
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
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SMS OTP</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Send code to your phone via SMS
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-blue-700 text-sm font-medium">
                Sending code...
              </span>
            </div>
          </div>
        )}

        {/* Debug Redirect Test */}
        <div className="mt-4 p-4 bg-purple-100 rounded-xl">
          <p className="text-sm text-purple-800 font-medium mb-2">
            Debug Redirect Test:
          </p>
          <button
            onClick={() => {
              console.log("🧪 Testing manual redirect...");
              window.location.href = `/mfa-verify?email=${encodeURIComponent(
                email || "test@test.com"
              )}&method=email`;
            }}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700"
          >
            Test Manual Redirect
          </button>
        </div>

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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <MFAMethodContent />
    </Suspense>
  );
}