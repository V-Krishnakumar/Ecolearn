import React from 'react';
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
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Leaves */}
        <div className="absolute top-20 left-10 w-8 h-8 text-green-400 opacity-60 animate-float">
          <Leaf className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 text-orange-400 opacity-50 animate-float-delayed">
          <Leaf className="w-full h-full transform rotate-45" />
        </div>
        <div className="absolute top-60 left-1/4 w-10 h-10 text-pink-400 opacity-40 animate-float-slow">
          <Leaf className="w-full h-full transform rotate-12" />
        </div>
        <div className="absolute top-80 right-1/3 w-7 h-7 text-green-500 opacity-55 animate-float">
          <Leaf className="w-full h-full transform -rotate-12" />
        </div>
        <div className="absolute top-96 left-16 w-5 h-5 text-yellow-400 opacity-45 animate-float-delayed">
          <Leaf className="w-full h-full transform rotate-90" />
        </div>
        
        {/* More floating elements */}
        <div className="absolute top-32 right-10 w-4 h-4 text-green-300 opacity-50 animate-float-slow">
          <Leaf className="w-full h-full transform rotate-180" />
        </div>
        <div className="absolute top-52 left-1/3 w-9 h-9 text-orange-300 opacity-40 animate-float">
          <Leaf className="w-full h-full transform rotate-45" />
        </div>
        <div className="absolute top-72 right-1/4 w-6 h-6 text-pink-300 opacity-45 animate-float-delayed">
          <Leaf className="w-full h-full transform -rotate-45" />
        </div>
        <div className="absolute top-88 left-20 w-8 h-8 text-green-400 opacity-50 animate-float-slow">
          <Leaf className="w-full h-full transform rotate-30" />
        </div>
        
        {/* Bottom section floating elements */}
        <div className="absolute bottom-40 left-10 w-7 h-7 text-green-500 opacity-45 animate-float">
          <Leaf className="w-full h-full transform rotate-60" />
        </div>
        <div className="absolute bottom-60 right-20 w-5 h-5 text-orange-400 opacity-40 animate-float-delayed">
          <Leaf className="w-full h-full transform -rotate-30" />
        </div>
        <div className="absolute bottom-80 left-1/4 w-6 h-6 text-pink-400 opacity-50 animate-float-slow">
          <Leaf className="w-full h-full transform rotate-120" />
        </div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 text-green-300 opacity-45 animate-float">
          <Leaf className="w-full h-full transform -rotate-60" />
        </div>
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
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
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
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Empowering students to learn sustainability through{' '}
              <span className="text-green-600 font-bold">fun games</span>,{' '}
              <span className="text-blue-600 font-bold">interactive lessons</span>, and{' '}
              <span className="text-green-600 font-bold">real-world actions</span>.
            </p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 relative">
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
      <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 relative">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50 relative">
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
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative">
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
      `}</style>
    </div>
  );
};

export default LandingPage;
