# 🧪 Forgot Password Feature - Testing & Verification Guide

## Quick Verification Checklist

Use this guide to verify that all components of the Forgot Password feature are working correctly.

---

## ✅ Pre-Flight Checks

### 1. Backend Files Verification

**Check User Model:**
```bash
grep -n "resetOtp\|resetOtpExpiry\|resetAttempts\|lastOtpSentAt" Server/models/user.js
```
Should show all 4 fields defined ✓

**Check Auth Controller:**
```bash
grep -n "forgotPassword\|verifyResetOtp\|resetPassword" Server/controllers/authController.js
```
Should show all 3 functions exported ✓

**Check Auth Routes:**
```bash
grep -n "forgot-password\|verify-reset-otp\|reset-password" Server/routes/authRoutes.js
```
Should show all 3 routes defined ✓

**Check Mailer:**
```bash
grep -n "sendResetOtpEmail" Server/config/mailer.js
```
Should show the function exported ✓

**Check Environment:**
```bash
grep -n "EMAIL_USER\|EMAIL_PASS" Server/.env
```
Should show email credentials (configured) ✓

---

### 2. Frontend Files Verification

**Check Components Exist:**
```bash
ls -la client/src/components/Forgot/
```
Should show: EmailStep.js, OtpStep.js, ResetStep.js ✓

**Check Routes:**
```bash
grep -n "forgot-password" client/src/App.js
```
Should show route defined ✓

**Check Auth Link:**
```bash
grep -n "Forgot Password\|/forgot-password" client/src/Pages/Auth.js
```
Should show link in login page ✓

---

## 🧪 Testing the Feature

### Step 1: Start Backend
```bash
cd Server
npm install  # If needed
npm run dev  # or npm start
```
Server should run on `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd client
npm install  # If needed
npm start
```
Frontend should run on `http://localhost:3000`

### Step 3: Test Forgot Password Flow

#### Test Case 1: Valid Email Flow ✅
```
1. Navigate to http://localhost:3000 (Login page)
2. Click "🔑 Forgot Password?" link
3. Enter a valid registered email address
4. Click "📧 Send OTP"
Expected: Success message, proceed to Step 2
```

#### Test Case 2: Email Validation ✅
```
1. On Forgot Password page
2. Try entering invalid email (no @, no domain, etc.)
3. Click "Send OTP"
Expected: Error message "Please enter a valid email address"
```

#### Test Case 3: Rate Limiting ✅
```
1. Enter email and click "Send OTP"
2. Immediately click "Send OTP" again
3. Try within 60 seconds again
Expected: Error message "Please wait X seconds before requesting another OTP"
```

#### Test Case 4: OTP Verification ✅
```
1. After receiving OTP, enter wrong code (e.g., 000000)
2. Click "Verify OTP"
Expected: Error message "Invalid OTP. 2 attempts remaining."
3. Try 3 times with wrong codes
Expected: Error message "Too many failed attempts. Please request a new OTP."
```

#### Test Case 5: OTP Expiry ✅
```
1. Request OTP
2. Wait 10+ minutes (or modify test time)
3. Enter correct OTP
4. Click "Verify OTP"
Expected: Error message "OTP has expired. Please request a new one."
```

#### Test Case 6: Password Validation ✅
```
1. Reach Step 3 (Reset Password)
2. Enter weak password (e.g., "password")
3. Try to submit
Expected: Error message "Password must contain uppercase, lowercase, and number"
4. Try mismatch confirmation
Expected: Error message "Passwords do not match"
5. Enter valid password (e.g., "SecurePass123")
Expected: Success, redirect to login
```

#### Test Case 7: Complete Successful Flow ✅
```
1. Registered email: test@example.com
2. Click Forgot Password
3. Enter test@example.com
4. Check email for OTP
5. Enter OTP correctly
6. Enter new password: NewPass123
7. Confirm password: NewPass123
8. Click "Reset Password"
Expected: Success message
9. Go back to login
10. Login with test@example.com and NewPass123
Expected: Login successful
```

---

## 🔍 Database Verification

### Check User Document After Password Reset
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use your_db_name

# Find the user document
db.users.findOne({ email: "test@example.com" })

# Should show:
# {
#   email: "test@example.com",
#   resetOtp: null,           // Cleared after success
#   resetOtpExpiry: null,     // Cleared after success
#   resetAttempts: 0,         // Reset
#   lastOtpSentAt: null,      // Cleared after success
#   password: "$2b$10..."     // New hashed password
# }
```

---

## 📊 API Testing with Curl/Postman

### Test 1: Request OTP
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected Response (200):
# {"message":"If this email exists, an OTP has been sent"}
```

### Test 2: Verify OTP (will fail first time)
```bash
curl -X POST http://localhost:5000/api/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"000000"}'

# Expected Response (400):
# {"message":"Invalid OTP. 2 attempts remaining."}
```

### Test 3: Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "otp":"123456",
    "newPassword":"NewPass123",
    "confirmPassword":"NewPass123"
  }'

