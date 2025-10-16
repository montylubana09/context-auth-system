// "use client";

// import { useState, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// function MFAVerifyContent() {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         console.log("✅ Login successful, storing user data...");
//         console.log("🌍 IP Address from server:", data.ipAddress);

//         // Store user data in localStorage with IP address
//         localStorage.setItem("token", "authenticated");
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem(
//           "loginData",
//           JSON.stringify({
//             location: data.location,
//             ipAddress: data.ipAddress, // Make sure this is included
//             timestamp: new Date().toISOString(),
//           })
//         );

//         console.log("💾 Stored in localStorage - IP:", data.ipAddress);
//         console.log("🔄 Redirecting to dashboard...");

//         // Redirect to dashboard
//         router.push("/dashboard");
//       } else {
//         setError(data.error || "Verification failed");
//       }
//     } catch (error) {
//       setError("Verification failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
//             <svg
//               className="w-10 h-10 text-white"
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
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//             Verify your identity
//           </h1>
//           <p className="mt-2 text-gray-600">
//             We&apos;ve sent a code to your email
//           </p>
//           {email && (
//             <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
//           )}
//         </div>

//         {/* OTP Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <form onSubmit={handleVerify} className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 text-red-400 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-red-800 text-sm font-medium">
//                     {error}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div>
//               <label
//                 htmlFor="otp"
//                 className="block text-sm font-medium text-gray-700 mb-3 text-center"
//               >
//                 Enter verification code
//               </label>
//               <div className="flex justify-center space-x-3">
//                 {[0, 1, 2, 3, 4, 5].map((index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     maxLength={1}
//                     className="w-12 h-12 text-2xl text-center font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
//                     value={otp[index] || ""}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value) {
//                         const newOtp = otp.split("");
//                         newOtp[index] = value;
//                         setOtp(newOtp.join(""));

//                         // Auto-focus next input
//                         if (index < 5) {
//                           const nextInput = document.getElementById(
//                             `otp-${index + 1}`
//                           );
//                           if (nextInput)
//                             (nextInput as HTMLInputElement).focus();
//                         }
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace" && !otp[index] && index > 0) {
//                         const prevInput = document.getElementById(
//                           `otp-${index - 1}`
//                         );
//                         if (prevInput) (prevInput as HTMLInputElement).focus();
//                       }
//                     }}
//                     id={`otp-${index}`}
//                   />
//                 ))}
//               </div>
//               <input
//                 type="hidden"
//                 value={otp}
//                 onChange={(e) =>
//                   setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                 }
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || otp.length !== 6}
//               className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-orange-500/25"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
//                   Verifying...
//                 </div>
//               ) : (
//                 "Verify and continue"
//               )}
//             </button>
//           </form>

//           {/* Demo Info */}
//           <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
//             <div className="flex items-start">
//               <svg
//                 className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <div>
//                 <p className="text-sm text-orange-800 font-medium">
//                   Check your terminal and Email as well for OTP
//                 </p>
//                 {/* <p className="text-xs text-orange-600 mt-1">
//                   The OTP code is displayed in your server terminal/console for
//                   demo purposes.
//                 </p> */}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center">
//           <button
//             onClick={() => router.push("/login")}
//             className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
//           >
//             ← Back to login
//           </button>
//           <p className="text-xs text-gray-500 mt-2">
//             Secure multi-factor authentication • Expires in 10 minutes
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function MFAVerify() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading verification...</p>
//           </div>
//         </div>
//       }
//     >
//       <MFAVerifyContent />
//     </Suspense>
//   );
// }

// "use client";

// import { useState, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// function MFAVerifyContent() {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const method = searchParams.get("method") || "email";
//   const phone = searchParams.get("phone");

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         console.log("✅ Login successful, storing user data...");
//         console.log("🌍 IP Address from server:", data.ipAddress);
//         console.log("📱 MFA Method used:", data.mfaMethod);

