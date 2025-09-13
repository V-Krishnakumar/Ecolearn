# EcoLearn - Environmental Education Platform

An interactive environmental education platform with AI-powered chatbot, lessons, quizzes, and games to help students learn about sustainability and environmental conservation.

## Features

- 🌱 **Interactive Lessons & Games**: Learn through engaging games about waste management, water treatment, pollution control, afforestation, deforestation, and renewable energy
- 🤖 **AI Chatbot**: Powered by Google Gemini for environmental Q&A
- 📚 **Educational Quizzes**: Test your knowledge with comprehensive quizzes for each topic
- 📸 **Real-Time Tasks**: Upload photos of environmental activities like tree planting
- 📊 **Progress Tracking**: Track your learning progress and scores
- 🌍 **Multilingual Support**: Available in English and Hindi
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

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
Copy the environment template and add your API key:

```bash
# Copy the environment template
cp .env.example .env

# Verify the .env file was created
ls -la .env
```

Then edit the `.env` file and add your Google Gemini API key:

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

### 7. Test the AI Chatbot
- Click on the chatbot icon in the bottom right
- Ask a question like "What is recycling?"
- If it doesn't work, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Environment Variables

The application requires a Google Gemini API key for the AI chatbot functionality:

- `VITE_GOOGLE_API_KEY`: Your Google Gemini API key

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── games/          # Educational game components
│   └── ui/             # UI component library
├── contexts/           # React contexts (Language, User, etc.)
├── pages/              # Main application pages
├── lib/                # Utilities and configurations
│   ├── ai.ts          # AI chatbot logic
│   └── supabase.ts    # Database configuration
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Team Setup

### For New Team Members

When a new team member joins:

1. **Clone the repository**
2. **Copy environment template**: `cp .env.example .env`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`

**Note**: You'll need to add your own Google Gemini API key to the `.env` file for the chatbot to work.

### Sharing API Keys with Team

**Setup**: Each team member should get their own Google Gemini API key.

**Benefits of this approach:**
- ✅ Individual API key limits and usage tracking
- ✅ No shared dependencies on a single key
- ✅ Better security and access control
- ✅ API key is not committed to Git (`.env` files are ignored)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **Google Gemini AI** - AI chatbot functionality
- **Supabase** - Backend and authentication

## Troubleshooting

### Chatbot Not Working?
1. Make sure you have a valid Google API key in your `.env` file
2. Check the browser console for any error messages
3. Ensure the API key starts with `AIzaSy`
4. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions

### Environment Variables Not Loading?
1. Make sure your `.env` file is in the root directory
2. Restart the development server after adding environment variables
3. Check that variable names start with `VITE_`

### Supabase Issues?
The project is pre-configured with Supabase. If you encounter authentication issues, check the Supabase configuration in `src/lib/supabase.ts`.

## License

This project is licensed under the MIT License.
