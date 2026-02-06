import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  Star,
  Palette,
  Globe,
  Download,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function SettingsSidebar({ isOpen, onClose, darkMode, user, onLogout }) {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', description: 'Manage your personal information' },
        { icon: Bell, label: 'Notifications', description: 'Configure your notification preferences' },
        { icon: Shield, label: 'Privacy & Security', description: 'Control your privacy settings' },
      ]
    },
    {
      title: 'Subscription',
      items: [
        { icon: CreditCard, label: 'Billing & Plans', description: 'Manage your subscription and billing' },
        { icon: Star, label: 'Upgrade to Pro', description: 'Unlock premium quantum features', highlight: true },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Appearance', description: 'Customize your interface theme' },
        { icon: Globe, label: 'Language & Region', description: 'Set your language preferences' },
        { icon: Download, label: 'Data Export', description: 'Download your quantum data' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support' },
        { icon: FileText, label: 'Documentation', description: 'Browse our comprehensive docs' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-96 z-50 backdrop-blur-xl border-l shadow-2xl ${
              darkMode
                ? 'bg-gray-900/95 border-gray-700'
                : 'bg-white/95 border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className={`flex items-center space-x-3 p-3 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <img
                  src={user?.photoURL || '/quantum-computing.png'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.displayName || 'Quantum User'}
                  </p>
                  <p className={`text-sm truncate ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user?.email || 'user@quantum.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {settingsGroups.map((group, groupIndex) => (
                <div key={group.title}>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((item, itemIndex) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                        className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:scale-102 ${
                          item.highlight
                            ? 'bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 hover:from-purple-600/20 hover:to-cyan-600/20'
                            : darkMode
                              ? 'hover:bg-gray-800/50'
                              : 'hover:bg-gray-100/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            item.highlight
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-500'
                              : darkMode
                                ? 'bg-gray-700'
                                : 'bg-gray-200'
                          }`}>
                            <item.icon className={`w-4 h-4 ${
                              item.highlight ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="text-left">
                            <p className={`font-medium ${
                              item.highlight
                                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent'
                                : darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.label}
                            </p>
                            <p className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <motion.button
                onClick={onLogout}
                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl font-medium transition-all duration-200 hover:scale-102 ${
                  darkMode
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </motion.button>
              
              <div className="mt-4 text-center">
                <p className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Quantum Bucket v2.1.0
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}