//         // Store user data in localStorage with IP address
//         localStorage.setItem("token", "authenticated");
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem(
//           "loginData",
//           JSON.stringify({
//             location: data.location,
//             ipAddress: data.ipAddress,
//             mfaMethod: data.mfaMethod,
//             timestamp: new Date().toISOString(),
//           })
//         );

//         console.log("💾 Stored in localStorage - IP:", data.ipAddress);
//         console.log("🔄 Redirecting to dashboard...");

//         // Redirect to dashboard
//         router.push("/dashboard");
//       } else {
//         setError(data.error || "Verification failed");
//       }
//     } catch (error) {
//       setError("Verification failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     if (!email) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, method }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert(`New OTP sent to your ${method}`);
//       } else {
//         setError(data.error || "Failed to resend OTP");
//       }
//     } catch (error) {
//       setError("Failed to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMethodDisplay = () => {
//     if (method === "email") {
//       return "email";
//     } else if (method === "phone" && phone) {
//       return `phone (${phone})`;
//     } else {
//       return "phone";
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
//             <svg
//               className="w-10 h-10 text-white"
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
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//             Verify your identity
//           </h1>
//           <p className="mt-2 text-gray-600">
//             We&apos;ve sent a code to your {getMethodDisplay()}
//           </p>
//           {email && (
//             <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
//           )}
//           {method === "phone" && phone && (
//             <p className="mt-1 text-sm text-green-600 font-medium">{phone}</p>
//           )}
//         </div>

//         {/* OTP Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <form onSubmit={handleVerify} className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 text-red-400 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-red-800 text-sm font-medium">
//                     {error}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div>
//               <label
//                 htmlFor="otp"
//                 className="block text-sm font-medium text-gray-700 mb-3 text-center"
//               >
//                 Enter verification code
//               </label>
//               <div className="flex justify-center space-x-3">
//                 {[0, 1, 2, 3, 4, 5].map((index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     maxLength={1}
//                     className="w-12 h-12 text-2xl text-center font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
//                     value={otp[index] || ""}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value) {
//                         const newOtp = otp.split("");
//                         newOtp[index] = value;
//                         setOtp(newOtp.join(""));

//                         // Auto-focus next input
//                         if (index < 5) {
//                           const nextInput = document.getElementById(
//                             `otp-${index + 1}`
//                           );
//                           if (nextInput)
//                             (nextInput as HTMLInputElement).focus();
//                         }
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace" && !otp[index] && index > 0) {
//                         const prevInput = document.getElementById(
//                           `otp-${index - 1}`
//                         );
//                         if (prevInput) (prevInput as HTMLInputElement).focus();
//                       }
//                     }}
//                     id={`otp-${index}`}
//                   />
//                 ))}
//               </div>
//               <input
//                 type="hidden"
//                 value={otp}
//                 onChange={(e) =>
//                   setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                 }
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || otp.length !== 6}
//               className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-orange-500/25"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
//                   Verifying...
//                 </div>
//               ) : (
//                 "Verify and continue"
//               )}
//             </button>

//             {/* Resend OTP Button */}
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={handleResendOTP}
//                 disabled={loading}
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
//               >
//                 Didn&apos;t receive code? Resend OTP
//               </button>
//             </div>
//           </form>

//           {/* Demo Info */}
//           <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
//             <div className="flex items-start">
//               <svg
//                 className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <div>
//                 <p className="text-sm text-orange-800 font-medium">
//                   Check your{" "}
//                   {method === "email" ? "email" : "phone and server terminal"}{" "}
//                   for OTP
//                 </p>
//                 <p className="text-xs text-orange-600 mt-1">
//                   {method === "email"
//                     ? "The OTP code is displayed in your server terminal/console for demo purposes."
//                     : "For SMS demo, the OTP is logged in the server console."}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-center">
//   <button
//     onClick={() => router.push(`/mfa-method?email=${encodeURIComponent(email||"")}`)} // Add email parameter
//     className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
//   >
//     ← Choose different method
//   </button>
//   <p className="text-xs text-gray-500 mt-2">
//     Secure multi-factor authentication • Expires in 10 minutes
//   </p>
// </div>
//       </div>
//     </div>
//   );
// }

// export default function MFAVerify() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading verification...</p>
//           </div>
//         </div>
//       }
//     >
//       <MFAVerifyContent />
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

//   // Debug on every render
//   console.log("🔄 MFA Method Page RENDER - Email:", email);

//   const handleMethodSelect = async (method: "email" | "phone") => {
//     if (!email) {
//       setError("Email not found");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       console.log(`📨 Sending ${method} OTP to:`, email);

//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, method }),
//       });

//       const data = await response.json();
//       console.log(`📦 Send OTP Response:`, data);

//       if (response.ok) {
//         console.log(`✅ ${method} OTP sent successfully!`);
//         console.log(`🔄 Redirecting to verify page...`);

//         // Force redirect to verify page
//         router.push(
//           `/mfa-verify?email=${encodeURIComponent(email)}&method=${method}`
//         );
//       } else {
//         console.log(`❌ Failed to send OTP:`, data.error);
//         setError(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.log(`❌ Network error:`, error);
//       setError("Failed to send OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // const handleMethodSelect = async (method: "email" | "phone") => {
//   //   if (!email) {
//   //     setError("Email not found");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const response = await fetch("/api/auth/send-otp", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ email, method }),
//   //     });

//   //     const data = await response.json();

