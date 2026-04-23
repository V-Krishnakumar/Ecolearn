#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌱 EcoLearn Setup Script');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Google Gemini API Key
# Get your free API key from: https://makersuite.google.com/app/apikey
VITE_GOOGLE_API_KEY=your_google_api_key_here
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Get your free Google API key from: https://makersuite.google.com/app/apikey');
console.log('2. Replace "your_google_api_key_here" in the .env file with your actual API key');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. Open http://localhost:5173 in your browser');
console.log('\n🎉 Happy learning!');
