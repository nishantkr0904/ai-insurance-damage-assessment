# Demo Admin Setup & Troubleshooting

## Demo Admin Account

**Credentials:**

- Email: `admin@autoclaim.ai`
- Password: `admin123`
- Role: `admin`

## Features Available to Demo Admin

### Dashboard (`/admin`)

- View total claims statistics
- See approved, rejected, and pending claims
- Monitor fraud detection metrics
- Average processing time
- Charts:
  - Claims over time (bar chart)
  - Damage type distribution (pie chart)
  - Fraud risk levels

### Claims Management (`/admin/claims`)

- View all submitted claims
- Filter by status
- Review claim details
- Approve or reject claims with notes

### Analytics (`/admin/analytics`)

- Detailed claim statistics
- Processing metrics
- Cost estimates
- Fraud analysis

### User Management (`/admin/users`)

- View all registered users
- See user statistics

### Fraud Alerts (`/admin/fraud`)

- High-risk claim detection
- Suspicious pattern analysis

### Activity Logs (`/admin/logs`)

- System audit trail
- Admin actions history

### Settings (`/admin/settings`)

- System configuration
- Admin preferences

## API Endpoints

All admin endpoints require authentication with admin role:

```bash
Authorization: Bearer <admin_token>
```

### Available Endpoints:

1. **GET /api/v1/admin/claims**
   - Returns: `{ success: true, data: { claims: [...] } }`
   - Get all claims with optional status filter

2. **GET /api/v1/admin/claims/:claimId**
   - Returns: `{ success: true, data: { claim: {...} } }`
   - Get specific claim details

3. **PATCH /api/v1/admin/claims/:claimId/approve**
   - Body: `{ adminNotes?: string }`
   - Approve a claim

4. **PATCH /api/v1/admin/claims/:claimId/reject**
   - Body: `{ adminNotes?: string }`
   - Reject a claim

5. **GET /api/v1/admin/analytics**
   - Returns comprehensive analytics data:
     - totalClaims, approvedClaims, rejectedClaims, pendingClaims
     - fraudDetected, avgProcessingTime
     - claimsOverTime (array for charts)
     - damageTypeDistribution (array for charts)
     - fraudRiskDistribution (array for charts)

## Recent Fixes Applied

### Issue 1: Missing Analytics Fields

**Problem:** Frontend expected fields that backend didn't provide
**Fix:** Added to analyticsService.ts:

- `fraudDetected` field
- `avgProcessingTime` field
- `claimsOverTime` array for bar chart
- `damageTypeDistribution` array for pie chart
- `fraudRiskDistribution` array for risk analysis

### Issue 2: Wrong API Response Format

**Problem:** Backend returned array directly, frontend expected wrapped object
**Fix:** Updated adminController.ts:

- `getAllClaims` now returns `{ claims: [...] }`
- `getClaimById` now returns `{ claim: {...} }`

## Testing Admin Features

### Using curl:

```bash
# 1. Login as admin
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@autoclaim.ai","password":"admin123"}'

# 2. Get analytics (use token from login response)
curl http://localhost:5001/api/v1/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Get all claims
curl http://localhost:5001/api/v1/admin/claims \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### From Browser:

1. Navigate to http://localhost:5173/login
2. Click "🛡️ Demo Admin" button
3. You'll be redirected to `/admin` dashboard
4. All analytics and charts should load without errors

## Troubleshooting

### Dashboard Not Loading

1. Check backend is running: `curl http://localhost:5001/api/v1/health`
2. Check browser console for errors (F12)
3. Verify you're logged in as admin (check role in localStorage)

### Charts Not Showing Data

- This is expected if there are no claims in the system
- The analytics service provides mock data for visualization
- Create some test claims as a regular user to see real data

### 401 Unauthorized Errors

- Token may have expired (7 days by default)
- Log out and log back in
- Check if demo admin account exists: `npm run seed:demo` in backend

### API Errors

- Ensure backend is running on port 5001
- Check backend logs for detailed error messages
- Verify MongoDB connection is active

## Next Steps

To populate the admin dashboard with real data:

1. Login as Demo User (`user@autoclaim.ai` / `user123`)
2. Create several test claims with different statuses
3. Upload vehicle damage images
4. Return to admin dashboard to see statistics update

Once real claims exist, the analytics service can be enhanced to:

- Calculate actual processing times
- Show real damage type distributions
- Display genuine fraud risk analysis
- Plot actual claims over time
