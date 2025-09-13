# Eco-Bright Learn

An interactive environmental education platform with games, quizzes, and real-time tasks to help students learn about sustainability and environmental conservation.

## Features

- 🌱 **Interactive Games**: Learn through engaging games about waste management, water treatment, pollution control, afforestation, deforestation, and renewable energy
- 📚 **Educational Quizzes**: Test your knowledge with comprehensive quizzes for each topic
- 📸 **Real-Time Tasks**: Upload photos of environmental activities like tree planting
- 🌍 **Multilingual Support**: Available in English and Hindi
- 🤖 **AI Chatbot**: Get instant answers to environmental questions using Google Gemini AI

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd eco-bright-learn-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template (already includes team API key)
   cp .env.example .env
   
   # The .env.example file already contains the team's Google Gemini API key
   # No additional setup needed!
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to see the application.

## Environment Variables

The application requires a Google Gemini API key for the AI chatbot functionality:

- `VITE_GOOGLE_API_KEY`: Your Google Gemini API key

### Getting a Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── games/          # Game components
│   └── ui/             # UI library components
├── contexts/           # React contexts (Language, etc.)
├── pages/              # Main application pages
├── lib/                # Utility functions and AI integration
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team Setup

### For New Team Members

When a new team member joins:

1. **Clone the repository**
2. **Copy environment template**: `cp .env.example .env` (API key already included!)
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`

**Note**: The team's Google Gemini API key is already included in the `.env.example` file, so no additional setup is needed!

### Sharing API Keys with Team

**Current Setup**: The team's Google Gemini API key is shared through the `.env.example` file.

**Benefits of this approach:**
- ✅ Easy setup for new team members
- ✅ No need to share keys individually
- ✅ Consistent environment across all developers
- ✅ API key is not committed to Git (`.env` files are ignored)

**Note**: Since `.env` files are ignored by Git, the API key remains secure and is only available to team members who have access to the repository.

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **Google Gemini AI** - AI chatbot functionality

## License

This project is licensed under the MIT License.