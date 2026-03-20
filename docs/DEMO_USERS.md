# Demo Users Setup

This document explains how to set up demo users for the Insurance Claims application.

## Demo Accounts

Two demo accounts are available for testing:

### Demo User (Regular User)

- **Email**: `user@autoclaim.ai`
- **Password**: `user123`
- **Role**: user
- **Access**: Can create and manage their own claims

### Demo Admin (Administrator)

- **Email**: `admin@autoclaim.ai`
- **Password**: `admin123`
- **Role**: admin
- **Access**: Full access to review all claims, manage users, view analytics

## Setting Up Demo Users

### First Time Setup

When you first run the application, the demo users need to be created in the database. Run the following command:

```bash
cd backend
npm run seed:demo
```

This will create both demo accounts if they don't already exist.

### Verifying Demo Users

The seed script will output:

- ✅ if a demo user was created successfully
- ℹ️ if the demo user already exists

Example output:

```
Connected to MongoDB
✅ Demo user created: user@autoclaim.ai / user123
✅ Demo admin created: admin@autoclaim.ai / admin123
🎉 Demo users seeding completed!
```

## Using Demo Accounts

### From the Login Page

1. Navigate to `/login` in your web application
2. Click on either:
   - **👤 Demo User** button - Quick login as regular user
   - **🛡️ Demo Admin** button - Quick login as administrator
3. You will be automatically logged in and redirected to the appropriate dashboard

### Manual Login

You can also manually enter the credentials in the login form:

- Enter the email and password from above
- Click "Sign In"

## Troubleshooting

### Demo Login Not Working

If the demo login buttons return to the login page or show errors:

1. **Check if backend is running**:

   ```bash
   curl http://localhost:5001/api/v1/health
   ```

   Should return: `{"status":"ok"}`

2. **Verify demo users exist**:

   ```bash
   cd backend
   npm run seed:demo
   ```

3. **Check database connection**:
   - Ensure MongoDB is running
   - Verify the `MONGODB_URI` in `backend/.env` is correct

4. **Restart the backend**:
   ```bash
   cd backend
   npm run dev
   ```

### Password Issues

If you need to reset the demo user passwords:

1. Delete the existing demo users from MongoDB
2. Run the seed script again:
   ```bash
   npm run seed:demo
   ```

## Notes

- Demo users are automatically created with hashed passwords using bcrypt (12 salt rounds)
- The seed script is idempotent - it won't create duplicates if the users already exist
- Demo accounts are meant for demonstration purposes only
- In production, you should remove or secure these accounts
