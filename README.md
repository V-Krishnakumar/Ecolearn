# EcoLearn - Environmental Education Platform

An interactive environmental education platform with AI-powered chatbot, lessons, quizzes, and games.

## Features

- 🌱 **Interactive Lessons**: Waste management, water treatment, pollution control, and more
- 🤖 **AI Chatbot**: Powered by Google Gemini for environmental Q&A
- 🎮 **Educational Games**: Drag-and-drop games for each lesson topic
- 📊 **Progress Tracking**: Track your learning progress and scores
- 🌍 **Multilingual Support**: Available in multiple languages
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd eco-learn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
# Google Gemini API Key (Required for AI Chatbot)
# Get your free API key from: https://makersuite.google.com/app/apikey
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Get Your Google API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Replace `your_google_api_key_here` in your `.env` file

### 5. Run the Development Server
```bash
npm run dev
```

### 6. Open in Browser
Navigate to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── games/          # Educational games
│   └── ui/             # UI component library
├── pages/              # Main application pages
├── lib/                # Utilities and configurations
│   ├── ai.ts          # AI chatbot logic
│   └── supabase.ts    # Database configuration
└── contexts/           # React contexts (language, etc.)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Supabase** - Backend and authentication
- **Google Gemini AI** - Chatbot intelligence
- **React Router** - Navigation
- **Radix UI** - Accessible components

## Troubleshooting

### Chatbot Not Working?
1. Make sure you have a valid Google API key in your `.env` file
2. Check the browser console for any error messages
3. Ensure the API key starts with `AIzaSy`

### Environment Variables Not Loading?
1. Make sure your `.env` file is in the root directory
2. Restart the development server after adding environment variables
3. Check that variable names start with `VITE_`

### Supabase Issues?
The project is pre-configured with Supabase. If you encounter authentication issues, check the Supabase configuration in `src/lib/supabase.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.