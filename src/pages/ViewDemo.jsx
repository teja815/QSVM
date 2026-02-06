import React from "react";
import { motion } from "framer-motion";

export default function ViewDemo({ darkMode }) {
  return (
    <section
      className={`min-h-screen py-20 px-6 flex flex-col items-center justify-center ${
        darkMode ? "bg-transparent text-white" : "bg-transparent text-blue-800/60"
      }`}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        View Demo
      </motion.h1>

      <motion.div
        className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Replace src with your demo video */}
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/QklXNk3VLz0"
          title="Quantum Demo"
          frameBorder="0"
          allowFullScreen
        />
      </motion.div>

      <p className="mt-6 text-lg max-w-2xl text-center">
        Explore our interactive quantum state visualizer demo and learn how
        qubits behave in real time.
      </p>
    </section>
  );
}
