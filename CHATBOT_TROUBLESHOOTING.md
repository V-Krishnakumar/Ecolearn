# Chatbot Troubleshooting Guide

## Current Issue: "No Google API key found, using knowledge base"

### Quick Fix Steps:

1. **Get a Google API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Update the .env file:**
   - Open the `.env` file in your project root
   - Replace `your_google_api_key_here` with your actual API key
   - Save the file

3. **Restart the development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

### Alternative: Test with a temporary key

If you want to test the setup first, you can temporarily use any string as the API key to see if the environment variable is being loaded:

1. Open `.env` file
2. Change `VITE_GOOGLE_API_KEY=your_google_api_key_here` to `VITE_GOOGLE_API_KEY=test123`
3. Save and restart the server
4. Check the browser console - you should see debug information

### Debug Information

The chatbot now includes debug logging. Open your browser's developer console (F12) and look for:
- `🔍 Environment Debug:` - This shows if the API key is being loaded
- `🤖 Using Google Gemini API with key:` - This means the API key is working
- `No Google API key found, using knowledge base` - This means the API key is not set

### Common Issues:

1. **Environment variable not loaded:**
   - Make sure the `.env` file is in the project root (same level as `package.json`)
   - Make sure the variable name is exactly `VITE_GOOGLE_API_KEY`
   - Restart the development server after making changes

2. **API key format issues:**
   - Make sure there are no extra spaces or quotes around the API key
   - The API key should be on a single line

3. **Vite not picking up changes:**
   - Try deleting `node_modules/.vite` folder
   - Restart the development server

### File Structure Check:
```
eco-learn-main/
├── .env                    ← Should be here
├── package.json
├── vite.config.ts
├── src/
│   └── lib/
│       └── ai.ts          ← Contains the chatbot logic
└── ...
```

### Testing the Fix:

1. Open the chatbot in your browser
2. Ask any question
3. Check the browser console for debug messages
4. If you see "🤖 Using Google Gemini API with key:" then it's working!

### Still Having Issues?

If the problem persists, check:
1. Browser console for any error messages
2. Network tab for failed API requests
3. Make sure you're using a valid Google API key
4. Verify the `.env` file is in the correct location
