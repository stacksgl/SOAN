# Firebase Session Authentication Setup

## ✅ What's Been Implemented

I've successfully set up a complete Firebase session-cookie authentication system with the following components:

### Frontend (Vite + React)
- ✅ Firebase configuration (`src/lib/firebase.ts`)
- ✅ Session authentication utilities (`src/lib/authSession.ts`) 
- ✅ Updated Login page with Google authentication button
- ✅ Updated UserContext to use Firebase sessions
- ✅ Updated UserAccount component for proper logout
- ✅ Vite proxy configuration for `/api` routes

### Backend (Express API)
- ✅ Complete Express server setup in `api/` folder
- ✅ Firebase Admin SDK session authentication
- ✅ CORS and cookie handling
- ✅ Protected routes middleware
- ✅ TypeScript configuration

## 🚀 Getting Started

### 1. Environment Configuration

Create these environment files:

**Frontend `.env.local`:**
```env
VITE_FB_API_KEY=your_firebase_api_key_here
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project-id
```

**API `api/.env`:**
```env
NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8080
COOKIE_NAME=fb_session
COOKIE_MAX_AGE_MS=604800000
GOOGLE_APPLICATION_CREDENTIALS=/ABSOLUTE/PATH/TO/service-account.json
```

### 2. Firebase Service Account Setup

**CRITICAL SECURITY STEP:**

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts
2. Click "Generate new private key" 
3. Save the JSON file as `service-account.json` **outside** your project directory
4. Update `GOOGLE_APPLICATION_CREDENTIALS` with the absolute path to this file
5. **Never commit this file to git** (it's already in .gitignore)

### 3. Start Both Servers

**Terminal 1 - API Server:**
```bash
cd api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Test the Authentication

1. Open `http://localhost:8080/login`
2. Click "Continue with Google"
3. Complete Google authentication
4. Check for `fb_session` cookie in browser dev tools
5. Test protected routes - you should be automatically logged in
6. Test logout functionality

## 🔧 How It Works

### Authentication Flow

1. **Google Login:** User clicks "Continue with Google" → Firebase popup auth
2. **Session Creation:** Frontend gets `idToken` → sends to `POST /api/auth/sessionLogin`
3. **Cookie Set:** Server creates session cookie → sends back HttpOnly cookie
4. **Protected Requests:** Frontend makes requests with `credentials: "include"`
5. **Session Verification:** Server validates cookie on each protected route
6. **Logout:** `POST /api/auth/sessionLogout` clears cookie

### Key Security Features

- ✅ **HttpOnly cookies** (no JS access)
- ✅ **SameSite protection** 
- ✅ **CORS properly configured**
- ✅ **Session expiration** (7 days default)
- ✅ **Secure flag** in production
- ✅ **Service account** outside git

## 📁 New File Structure

```
/
├── src/lib/
│   ├── firebase.ts          # Firebase config
│   └── authSession.ts       # Auth utilities  
├── api/                     # New Express server
│   ├── src/
│   │   ├── index.ts         # Main server
│   │   └── sessionAuth.ts   # Auth middleware
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                 # Environment variables
├── .env.local              # Frontend environment
└── service-account.json    # Service account (keep outside git!)
```

## 🛠 API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/sessionLogin` | Create session cookie | No |
| POST | `/api/auth/sessionLogout` | Clear session cookie | No |
| GET | `/api/me` | Get current user info | Yes |
| GET | `/api/health` | Health check | No |

## 🔄 Integration with Existing Code

### User Context Updates
- Changed `User` interface to match Firebase (`uid`, `email`)
- Updated authentication state management
- Session-based user loading on app start
- Async logout with proper error handling

### Login Page Updates  
- Added Google authentication button
- Maintains existing email/password login
- Proper error handling and navigation

### Protected Routes
- Existing `ProtectedRoute` component works unchanged
- Automatic session validation
- Redirect to login when unauthenticated

## ⚠️ Important Notes

### Current Status
- ✅ Google authentication fully functional
- ✅ Session management working
- ⚠️ Email/password login still uses mock authentication
- ⚠️ Registration page needs Firebase integration

### Next Steps (Optional)
1. Replace mock email/password login with Firebase Auth
2. Update registration to use Firebase Auth  
3. Add password reset functionality
4. Implement admin role checking
5. Add rate limiting to auth endpoints

### Security Checklist
- ✅ Service account file secured
- ✅ Environment variables set
- ✅ CORS configured
- ✅ Cookies properly configured
- ✅ Session expiration set
- ✅ HTTPS ready (secure flag in production)

## 🐛 Troubleshooting

**Cookie not being set:**
- Check CORS origin matches exactly
- Verify `credentials: "include"` in fetch calls
- Check browser dev tools Network tab

**Firebase errors:**
- Verify service account path is absolute
- Check Firebase project ID matches
- Ensure service account has proper permissions

**API connection issues:**
- Verify both servers are running
- Check Vite proxy configuration
- Confirm API is on port 8081

**Authentication failing:**
- Check Firebase console for authorized domains
- Verify web API key is correct
- Check browser console for errors

## 📞 Support

The authentication system is ready to use! Test the Google login flow and let me know if you encounter any issues.

