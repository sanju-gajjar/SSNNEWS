# RENDER.COM DEPLOYMENT CHECKLIST

## Environment Variables to Set in Render Dashboard:

### Server Environment Variables:
- `NODE_ENV=production`
- `JWT_SECRET=your-super-secure-jwt-secret-key-here`
- `MONGODB_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"`
- `NEWS_API_KEY=your-news-api-key`
- `PORT=8080` (or let Render set this automatically)

### Client Environment Variables:
- `REACT_APP_API_URL=https://your-server-name.onrender.com`

## Common Issues & Solutions:

### 1. CORS Errors
- ✅ Updated server CORS to allow render.com domains
- ✅ Added flexible origin checking

### 2. API URL Mismatch
- ✅ Created .env.production file
- ✅ Added smart API URL detection

### 3. Network Timeouts
- ✅ Added 10-second timeout to axios
- ✅ Better error handling and logging

### 4. Build Process
Make sure your Render build command is:
```
npm install && npm run build
```

And start command is:
```
npm start
```

## Debugging Steps:

1. **Check Render Logs**: Look for CORS errors or failed requests
2. **Verify Environment Variables**: Ensure all required vars are set
3. **Test API Endpoints**: Use Postman or curl to test server endpoints
4. **Check Network Tab**: In browser dev tools, see actual request URLs
5. **Monitor Console**: Look for detailed error messages we added

## URLs to Update:

Replace these in your Render environment:
- `REACT_APP_API_URL=https://swadeshsandeshnews.com`
- Update CORS origins to match your actual Render URLs