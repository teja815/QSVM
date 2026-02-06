import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  loginWithGoogle, 
  handleRedirectResult,
  signUpWithEmail,
  signInWithEmail
} from "../firebase";
import { Mail, Lock, Eye, EyeOff, Moon, Sun, User, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
    
    // Handle redirect result on component mount
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.user) {
          // User successfully signed in via redirect
          console.log('Redirect sign-in successful');
        }
      } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
          setError(error.message);
        }
      }
    };
    
    checkRedirectResult();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUpWithEmail(formData.email, formData.password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      switch (provider) {
        case 'google':
          await loginWithGoogle();
          break;
        case 'facebook':
          await loginWithFacebook();
          break;
        case 'twitter':
          await loginWithTwitter();
          break;
        default:
          throw new Error('Unknown provider');
      }
    } catch (error) {
      // Only show error if it's not a popup-blocked error (handled automatically)
      if (error.code !== 'auth/popup-blocked') {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Quantum orbits */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute border rounded-full ${
              darkMode ? 'border-purple-400/20' : 'border-purple-300/30'
            }`}
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              left: '50%',
              top: '50%',
              marginLeft: `${-150 - i * 100}px`,
              marginTop: `${-150 - i * 100}px`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className={`absolute w-3 h-3 rounded-full ${
                darkMode ? 'bg-cyan-400' : 'bg-purple-500'
              }`}
              style={{ top: '-6px', left: '50%', marginLeft: '-6px' }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              darkMode ? 'bg-cyan-400/40' : 'bg-purple-400/40'
            }`}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-110 ${
          darkMode
            ? 'bg-gray-800/50 border-gray-700 text-yellow-400 hover:bg-gray-700/50'
            : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white/70'
        }`}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`w-full max-w-md backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden ${
            darkMode
              ? 'bg-gray-900/40 border-gray-700/50'
              : 'bg-white/40 border-white/50'
          }`}
        >
          {/* Animated Header */}
          <div className="relative p-8 text-center">
            <motion.div
              className="mb-6 flex justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-3 border-white border-dashed rounded-full"
                  />
                </div>
                <motion.div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-30 blur-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <h1 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quantum Bucket
            </h1>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Enter the quantum realm
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 pb-8">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Buttons */}
            <div className={`flex rounded-xl p-1 mb-6 ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
            }`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <motion.button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-102 disabled:opacity-50 ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-white hover:bg-gray-800/50'
                    : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-white/70'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-102 disabled:opacity-50 ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white hover:bg-gray-800/50'
                    : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-white/70'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleSocialLogin('twitter')}
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-102 disabled:opacity-50 ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-sky-500 hover:text-white hover:bg-gray-800/50'
                    : 'border-gray-300 text-gray-700 hover:border-sky-500 hover:text-sky-600 hover:bg-white/70'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Continue with Twitter</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <div className="w-full border-t border-current opacity-30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${
                  darkMode ? 'bg-gray-900 text-gray-400' : 'bg-purple-50 text-gray-500'
                }`}>
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white/70'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      darkMode
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white/70'
                    }`}
                  />
                </div>

                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      darkMode
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70'
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white/70'
                      }`}
                    />
                  </motion.div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-purple-500 hover:text-purple-600 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold overflow-hidden disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Footer Text */}
            <motion.p
              className={`mt-6 text-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}