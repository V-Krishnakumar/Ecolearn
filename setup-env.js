#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🤖 EcoLearn Chatbot Setup');
console.log('========================\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_GOOGLE_API_KEY=') && !envContent.includes('your_google_api_key_here')) {
    console.log('✅ Google API key appears to be configured');
    console.log('🚀 You can now restart your development server');
    process.exit(0);
  }
}

// Create .env file
const envContent = `# Google API Key for Chatbot AI functionality
# Get your API key from: https://aistudio.google.com/app/apikey
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Instructions:
# 1. Go to https://aistudio.google.com/app/apikey
# 2. Sign in with your Google account
# 3. Click "Create API Key"
# 4. Copy the generated API key
# 5. Replace "your_google_api_key_here" with your actual API key
# 6. Save this file
# 7. Restart your development server
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('\n📋 Next steps:');
  console.log('1. Get your Google API key from: https://aistudio.google.com/app/apikey');
  console.log('2. Open the .env file in your project root');
  console.log('3. Replace "your_google_api_key_here" with your actual API key');
  console.log('4. Save the file');
  console.log('5. Restart your development server (npm run dev)');
  console.log('\n🎉 Your chatbot will then use Google AI instead of the knowledge base!');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please manually create a .env file with:');
  console.log('VITE_GOOGLE_API_KEY=your_google_api_key_here');
}
