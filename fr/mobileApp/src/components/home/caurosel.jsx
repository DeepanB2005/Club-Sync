import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, Trophy, Star, MapPin, Clock } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Event Management",
      subtitle: "Seamless Planning",
      description: "Create, manage, and track all your college events with our intuitive platform",
      icon: Calendar,
      gradient: "from-purple-600 via-pink-600 to-red-500",
      features: ["Event Scheduling", "RSVP Tracking", "Real-time Updates"]
    },
    {
      id: 2,
      title: "Club Directory",
      subtitle: "Connect & Discover",
      description: "Explore all campus clubs and find your perfect community",
      icon: Users,
      gradient: "from-blue-600 via-cyan-500 to-teal-400",
      features: ["Club Profiles", "Member Directory", "Join Requests"]
    },
    {
      id: 3,
      title: "Competition Portal",
      subtitle: "Compete & Win",
      description: "Participate in inter-club competitions and showcase your talents",
      icon: Trophy,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      features: ["Tournament Brackets", "Live Scores", "Achievement Badges"]
    },
    {
      id: 4,
      title: "Event Discovery",
      subtitle: "Never Miss Out",
      description: "Discover exciting events happening across campus",
      icon: Star,
      gradient: "from-indigo-600 via-purple-600 to-pink-500",
      features: ["Event Feed", "Personalized Recommendations", "Bookmark Events"]
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-[450px] h-[450px] mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
      </div>

      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const IconComponent = slide.icon;
          return (
            <div
              key={slide.id}
              className={`min-w-full h-full relative bg-gradient-to-br ${slide.gradient} flex flex-col justify-center items-center p-8 text-white`}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/4 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-ping" style={{ animationDuration: '2s' }}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon with Animation */}
                <div className="mb-6 transform transition-all duration-500 hover:scale-110">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <IconComponent size={40} className="animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-2 transform transition-all duration-500 hover:scale-105">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p className="text-lg opacity-90 mb-4 font-medium">
                  {slide.subtitle}
                </p>

                  <p className="text-sm opacity-80 mb-6 leading-relaxed max-w-xs">
                  {slide.description}
                </p>

                <div className="space-y-2">
                  {slide.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-center text-sm opacity-90 transform transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 flex space-x-2">
                <MapPin size={16} className="opacity-60 animate-bounce" style={{ animationDelay: '1s' }} />
                <Clock size={16} className="opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110 group"
      >
        <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110 group"
      >
        <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4">
        <div 
          className={`w-2 h-2 rounded-full ${
            isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}
          title={isAutoPlaying ? 'Auto-playing' : 'Paused'}
        />
      </div>


    </div>
  );
};

export default Carousel;