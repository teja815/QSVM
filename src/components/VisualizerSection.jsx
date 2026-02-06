import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Cpu } from 'lucide-react';
export default function VisualizerSection({ darkMode, onVisualizerClick, showAmplitudeCard }) {
  return (
    <section id="visualizer" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Quantum{' '}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Visualizer
            </span>
          </h2>
          <p
            className={`text-xl mb-12 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Experience quantum mechanics like never before with our interactive
            3D visualizer. Watch quantum states, superposition, and entanglement
            come to life.
          </p>
        </motion.div>

        {/* Visualizer Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`relative p-8 rounded-3xl backdrop-blur-md border overflow-hidden ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/50 border-gray-200'
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10" />

          {/* Floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-30"
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}

          <div className="relative z-10">
            <motion.div
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>

            <h3
              className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Interactive Quantum Simulator
            </h3>

            <p
              className={`text-lg mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Manipulate qubits, create quantum circuits, and observe quantum
              phenomena in our state-of-the-art 3D environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

  {/* Launch Visualizer → /updatedqsv */}
  <Link to="/updatedqsv">
    <motion.button
      className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-700"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative flex items-center justify-center space-x-2">
        <Play className="w-5 h-5" />
        <span>Launch Visualizer</span>
      </span>
    </motion.button>
  </Link>

              {/* View Demo (navigate to /view-demo) */}
              <Link to="/view-demo">
                <motion.button
                  className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-200 ${
                    darkMode
                      ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-white hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:bg-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Demo
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
        {/* State Amplitude to Circuit Generator Card (if enabled) */}
        {showAmplitudeCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`rounded-2xl shadow-lg border p-8 flex flex-col items-center gap-6 max-w-xl mx-auto mt-12 ${
              darkMode
                ? 'bg-blue-900/60 border-cyan-900'
                : 'bg-white/0 border-gray-200'
            }`}
          >
            <Cpu className="w-16 h-16 text-pink-500 dark:text-cyan-400 animate-pulse" />
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>State Amplitude to Circuit Generator</h3>
            <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Input your target quantum state amplitudes and get a step-by-step quantum circuit that prepares it. Great for learning, research, and experimentation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/updatedqsv">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-cyan-600 text-white rounded-xl font-semibold text-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Circuit Generator</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}