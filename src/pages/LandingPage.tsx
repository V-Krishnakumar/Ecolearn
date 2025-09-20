import React, { useState, useEffect, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  
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

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determine if video should be visible (when at top of page)
      setIsVideoVisible(currentScrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background Video */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            isVideoVisible 
              ? 'opacity-100 blur-0' 
              : 'opacity-100 blur-md'
          }`}
          style={{
            filter: `blur(${Math.min(scrollY / 20, 10)}px)`,
            transform: `scale(${1 + scrollY / 2000})`
          }}
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay for better content readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Background Elements - Only visible when video is not blurred */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${
        isVideoVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Floating Leaves - Reduced quantity for better performance */}
        {Array.from({ length: 20 }, (_, i) => {
          const positions = [
            { top: '20%', left: '10%' }, { top: '40%', right: '20%' }, { top: '60%', left: '25%' },
            { top: '80%', right: '33%' }, { top: '96%', left: '16%' }, { top: '32%', right: '10%' },
            { top: '52%', left: '33%' }, { top: '72%', right: '25%' }, { top: '88%', left: '20%' },
            { top: '15%', left: '5%' }, { top: '35%', right: '15%' }, { top: '55%', left: '40%' },
            { top: '75%', right: '40%' }, { top: '95%', left: '30%' }, { top: '25%', right: '5%' },
            { top: '45%', left: '15%' }, { top: '65%', right: '30%' }, { top: '85%', left: '45%' },
            { top: '10%', right: '35%' }, { top: '30%', left: '50%' }
          ];
          
          const position = positions[i % positions.length];
          const sizes = ['w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-7 h-7', 'w-8 h-8'] as const;
          const size = sizes[i % sizes.length];
          const colors = ['text-green-400', 'text-orange-400', 'text-pink-400', 'text-green-500', 'text-yellow-400'] as const;
          const color = colors[i % colors.length];
          const opacities = ['opacity-40', 'opacity-45', 'opacity-50', 'opacity-55', 'opacity-60'] as const;
          const opacity = opacities[i % opacities.length];
          const animations = ['animate-float', 'animate-float-delayed', 'animate-float-slow'] as const;
          const animation = animations[i % animations.length];
          const rotations = ['rotate-0', 'rotate-45', 'rotate-12', '-rotate-12', 'rotate-90', 'rotate-180', '-rotate-45', 'rotate-30', 'rotate-60', '-rotate-30'] as const;
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
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-green-200/50 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg" style={{ textShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}>EcoLearn</span>
            </div>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-cyan-300/50"
              style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}
            >
              Get Started
              <ArrowRight className="inline ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center relative w-full">
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10 rounded-3xl -m-8"></div>
          <div className="animate-fade-in relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
                EcoLearn
              </span>
              <br />
              <span className="text-white drop-shadow-2xl" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.8)' }}>Shaping a</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }}>
                Sustainable Future
              </span>
            </h1>
            <div className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium min-h-[4rem]">
              <span className="typewriter-text">
                {displayText.split(' ').map((word, index, array) => {
                  const isHighlighted = word === 'games' || word === 'lessons,' || word === 'actions.';
                  const color = word === 'games' || word === 'actions.' ? 'text-yellow-400 font-bold drop-shadow-lg' : 
                               word === 'lessons,' ? 'text-cyan-400 font-bold drop-shadow-lg' : 'text-white drop-shadow-lg';
                  const shadowStyle = word === 'games' || word === 'actions.' ? { textShadow: '0 0 15px rgba(251, 191, 36, 0.8)' } :
                                    word === 'lessons,' ? { textShadow: '0 0 15px rgba(34, 211, 238, 0.8)' } :
                                    { textShadow: '0 0 10px rgba(255, 255, 255, 0.6)' };
                  return (
                    <span key={index} className={color} style={shadowStyle}>
                      {word}{index < array.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
                <span className={`text-yellow-400 font-bold drop-shadow-lg ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`} style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.8)' }}>
                  |
                </span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mx-auto">
              <button
                onClick={handleExplore}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center border-2 border-cyan-300/50"
                style={{ boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}
              >
                Explore Our Mission
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-yellow-300/50"
                style={{ boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)' }}
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer Section */}
      <section className="h-32 relative z-10"></section>

      {/* SDG Goals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl -m-4"></div>
          <div className="text-center mb-16 animate-fade-in relative z-10">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
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
      <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl -m-4"></div>
          <div className="animate-fade-in relative z-10">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl -m-4"></div>
          <div className="animate-fade-in relative z-10">
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
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center relative">
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

      <style>{`
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
