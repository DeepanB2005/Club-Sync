import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Zap, Heart } from 'lucide-react';

const DashboardGreetings = () => {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState({ text: 'Loading inspirational quote...', author: '' });
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    

    fetchRandomQuote();
  }, []);

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const user = getCurrentUser();
  const userName = user?.username || user?.email?.split('@')[0] || 'Student';

  const fetchRandomQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        method: 'GET',
        headers: {
          'X-Api-Key': 'LUEPUvdy7Aam9u12+Bk14w==eUMRB8lDJBpStArr'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setQuote({
            text: data[0].quote,
            author: data[0].author
          });
        }
      } else {
        setQuote({
          text: 'The best way to predict the future is to invent it.',
          author: 'Alan Kay'
        });
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuote({
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill'
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const keyFeatures = [
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Smart Dashboard',
      description: 'Personalized experience with real-time updates'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Actions',
      description: 'Access everything you need in just one click'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Community Focus',
      description: 'Connect and engage with your community'
    }
  ];

  return (
    <div className="font-ft min-h-screen bg-gradient-to-br from-violet-100 via-red-200 to-blue-200 relative overflow-hidden dark:bg-gradient-to-t dark:from-gray-900 dark:via-yellow-700 dark:to-grey-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-300/15 rounded-full blur-2xl animate-ping"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-spin" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {greeting}!
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
          <p className="text-3xl text-purple-700 font-light mb-2">
            Welcome back, <span className="font-semibold text-pink-600">{userName}</span>
          </p>
          <p className="text-purple-600 text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-center text-purple-600 mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-xl p-8 border border-green-200 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-2xl font-bold text-purple-800 text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-purple-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-10 border border-white/30 text-center">
            <h2 className="text-4xl font-bold text-purple-800 mb-8">Daily Inspiration</h2>
            
            <div className="mb-8 min-h-[120px] flex items-center justify-center">
              {isLoadingQuote ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-purple-300 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-purple-200 rounded w-1/2 mx-auto"></div>
                </div>
              ) : (
                <div>
                  <blockquote className="text-2xl text-purple-800 font-medium italic mb-4 leading-relaxed">
                    "{quote.text}"
                  </blockquote>
                  <cite className="text-xl text-purple-600 font-semibold">
                    — {quote.author}
                  </cite>
                </div>
              )}
            </div>

            <button
              onClick={fetchRandomQuote}
              disabled={isLoadingQuote}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingQuote ? 'Loading...' : '✨ Get New Quote ✨'}
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-purple-600 text-lg font-light">
            Start your day with positivity and inspiration! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardGreetings;