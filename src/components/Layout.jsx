import React, { useState } from 'react';
import { Menu, X, Home, Info, Mail, Eye, FileText, Moon, Sun, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsSidebar from './SettingsSidebar';
import QVFooter from './QVFooter';

export default function Layout({ children, user, onLogout, darkMode, toggleDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigation = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'About', to: '/#about', icon: Info },
    { name: 'Visualizer', to: '/#visualizer', icon: Eye },
    { name: 'Documentation', to: '/#docs', icon: FileText },
    { name: 'Contact', to: '/#contact', icon: Mail },
  ];



  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20' 
            : 'bg-gradient-to-br from-purple-100/30 via-blue-100/30 to-cyan-100/30'
        }`} />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              darkMode ? 'bg-cyan-400/30' : 'bg-purple-400/30'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
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

      {/* Header (Fixed) */}
      <header className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-[#155eab]/60 border-[#155eab] bg-clip-padding backdrop-filter backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center"
              >
                <div className="w-6 h-6 border-2 border-white rounded-full border-dashed" />
              </motion.div>
              <h1 className={`text-xl font-bold text-purple-700
`}>
                Quantum Bucket
              </h1>
            </div>

            {/* Desktop Navigation + Profile (Unified) */}
            <div className="hidden md:flex items-center space-x-8 w-full justify-end">
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.to}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                        darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-white hover:text-cyan-100 hover:bg-blue-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>
              {/* Profile, Logout, Settings, DarkMode */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || '/quantum-computing.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className={`hidden sm:block ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user?.displayName || 'Quantum User'}
                </span>
                <button
                  onClick={onLogout}
                  className={`ml-2 px-3 py-1 rounded-lg font-medium transition-all duration-200 border border-red-400 flex items-center space-x-1 shadow-sm hover:scale-105 ${
                    darkMode
                      ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20 border-red-500'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-400'
                  }`}
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode
                      ? 'text-yellow-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 left-0 z-40 w-64 backdrop-blur-md border-r md:hidden ${
              darkMode 
                ? 'bg-gray-900/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            }`}
          >
            <div className="p-6 space-y-4 mt-16">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.to}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                      darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-white hover:text-cyan-100 hover:bg-blue-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content (add padding for fixed header) */}
      <main className="relative z-10 pt-20">
        {children}
      </main>

  {/* QVFooter: Modern, responsive, interactive footer */}
  <QVFooter />
    </div>
  );
}