import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import { AnimatePresence, motion } from "framer-motion"

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    username: "",
    rollNo: "",
    role: "student",
    email: "",
    password: "",
    gender: "",
    dob: "",
    year: "",
    department: "",
    phoneNo: ""
  });

  const navigate = useNavigate(); 
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!loginForm.email || !loginForm.password) {
      alert("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginForm.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      console.log("Sending login data:", loginForm);
      
      const response = await fetch(`https://club-events-1.onrender.com/api/users/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
        
      });
      console.log("Sending login data:", loginForm);

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || error.message || "Login failed");
        console.error("Login error response:", error);
        return;
      }

      const result = await response.json();
      alert("Login successful!");
      localStorage.setItem('user', JSON.stringify(result.user));
      setLoginForm({ email: "", password: "" });
      setShowPassword(false);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (signupForm.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(signupForm.phoneNo)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      console.log("Sending signup data:", signupForm);
      
      const response = await fetch(`https://club-events-1.onrender.com/api/users`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupForm),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || error.message || "Signup failed");
        console.error("Signup error response:", error);
        return;
      }

      const result = await response.json();
      alert("Signup successful!");
      setSignupForm({
        username: "",
        rollNo: "",
        email: "",
        password: "",
        gender: "",
        dob: "",
        year: "",
        department: "",
        phoneNo: ""
      });
      setShowPassword(false);

      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      console.log("Signup error details:", { signupForm });
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 relative overflow-hidden flex items-center justify-center">
      <div className="flex flex-col lg:flex-row h-[90vh] w-full max-w-6xl z-10 shadow-lg rounded-2xl overflow-hidden">
        <div className="w-full lg:w-1/2 flex flex-col px-2 sm:px-5 py-5 bg-white bg-opacity-90">
       <div className="w-full max-w-md mx-auto mb-6">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-b from-red-600 via-red-500 to-black bg-clip-text text-transparent">
                WELCOME BACK
              </h1>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                type="button"
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("signup");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="flex- flex items-center justify-center">
            <div className="w-full max-w-md mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LoginForm
                      loginForm={loginForm}
                      handleLoginChange={handleLoginChange}
                      handleLoginSubmit={handleLoginSubmit}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      setActiveTab={setActiveTab}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SignupForm
                      signupForm={signupForm}
                      handleSignupChange={handleSignupChange}
                      handleSignupSubmit={handleSignupSubmit}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      setActiveTab={setActiveTab}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
          <div className="absolute top-10 right-10 text-9xl font-black text-gray-200 opacity-20 select-none">
            Go
          </div>
          <div className="w-20 h-20 bg-gradient-to-t from-red-400 to bg-purple-400 animate-spin "></div>

          <div className="absolute top-1/2 left-10 space-y-4">
            <div className="w-60 h-60 bg-red-300 rounded opacity-60 animate-bounce"></div>
            <div className="w-40 h-10 bg-red-300 rounded opacity-40"></div>
            <div className="w-20 h-5 bg-red-300 rounded opacity-20"></div>
            
          </div>
          <div className="w-10 h-10 bg-red-300 rounded opacity-40  animate-spin "></div>
          <div className="absolute top-6 left-1/4 w-20 h-20 bg-red-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-red-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;