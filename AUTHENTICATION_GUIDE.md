# TransitOps Authentication & User Registration Guide

## 🔐 Overview

The authentication system has been updated to properly store user data in the database. Users can now sign up with their credentials, and all user information is persisted in Supabase.

## 📋 What Was Fixed

### Before (Issue):
- Login page existed but didn't store user data in database
- No sign-up functionality
- Users couldn't register new accounts
- User profiles weren't created in `user_profiles` table

### After (Solution):
- ✅ Proper user registration with database storage
- ✅ Sign-up page created with full validation
- ✅ User profiles stored in `user_profiles` table
- ✅ Role assignment during registration
- ✅ Error handling and success messages
- ✅ Automatic navigation between login/signup pages

---

## 🗄️ Database Schema

### Tables Used:

#### 1. `auth.users` (Supabase Auth)
- Managed by Supabase Authentication
- Stores email, encrypted password, and auth metadata
- Created automatically when user signs up

#### 2. `roles`
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
```
Pre-populated with:
- Fleet Manager
- Dispatcher
- Safety Officer
- Financial Analyst

#### 3. `user_profiles`
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 How It Works

### Sign Up Flow:

1. **User fills signup form**:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
   - Role Selection

2. **Frontend validation**:
   - All fields required
   - Password length check
   - Password match verification

3. **Backend processing** (`signUp` function):
   ```javascript
   // Step 1: Create auth user in Supabase
   supabase.auth.signUp({ email, password })
   
   // Step 2: Get role_id from roles table
   supabase.from("roles").select("id").eq("name", selectedRole)
   
   // Step 3: Create user profile
   supabase.from("user_profiles").insert({
     id: user.id,
     name: name,
     email: email,
     role_id: role_id
   })
   ```

4. **Success**:
   - User profile created in database
   - User automatically logged in
   - Redirected to dashboard with proper role

### Sign In Flow:

1. **User enters credentials**:
   - Email
   - Password
   - Role Selection (optional, can be overridden by database role)

2. **Authentication**:
   ```javascript
   // Step 1: Authenticate with Supabase
   supabase.auth.signInWithPassword({ email, password })
   
   // Step 2: Fetch user profile from database
   supabase.from("user_profiles")
     .select("*, roles(name)")
     .eq("id", user.id)
   
   // Step 3: Use role from database profile
   setUser({ ...profileData, role: userRole })
   ```

3. **Fallback**:
   - If Supabase not configured: Demo mode activated
   - If profile not found: Uses auth data with selected role

---

## 📝 Files Modified

### 1. `frontend/src/context/AppDataContext.jsx`
**Changes**:
- Added `signUp()` function
- Updated `signIn()` to fetch user profile from database
- Added proper error handling
- User role now comes from database

**New Functions**:
```javascript
signUp(name, email, password, selectedRole)
// Creates auth user + user profile in database

signIn(selectedRole, email, password)  
// Updated to fetch profile from database
```

### 2. `frontend/src/pages/Login.jsx`
**Changes**:
- Added error handling for failed login
- Added link to Sign Up page
- Better error messages

### 3. `frontend/src/pages/SignUp.jsx` (NEW)
**Features**:
- Full name input
- Email validation
- Password confirmation
- Role selection
- Error and success messages
- Auto-redirect to login after signup

### 4. `frontend/src/App.jsx`
**Changes**:
- Added `/signup` route
- Imported SignUp component

---

## 🧪 Testing the Authentication

### Test Sign Up:

1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@transitops.io
   - **Password**: test123
   - **Confirm**: test123
   - **Role**: Fleet Manager
3. Click "Create Account"
4. Verify success message appears
5. Check database:
   ```sql
   SELECT * FROM user_profiles WHERE email = 'john@transitops.io';
   ```

### Test Sign In:

1. Navigate to `http://localhost:5173/login`
2. Enter registered credentials
3. Select role (will be overridden by database role)
4. Click "Sign In"
5. Verify redirect to dashboard
6. Check sidebar shows correct user info

### Test Database Storage:

**Check Auth User**:
```sql
SELECT * FROM auth.users WHERE email = 'john@transitops.io';
```

**Check User Profile**:
```sql
SELECT 
  up.id,
  up.name,
  up.email,
  r.name as role,
  up.created_at
FROM user_profiles up
JOIN roles r ON up.role_id = r.id
WHERE up.email = 'john@transitops.io';
```

---

## 🔧 Configuration

### Supabase Setup:

1. **Enable Email Auth** in Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)

2. **Row Level Security (RLS)**:
   ```sql
   -- Allow users to read their own profile
   CREATE POLICY "Users can view own profile" ON user_profiles
   FOR SELECT USING (auth.uid() = id);
   
   -- Allow users to update their own profile
   CREATE POLICY "Users can update own profile" ON user_profiles
   FOR UPDATE USING (auth.uid() = id);
   ```

3. **Environment Variables**:
   Ensure `.env.local` has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

## 🛡️ Security Features

1. **Password Requirements**:
   - Minimum 6 characters
   - Password confirmation required

2. **Email Validation**:
   - Valid email format required
   - Unique email constraint in database

3. **SQL Injection Prevention**:
   - Supabase client handles parameterized queries
   - No raw SQL from user input

4. **Authentication State**:
   - JWT tokens managed by Supabase
   - Automatic session persistence
   - Secure token storage

---

## 🐛 Troubleshooting

### Issue: "User profile not created"
**Solution**: 
- Check if email is unique in database
- Verify roles table has all 4 roles
- Check Supabase logs for errors

### Issue: "Login fails but user exists"
**Solution**:
- Verify email confirmation (if enabled in Supabase)
- Check password is correct
- Look at browser console for errors

### Issue: "Role not showing correctly"
**Solution**:
- Check user_profiles table has role_id
- Verify roles table has correct entries
- Clear browser cache and re-login

### Issue: "Demo mode activated automatically"
**Solution**:
- Check Supabase credentials in `.env.local`
- Verify Supabase project is running
- Check network tab for API errors

---

## 📊 Success Criteria

### ✅ Sign Up Working:
- [ ] Form validates all fields
- [ ] Password confirmation works
- [ ] User created in `auth.users`
- [ ] Profile created in `user_profiles`
- [ ] Success message displayed
- [ ] Auto-redirects to login

### ✅ Sign In Working:
- [ ] Authentication successful
- [ ] User profile fetched from database
- [ ] Role assigned correctly
- [ ] Redirects to dashboard
- [ ] User info shows in sidebar
- [ ] RBAC permissions applied

### ✅ Database Storage:
- [ ] User data persists after logout
- [ ] Role stored in database
- [ ] Email unique constraint enforced
- [ ] Cascade delete works (user → profile)

---

## 🎯 Next Steps (Optional Enhancements)

1. **Email Verification**:
   - Enable in Supabase
   - Add verification email template
   - Show "verify email" message

2. **Password Reset**:
   - Add "Forgot Password" functionality
   - Use Supabase password reset flow
   - Email reset link to user

3. **Profile Management**:
   - Add "Edit Profile" page
   - Allow users to update name
   - Change password functionality

4. **Admin Panel**:
   - Fleet Manager can add users
   - Assign roles to existing users
   - View all registered users

---

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Router Documentation](https://reactrouter.com/)
- [TransitOps Database Schema](./backend/supabase_schema.sql)

---

## ✨ Summary

The authentication system now properly:
- ✅ Stores user data in database
- ✅ Supports user registration
- ✅ Links roles to users
- ✅ Persists across sessions
- ✅ Provides error feedback
- ✅ Handles edge cases

All user credentials and profiles are now saved in the Supabase database! 🎉
