import React from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleOauth from "./googleOauth";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginForm = ({
  loginForm,
  handleLoginChange,
  handleLoginSubmit,
  showPassword,
  setShowPassword,
  setActiveTab,
  onGoogleAuth, // Pass callback
}) => (
  <div>
    <form className="space-y-6" onSubmit={handleLoginSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={loginForm.email}
          onChange={handleLoginChange}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="••••••••••"
            required
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-red-500 hover:text-red-600 transition-colors">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        Login
      </button>
    </form>

    <div className="my-4">
    <GoogleOAuthProvider clientId="829753005073-l9kam0mc2v6io2p5gj0gpu0msoc9i3k2.apps.googleusercontent.com">

      <GoogleOauth onLogin={onGoogleAuth} />
      </GoogleOAuthProvider>
    </div>
  </div>
);

export default LoginForm;