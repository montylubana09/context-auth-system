# 🔐 SecureAuth - Multi-Factor Authentication Dashboard

A modern, secure authentication system with real-time risk assessment and multi-factor authentication (MFA) built with Next.js, TypeScript, and MongoDB.


## 🚀 Live Demo

**Live Application:** https://context-auth-system.vercel.app/
**Create Account:** https://context-auth-system.vercel.app/register

## ✨ Features

### 🔐 Authentication & Security
- **Multi-Factor Authentication (MFA)** - SMS & Email OTP verification
- **Risk-Based Authentication** - Real-time security risk assessment
- **IP Geolocation** - Automatic location detection and analysis
- **Session Monitoring** - Active session tracking and management
- **NIST 800-63 AAL2 Compliant** - Industry-standard security practices

### 📊 Dashboard Features
- **Real-time Risk Assessment** - Dynamic security scoring
- **Security Overview** - Comprehensive security status
- **Login Activity Monitoring** - Recent authentication events
- **Device & Location Tracking** - Multi-dimensional security analysis
- **System Status** - Service health monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data & APIs   │
│                 │    │                 │    │                 │
│ • Next.js 14    │───▶│ • API Routes    │───▶│ • MongoDB Atlas │
│ • TypeScript    │    │ • Auth Services │    │ • IP Geolocation│
│ • Tailwind CSS  │    │ • MFA Engine    │    │ • SMS Service   │
│ • React Hooks   │    │ • Risk Engine   │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - Runtime environment
- **bcrypt** - Password encryption
- **JWT** - Session management

### Database & External Services
- **MongoDB Atlas** - Cloud database
- **IP Geolocation API** - Location detection
- **SMS Service** - OTP delivery (Twilio/AWS SNS)
- **Email Service** - OTP delivery (Resend/Nodemailer)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- SMS/Email service account (Twilio, Resend, etc.)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secureauth.git
   cd secureauth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SMS_SERVICE_KEY=your_sms_service_api_key
   EMAIL_SERVICE_KEY=your_email_service_api_key
   IP_GEOLOCATION_KEY=your_geolocation_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on git push

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=strong_production_secret
SMS_SERVICE_KEY=production_sms_key
EMAIL_SERVICE_KEY=production_email_key
IP_GEOLOCATION_KEY=production_geolocation_key
NEXTAUTH_SECRET=production_nextauth_secret
```

## 📱 Usage

### Authentication Flow
1. **Login** - Enter email and password
2. **MFA Selection** - Choose SMS or Email OTP
3. **OTP Verification** - Enter received code
4. **Dashboard Access** - View security dashboard with real-time monitoring

### User Roles
- **Standard Users** - Access to personal security dashboard
- **Administrators** - Full system access (future feature)

## 🔒 Security Features

### Authentication Security
- Multi-factor authentication (SMS/Email OTP)
- Password hashing with bcrypt
- JWT token-based sessions
- Automatic session timeout

### Risk Assessment
- Real-time IP reputation analysis
- Geographic location risk scoring
- Device fingerprinting
- Behavioral anomaly detection

### Data Protection
- Encrypted data transmission (TLS)
- Secure password storage
- Audit logging for all authentication events
- Regular security updates
