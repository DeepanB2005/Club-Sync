import React from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleOauth from "./googleOauth";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SignupForm = ({
  signupForm,
  handleSignupChange,
  handleSignupSubmit,
  showPassword,
  setShowPassword,
  setActiveTab,
  onGoogleAuth, // Pass callback
}) => (
  <div>
    <form className="space-y-2" onSubmit={handleSignupSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={signupForm.username}
            onChange={handleSignupChange}
            placeholder="Enter username"
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
          <input
            type="text"
            name="rollNo"
            value={signupForm.rollNo}
            onChange={handleSignupChange}
            placeholder="Enter roll number"
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={signupForm.email}
          onChange={handleSignupChange}
          placeholder="Enter your email"
          required
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={signupForm.password}
            onChange={handleSignupChange}
            placeholder="Create a password"
            required
            className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={signupForm.gender}
            onChange={handleSignupChange}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={signupForm.dob}
            onChange={handleSignupChange}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            name="year"
            value={signupForm.year}
            onChange={handleSignupChange}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          >
            <option value="">Select year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            name="department"
            value={signupForm.department}
            onChange={handleSignupChange}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          >
            <option value="">Select department</option>
            <option value="Computer Science">Artificial Intelligence</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Chemical">Chemical</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          name="phoneNo"
          value={signupForm.phoneNo}
          onChange={handleSignupChange}
          placeholder="Enter phone number"
          required
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-gre-500"
      >
        Create Account
      </button>
    </form>

    <div className="my-4">
        <GoogleOAuthProvider clientId="829753005073-l9kam0mc2v6io2p5gj0gpu0msoc9i3k2.apps.googleusercontent.com">

      <GoogleOauth onLogin={onGoogleAuth} />
      </GoogleOAuthProvider>
    </div>
  </div>
);

export default SignupForm;