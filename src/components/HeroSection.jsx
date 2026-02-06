import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection({ darkMode }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* Background Animation */}
      <div className="absolute inset-0">
        {darkMode ? (
          <motion.div
            className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-60"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <div className="w-full h-full bg-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-5xl md:text-7xl font-extrabold mb-6 ${
            darkMode ? "text-white" : "text-emerald-300"
          }`}
        >
          Visualize{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
            Quantum States
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`max-w-2xl mx-auto text-lg md:text-xl ${
            darkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          A next-generation platform for exploring quantum computing through
          interactive visualizations and simulations.
        </motion.p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link to="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 
                bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          <Link to="/view-demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Zap className="w-5 h-5 text-yellow-500" />
              View Demo
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
