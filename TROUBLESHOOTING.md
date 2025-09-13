# Troubleshooting Guide

## API Key Not Working Issues

### Problem: Chatbot not responding or API key not found

### Solutions:

#### 1. **Check .env file exists and has correct content**
```bash
# Make sure you're in the project root directory
ls -la .env

# Check the content
cat .env
```

The `.env` file should contain:
```
VITE_GOOGLE_API_KEY=AIzaSyAi5YrHJkT9Cvl1Myh0tsKdWDthMFhtuYg
```

#### 2. **Copy .env.example to .env (if missing)**
```bash
cp .env.example .env
```

#### 3. **Restart the development server**
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

#### 4. **Clear browser cache**
- Open browser developer tools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"
- Or use Ctrl+Shift+R

#### 5. **Check browser console for errors**
- Open browser developer tools (F12)
- Go to Console tab
- Look for any error messages related to API calls

#### 6. **Verify API key format**
The API key should:
- Start with `AIzaSy`
- Be exactly 39 characters long
- Have no spaces or extra characters

#### 7. **Test API key manually**
Visit: https://makersuite.google.com/app/apikey
- Sign in with Google account
- Check if the API key is active
- Verify it has Gemini API access

### Common Issues:

#### Issue 1: "API key not found"
**Solution**: Make sure `.env` file exists and contains the API key

#### Issue 2: "Invalid API key"
**Solution**: Verify the API key is correct and active

#### Issue 3: "CORS error"
**Solution**: This is normal for development - the API should still work

#### Issue 4: "Rate limit exceeded"
**Solution**: Wait a few minutes and try again

### For Team Members:

#### Step-by-Step Setup:
1. **Clone repository**: `git clone https://github.com/Amrithkumar2005/eco-learn.git`
2. **Navigate to project**: `cd eco-learn`
3. **Copy environment file**: `cp .env.example .env`
4. **Install dependencies**: `npm install`
5. **Start development server**: `npm run dev`
6. **Open browser**: Go to `http://localhost:8080`
7. **Test chatbot**: Try asking a question in the chatbot

#### If chatbot still doesn't work:
1. Check browser console for errors
2. Verify `.env` file has the API key
3. Restart the development server
4. Clear browser cache

### Contact:
If issues persist, contact the team lead with:
- Screenshot of browser console errors
- Contents of `.env` file (first 10 characters only for security)
- Steps you've already tried
