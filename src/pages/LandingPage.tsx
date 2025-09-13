import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  Building2, 
  Recycle, 
  Thermometer, 
  Trees,
  ArrowRight,
  Leaf,
  Users,
  Target,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const fullText = "Empowering students to learn sustainability through fun games, interactive lessons, and real-world actions.";

  useEffect(() => {
    if (isTyping) {
      if (currentIndex < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + fullText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 50); // Typing speed (50ms per character)

        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait 10 seconds then restart
        setIsTyping(false);
        setShowCursor(false);
        
        const pauseTimeout = setTimeout(() => {
          // Clear text and restart
          setDisplayText('');
          setCurrentIndex(0);
          setIsTyping(true);
          setShowCursor(true);
        }, 10000); // 10 second pause

        return () => clearTimeout(pauseTimeout);
      }
    }
  }, [currentIndex, fullText, isTyping]);

  // Cursor blinking effect
  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500); // Blink every 500ms

      return () => clearInterval(cursorInterval);
    }
  }, [showCursor]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleExplore = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sdgGoals = [
    {
      number: 6,
      title: "Clean Water and Sanitation",
      icon: Droplets,
      color: "bg-blue-500",
      description: "Ensure availability and sustainable management of water"
    },
    {
      number: 7,
      title: "Affordable and Clean Energy",
      icon: Zap,
      color: "bg-yellow-500",
      description: "Ensure access to affordable, reliable, sustainable energy"
    },
    {
      number: 11,
      title: "Sustainable Cities and Communities",
      icon: Building2,
      color: "bg-orange-500",
      description: "Make cities and human settlements inclusive and sustainable"
    },
    {
      number: 12,
      title: "Responsible Consumption and Production",
      icon: Recycle,
      color: "bg-red-500",
      description: "Ensure sustainable consumption and production patterns"
    },
    {
      number: 13,
      title: "Climate Action",
      icon: Thermometer,
      color: "bg-green-600",
      description: "Take urgent action to combat climate change"
    },
    {
      number: 15,
      title: "Life on Land",
      icon: Trees,
      color: "bg-green-500",
      description: "Protect, restore and promote sustainable use of terrestrial ecosystems"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            filter: 'blur(0.5px)',
            transform: 'scale(1.02)'
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            setVideoLoaded(true);
          }}
          onError={(e) => {
            console.error('Video failed to load:', e);
            setVideoError(true);
          }}
          onLoadStart={() => console.log('Video loading started')}
        >
          <source src="/videos/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading indicator */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-green-600 font-medium">Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Fallback background if video fails to load */}
        {videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-green-600 font-medium">Video unavailable - using static background</p>
            </div>
          </div>
        )}
        
        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 via-blue-50/60 to-green-50/60"></div>
        {/* Additional overlay for better contrast */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Floating Leaves - Increased quantity for more immersive effect */}
        {Array.from({ length: 50 }, (_, i) => {
          const positions = [
            { top: '20%', left: '10%' }, { top: '40%', right: '20%' }, { top: '60%', left: '25%' },
            { top: '80%', right: '33%' }, { top: '96%', left: '16%' }, { top: '32%', right: '10%' },
            { top: '52%', left: '33%' }, { top: '72%', right: '25%' }, { top: '88%', left: '20%' },
            { top: '15%', left: '5%' }, { top: '35%', right: '15%' }, { top: '55%', left: '40%' },
            { top: '75%', right: '40%' }, { top: '95%', left: '30%' }, { top: '25%', right: '5%' },
            { top: '45%', left: '15%' }, { top: '65%', right: '30%' }, { top: '85%', left: '45%' },
            { top: '10%', right: '35%' }, { top: '30%', left: '50%' }, { top: '50%', right: '50%' },
            { top: '70%', left: '10%' }, { top: '90%', right: '60%' }, { top: '12%', left: '70%' },
            { top: '38%', right: '70%' }, { top: '58%', left: '60%' }, { top: '78%', right: '80%' },
            { top: '98%', left: '80%' }, { top: '18%', right: '85%' }, { top: '42%', left: '85%' },
            { top: '62%', right: '90%' }, { top: '82%', left: '90%' }, { top: '8%', right: '25%' },
            { top: '28%', left: '75%' }, { top: '48%', right: '75%' }, { top: '68%', left: '35%' },
            { top: '88%', right: '35%' }, { top: '22%', left: '65%' }, { top: '46%', right: '45%' },
            { top: '66%', left: '55%' }, { top: '86%', right: '55%' }, { top: '14%', left: '95%' },
            { top: '34%', right: '95%' }, { top: '54%', left: '95%' }, { top: '74%', right: '95%' },
            { top: '94%', left: '95%' }, { top: '6%', right: '15%' }, { top: '26%', left: '25%' },
            { top: '56%', right: '65%' }, { top: '76%', left: '65%' }, { top: '96%', right: '25%' }
          ];
          
          const position = positions[i % positions.length];
          const sizes = ['w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-7 h-7', 'w-8 h-8', 'w-9 h-9', 'w-10 h-10'] as const;
          const size = sizes[i % sizes.length];
          const colors = ['text-green-400', 'text-orange-400', 'text-pink-400', 'text-green-500', 'text-yellow-400', 'text-green-300', 'text-orange-300', 'text-pink-300', 'text-emerald-400', 'text-lime-400'] as const;
          const color = colors[i % colors.length];
          const opacities = ['opacity-40', 'opacity-45', 'opacity-50', 'opacity-55', 'opacity-60'] as const;
          const opacity = opacities[i % opacities.length];
          const animations = ['animate-float', 'animate-float-delayed', 'animate-float-slow'] as const;
          const animation = animations[i % animations.length];
          const rotations = ['rotate-0', 'rotate-45', 'rotate-12', '-rotate-12', 'rotate-90', 'rotate-180', '-rotate-45', 'rotate-30', 'rotate-60', '-rotate-30', 'rotate-120', '-rotate-60', 'rotate-135', '-rotate-135', 'rotate-270'] as const;
          const rotation = rotations[i % rotations.length];
          
          return (
            <div
              key={i}
              className={`absolute ${size} ${color} ${opacity} ${animation}`}
              style={position}
            >
              <Leaf className={`w-full h-full transform ${rotation}`} />
            </div>
          );
        })}
        
        {/* Additional scattered leaves for even more coverage */}
        {Array.from({ length: 30 }, (_, i) => {
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const sizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5', 'w-6 h-6'] as const;
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          const colors = ['text-green-300', 'text-orange-300', 'text-pink-300', 'text-emerald-300', 'text-lime-300'] as const;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const opacities = ['opacity-20', 'opacity-25', 'opacity-30', 'opacity-35'] as const;
          const opacity = opacities[Math.floor(Math.random() * opacities.length)];
          const animations = ['animate-float', 'animate-float-delayed', 'animate-float-slow'] as const;
          const animation = animations[Math.floor(Math.random() * animations.length)];
          const rotations = ['rotate-0', 'rotate-45', 'rotate-12', '-rotate-12', 'rotate-90', 'rotate-180', '-rotate-45', 'rotate-30', 'rotate-60', '-rotate-30', 'rotate-120', '-rotate-60'] as const;
          const rotation = rotations[Math.floor(Math.random() * rotations.length)];
          
          return (
            <div
              key={`scattered-${i}`}
              className={`absolute ${size} ${color} ${opacity} ${animation}`}
              style={{ top: `${randomTop}%`, left: `${randomLeft}%` }}
            >
              <Leaf className={`w-full h-full transform ${rotation}`} />
            </div>
          );
        })}
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-green-200/50 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">EcoLearn</span>
            </div>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="inline ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-full mb-6 shadow-lg">
                <Leaf className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700 font-semibold">🌱 Sustainable Education Platform</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                EcoLearn
              </span>
              <br />
              <span className="text-gray-800">Shaping a</span>{' '}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Sustainable Future
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium min-h-[4rem]">
              <span className="typewriter-text">
                {displayText.split(' ').map((word, index, array) => {
                  const isHighlighted = word === 'games' || word === 'lessons,' || word === 'actions.';
                  const color = word === 'games' || word === 'actions.' ? 'text-green-600 font-bold' : 
                               word === 'lessons,' ? 'text-blue-600 font-bold' : 'text-gray-700';
                  return (
                    <span key={index} className={color}>
                      {word}{index < array.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
                <span className={`text-green-500 font-bold ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`}>
                  |
                </span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleExplore}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center"
              >
                Explore Our Mission
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-white/90 hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-300"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Goals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 relative z-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl mb-8 shadow-xl">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Our SDG Goals
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              We align with the{' '}
              <span className="text-green-600 font-bold">United Nations Sustainable Development Goals</span>{' '}
              to create meaningful impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sdgGoals.map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div
                  key={goal.number}
                  className="group bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-200/50 animate-fade-in relative overflow-hidden backdrop-blur-sm"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon container with enhanced styling */}
                  <div className={`${goal.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl relative z-10 ring-4 ring-white/50`}>
                    <IconComponent className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-sm font-bold text-gray-500 mb-3 tracking-wide bg-gray-100 px-3 py-1 rounded-full inline-block">SDG {goal.number}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">{goal.title}</h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{goal.description}</p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-blue-200 to-green-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/50 to-transparent rounded-bl-3xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 relative z-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-2xl mb-8 shadow-xl">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Who We Are
              </span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              We are a team of{' '}
              <span className="text-blue-600 font-bold">passionate students</span>{' '}
              dedicated to environmental education, using{' '}
              <span className="text-green-600 font-bold">cutting-edge technology</span>{' '}
              to make sustainability{' '}
              <span className="text-blue-600 font-bold">fun and interactive</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50 relative z-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl mb-8 shadow-xl">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              To{' '}
              <span className="text-green-600 font-bold">educate students</span>{' '}
              on sustainability, encourage{' '}
              <span className="text-blue-600 font-bold">real-world eco-friendly actions</span>, and build a{' '}
              <span className="text-green-600 font-bold">greener tomorrow</span>{' '}
              together.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">EcoLearn</span>
          </div>
          <p className="text-gray-300 text-lg">© 2025 EcoLearn. All Rights Reserved.</p>
          <p className="text-gray-400 text-sm mt-2">Shaping a Sustainable Future Together 🌱</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        
        @keyframes cursor-blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        .typewriter-text {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.025em;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.6;
        }
        
        .typewriter-text span:last-child {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
