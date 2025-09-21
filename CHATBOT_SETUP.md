# Chatbot Setup Guide

## Issue
Your chatbot is showing "No Google API key found, using knowledge base" because the Google API key is not configured.

## Solution

### Step 1: Get a Google API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Create Environment File
Create a file named `.env` in your project root directory with the following content:

```env
# Google API Key for Chatbot AI functionality
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### Step 3: Restart Development Server
After creating the `.env` file:
1. Stop your development server (Ctrl+C)
2. Run `npm run dev` or `yarn dev` again
3. The chatbot should now use Google's AI instead of the knowledge base

## Alternative: Use Knowledge Base Only
If you prefer not to use Google's API, the chatbot will work with the built-in knowledge base, but responses will be more limited and less conversational.

## File Structure
Make sure your `.env` file is in the same directory as your `package.json` file:
```
eco-learn-main/
├── .env                 ← Create this file
├── package.json
├── src/
└── ...
```

## Troubleshooting
- Make sure the `.env` file is in the root directory
- Ensure the API key is correct and active
- Check that the environment variable name is exactly `VITE_GOOGLE_API_KEY`
- Restart the development server after making changes