//   //     if (response.ok) {
//   //       router.push(
//   //         `/mfa-verify?email=${encodeURIComponent(email)}&method=${method}`
//   //       );
//   //     } else {
//   //       setError(data.error || "Failed to send OTP");
//   //     }
//   //   } catch (error) {
//   //     setError("Failed to send OTP");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // SIMPLIFIED RENDER - Remove complex logic temporarily
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

//         {/* DEBUG: Force show buttons */}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
//           <p className="text-yellow-800 text-sm font-bold">
//             DEBUG: Buttons should appear below this message
//           </p>
//           <p className="text-yellow-700 text-xs">
//             Email: {email || "NOT FOUND"}
//           </p>
//         </div>

//         {/* Method Selection Cards - SIMPLIFIED */}
//         <div className="space-y-4">
//           {/* Email Option - SIMPLE VERSION */}
//           <div
//             onClick={() => handleMethodSelect("email")}
//             className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-blue-500 cursor-pointer hover:shadow-md transition-all duration-200"
//           >
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
//                 <svg
//                   className="w-6 h-6 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">Email OTP</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Send code to your email address
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Phone Option - SIMPLE VERSION */}
//           <div
//             onClick={() => handleMethodSelect("phone")}
//             className="w-full bg-white p-6 rounded-xl shadow-sm border-2 border-green-500 cursor-pointer hover:shadow-md transition-all duration-200"
//           >
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
//                 <svg
//                   className="w-6 h-6 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">SMS OTP</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Send code to your phone via SMS
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="mt-6 text-center">
//             <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
//               <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//               <span className="text-blue-700 text-sm font-medium">
//                 Sending code...
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Error Display */}
//         {error && (
//           <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 text-red-400 mr-2"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-red-800 text-sm font-medium">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <button
//             onClick={() => router.push("/")}
//             className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
//           >
//             ← Back to login
//           </button>
//         </div>

//         {/* <div className="mt-6 p-4 bg-gray-100 rounded-xl">
//   <p className="text-sm text-gray-600 mb-2">Debug SMS Test:</p>
//   <button
//     onClick={async () => {
//       const testPhone = "+16317465793"; // Replace with your actual phone
//       const testOTP = "123456";
//       console.log(`🧪 Testing SMS to: ${testPhone}`);
      
//       const { sendSMSOTP } = await import('@/lib/sms');
//       const result = await sendSMSOTP(testPhone, testOTP);
//       console.log('🧪 SMS Test Result:', result);
//     }}
//     className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm"
//   >
//     Test SMS Service
//   </button>
// </div> */}
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

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MFAVerifyContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const method = searchParams.get("method") || "email";

  console.log("🔍 MFA Verify Page - Email:", email, "Method:", method);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Login successful, storing user data...");
        
        // Store user data in localStorage
        localStorage.setItem("token", "authenticated");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem(
          "loginData",
          JSON.stringify({
            location: data.location,
            ipAddress: data.ipAddress,
            timestamp: new Date().toISOString(),
          })
        );

        console.log("🔄 Redirecting to dashboard...");
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Verification failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, method }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`New OTP sent to your ${method}`);
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg
              className="w-10 h-10 text-white"
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Verify your identity
          </h1>
          <p className="mt-2 text-gray-600">
            We&apos;ve sent a code to your {method === 'email' ? 'email' : 'phone'}
          </p>
          {email && (
            <p className="mt-1 text-sm text-blue-600 font-medium">{email}</p>
          )}
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
                  <span className="text-red-800 text-sm font-medium">
                    {error}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-3 text-center"
              >
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-2xl text-center font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value) {
                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        setOtp(newOtp.join(""));

                        // Auto-focus next input
                        if (index < 5) {
                          const nextInput = document.getElementById(
                            `otp-${index + 1}`
                          );
                          if (nextInput)
                            (nextInput as HTMLInputElement).focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        const prevInput = document.getElementById(
                          `otp-${index - 1}`
                        );
                        if (prevInput) (prevInput as HTMLInputElement).focus();
                      }
                    }}
                    id={`otp-${index}`}
                  />
                ))}
              </div>
              <input
                type="hidden"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-orange-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify and continue"
              )}
            </button>

            {/* Resend OTP Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Didn&apos;t receive code? Resend OTP
              </button>
            </div>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-orange-800 font-medium">
                  Check your {method === "email" ? "email" : "phone"} for OTP
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {method === "email" 
                    ? "The OTP code is also displayed in your server terminal for demo purposes."
                    : "For SMS demo, the OTP is logged in the server console."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/mfa-method?email=${encodeURIComponent(email || "")}`)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            ← Choose different method
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Secure multi-factor authentication • Expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MFAVerify() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verification...</p>
          </div>
        </div>
      }
    >
      <MFAVerifyContent />
    </Suspense>
  );
}