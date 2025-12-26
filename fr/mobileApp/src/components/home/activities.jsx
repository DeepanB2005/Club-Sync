import React from "react";

// Single Feature Card with Attractive Effects
function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="group relative">
      {/* Spinning Gradient Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] animate-spin-slow pointer-events-none z-0">
        <div className="h-full w-full rounded-3xl bg-gradient-to-t from-purple-300 to-blue-200 dark:bg-gray-900"></div>
      </div>
      {/* Outer Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-60 blur-xl transition-all duration-700 animate-pulse-glow pointer-events-none z-0"></div>
      {/* Main Card */}
      <div
        className="relative bg-gradient-to-t from-purple-300 to-blue-200 dark:bg-gray-90bor0/70 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 dark:ring-gray-700 hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 der   overflow-hidden focus-within:ring-2 focus-within:ring-purple-400 backdrop-blur-sm"
        tabIndex={0}
        aria-label={title}
      >
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-0 animate-gradient-shift`}></div>
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-float-1"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-float-2"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-float-3"></div>
        </div>
        {/* Icon with Effects */}
        <div className={`z-10 relative w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ring-2 ring-white/30 group-hover:ring-white/60 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]`} aria-hidden="true">
          <span className="text-3xl drop-shadow-lg" role="img" aria-label={title}>{icon}</span>
          {/* Icon Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500`}></div>
        </div>
        {/* Title */}
        <h3 className="z-10 relative text-2xl font-extrabold mb-3 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 dark:group-hover:from-purple-300 dark:group-hover:via-pink-300 dark:group-hover:to-blue-300 transition-all duration-500 drop-shadow-sm">
          {title}
        </h3>
        {/* Description */}
        <p className="z-10 relative text-gray-700 dark:text-gray-300 leading-relaxed font-normal max-w-xs mx-auto group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
          {description}
        </p>
        {/* Arrow */}
        <div className="z-10 absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500">
          <div className="relative w-10 h-10 bg-white/90 dark:bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:scale-110 transition-all duration-300">
            <span className="text-purple-600 group-hover:text-white text-lg font-bold transition-colors duration-300">→</span>
            {/* Ripple */}
            <div className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700"></div>
          </div>
        </div>
        {/* Bottom Accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`}></div>
      </div>
    </div>
  );
}

function Activities() {
  const features = [
    {
      icon: "👥",
      title: "Member Management",
      description: "Effortlessly manage member profiles, track attendance, and handle membership renewals with automated notifications.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📅",
      title: "Event Planning",
      description: "Create, schedule, and manage events with RSVP tracking, automated reminders, and seamless communication tools.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "💰",
      title: "Financial Tracking",
      description: "Monitor club finances, track dues, manage expenses, and generate detailed financial reports with ease.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "📊",
      title: "Analytics & Reports",
      description: "Get actionable insights with detailed analytics on membership trends, event success, and financial performance.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "💬",
      title: "Communication Hub",
      description: "Send targeted messages, newsletters, and announcements to specific member groups or your entire club.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data encryption, regular backups, and 99.9% uptime guarantee for peace of mind.",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section
      className="min-h-screen py-6 px-4 transition-colors duration-500"
      aria-label="Powerful Features"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center mb-12 gap-6 justify-center">
          <div className="inline-block p-2 bg-white/90 dark:bg-gray-950/60 rounded-full shadow-lg h-18 flex items-center">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow">
              <span className="text-white text-3xl font-bold">✨</span>
            </div>
          </div>
          <div className="text-center sm:text-left max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-2 leading-tight">
              Powerful Features
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto leading-relaxed font-light">
              Everything you need to run a successful club—<span className="font-semibold text-blue-600 dark:text-blue-400">incredibly simple to use</span>.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard {...feature} key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Activities;