# Expected Response (200):
# {"message":"Password reset successfully. Please login with your new password."}
```

---

## 🐛 Debugging Tips

### Browser Console Errors
```javascript
// If you see API errors in console:
1. Check that backend is running (localhost:5000)
2. Check that email credentials are set in .env
3. Look at Network tab for response details
4. Check browser console for any JS errors
```

### Backend Logs
```bash
# Watch backend logs for issues:
npm run dev  # Will show logs in terminal

# Look for:
- "Error sending OTP" - Email configuration issue
- "Invalid OTP" - OTP comparison issue
- "Server error" - Unexpected backend error
```

### Email Delivery
```
If OTP email not received:
1. Check spam/promotions folder
2. Verify EMAIL_USER is correct gmail
3. Verify EMAIL_PASS is App Password (not Gmail password)
4. Check Gmail has 2-step verification enabled
5. Check SMTP settings in mailer.js
```

---

## ✨ Expected UI Behaviors

### Email Step
- [ ] Email input field visible
- [ ] "Send OTP" button works
- [ ] Loading state shows spinner while sending
- [ ] Error message displays below input if invalid
- [ ] Field clears error on new input

### OTP Step
- [ ] OTP input shows 6 digits maximum
- [ ] Numbers-only input (no letters/symbols)
- [ ] Countdown timer shows (10:00 initially)
- [ ] Timer decreases every second
- [ ] "Verify OTP" button disabled during verification
- [ ] Error message shows with attempt counter
- [ ] "Resend OTP" button disabled while timer > 0
- [ ] "Resend OTP" clickable after timer ends

### Password Reset Step
- [ ] Password input shows requirements checklist
- [ ] Strength indicator changes color based on strength
- [ ] Confirm password field visible
- [ ] "Match" indicator shows when passwords match
- [ ] Show/hide toggles work for both fields
- [ ] "Reset Password" button disabled if fields empty
- [ ] Error message displays for weak passwords

### Overall
- [ ] Progress bar shows step 1/2/3
- [ ] Back button works between steps
- [ ] "Login here" link goes to login page
- [ ] Mobile responsive (test on narrow screen)
- [ ] No console errors
- [ ] Animations smooth and not jittery

---

## 📋 Regression Testing

### Existing Features Not Broken
```
1. Login page still works
2. Register page still works
3. Admin login still works
4. Login -> Dashboard flow works
5. Logout works
6. All other features unchanged
```

---

## ✅ Final Verification Checklist

### Backend
- [ ] User model has all 5 reset fields
- [ ] authController exports 3 functions
- [ ] authRoutes has 3 new routes
- [ ] mailer.js has sendResetOtpEmail
- [ ] .env has EMAIL_USER and EMAIL_PASS configured
- [ ] No console errors when starting

### Frontend  
- [ ] All 3 Forgot components exist
- [ ] ForgotPassword page loads
- [ ] Auth page has Forgot link
- [ ] App.js has /forgot-password route
- [ ] No console errors

### Security
- [ ] OTP sent to real email works
- [ ] Rate limiting (60 sec) enforced
- [ ] 3-attempt limit working
- [ ] 10-minute OTP expiry enforced
- [ ] Generic error messages shown
- [ ] Password hash stored (not plain)

### User Experience
- [ ] All 3 steps work correctly
- [ ] Error messages helpful
- [ ] Loading states visible
- [ ] Mobile responsive
- [ ] Back button works
- [ ] Can complete full flow

---

## 🚀 Production Deployment Verification

```bash
# Before going live, verify:
1. [ ] All environment variables set correctly
2. [ ] Email service tested and working
3. [ ] Database migrations completed
4. [ ] All tests passing
5. [ ] No console errors in browser
6. [ ] No errors in backend logs
7. [ ] HTTPS enabled (for production)
8. [ ] Rate limiting appropriate
9. [ ] Error logging configured
10. [ ] Monitoring/alerts set up
```

---

## 📞 Troubleshooting

### Issue: Email not sending
**Solution**: Check EMAIL_USER and EMAIL_PASS in .env
```bash
grep EMAIL_ Server/.env
# Should not be empty
```

### Issue: OTP always shows as invalid
**Solution**: Check OTP comparison in controller
```javascript
// Verify bcrypt comparison is working:
const bcrypt = require('bcryptjs');
const otp = "123456";
const hashed = bcrypt.hashSync(otp, 10);
console.log(bcrypt.compareSync(otp, hashed)); // Should be true
```

### Issue: Frontend not calling backend
**Solution**: Check axios baseURL
```javascript
// In ForgotPassword.js, verify:
const API_BASE = "http://localhost:5000/api/auth";
// Should match your backend URL
```

### Issue: CORS errors
**Solution**: Check CORS configured in server.js
```bash
grep -n "cors\|CORS" Server/server.js
# Should have CORS middleware
```

---

## 📞 Support

If you encounter any issues:
1. Check this verification guide
2. Review [FORGOT_PASSWORD_IMPLEMENTATION.md](./FORGOT_PASSWORD_IMPLEMENTATION.md)
3. Check browser console for errors
4. Check backend terminal logs
5. Verify email credentials
6. Test individual API endpoints with Postman

---

**Last Updated**: April 20, 2026
**Status**: Ready for Testing ✅
