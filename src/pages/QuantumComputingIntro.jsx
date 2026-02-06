import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Atom, GitBranch, ArrowRight, PlayCircle, BarChart2, Eye, Layers, UserCheck } from "lucide-react";

const keyConcepts = [
  {
    icon: <Atom className="w-8 h-8 text-purple-500 dark:text-cyan-400" />,
    title: "Qubit",
    desc: "The basic unit of quantum information."
  },
  {
    icon: <Layers className="w-8 h-8 text-pink-500 dark:text-blue-400" />,
    title: "Superposition",
    desc: "A qubit can be in a mixture of states at once."
  },
  {
    icon: <GitBranch className="w-8 h-8 text-amber-500 dark:text-amber-300" />,
    title: "Entanglement",
    desc: "Qubits can be linked together, creating correlations that classical bits cannot."
  },
  {
    icon: <Eye className="w-8 h-8 text-green-500 dark:text-cyan-300" />,
    title: "Measurement",
    desc: "Reading a qubit collapses it into either 0 or 1 with certain probabilities."
  },
  {
    icon: <PlayCircle className="w-8 h-8 text-blue-500 dark:text-purple-300" />,
    title: "Quantum Gates",
    desc: "Operations that change the state of qubits, similar to logic gates in classical computers."
  }
];

const steps = [
  {
    icon: <UserCheck className="w-7 h-7 text-purple-500 dark:text-cyan-400" />,
    title: "Choose the number of qubits",
    desc: "Start with a single qubit or experiment with multiple qubits."
  },
  {
    icon: <Layers className="w-7 h-7 text-pink-500 dark:text-blue-400" />,
    title: "Set the initial state",
    desc: "Define whether your qubits begin in |0⟩, |1⟩, or a custom state."
  },
  {
    icon: <Sparkles className="w-7 h-7 text-amber-500 dark:text-amber-300" />,
    title: "Apply quantum gates",
    desc: "Drag and drop gates like X, H, or CNOT to build your circuit."
  },
  {
    icon: <PlayCircle className="w-7 h-7 text-blue-500 dark:text-purple-300" />,
    title: "Simulate or Run",
    desc: "See your circuit in action using our simulator or real quantum hardware."
  },
  {
    icon: <BarChart2 className="w-7 h-7 text-green-500 dark:text-cyan-300" />,
    title: "Analyze the results",
    desc: "View probability distributions, Bloch sphere visualizations, and circuit outputs."
  }
];

export default function QuantumComputingIntro() {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🌟 What is Quantum Computing?
      </motion.h2>
      <motion.p
        className="text-lg text-center mb-10 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Quantum computing is a new way of processing information that uses the principles of quantum mechanics. Instead of using classical bits (0 or 1), quantum computers use <span className="font-semibold text-purple-600 dark:text-cyan-400">qubits</span>, which can exist in a superposition of 0 and 1 at the same time. This makes them powerful for solving problems that are extremely hard for traditional computers.
      </motion.p>

      <motion.h3
        className="text-2xl font-bold mb-4 text-center mt-12 bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        🧩 Key Concepts to Know
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {keyConcepts.map((concept, i) => (
          <motion.div
            key={concept.title}
            className="flex flex-col items-center bg-white/70 dark:bg-gray-900/60 rounded-xl shadow-lg p-6 border border-purple-100 dark:border-gray-800 hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          >
            {concept.icon}
            <h4 className="mt-3 text-lg font-semibold text-purple-700 dark:text-cyan-300">{concept.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-1">{concept.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.h3
        className="text-2xl font-bold mb-4 text-center mt-12 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        🚀 How to Use Our Platform
      </motion.h3>
      <ol className="space-y-6 max-w-2xl mx-auto">
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className="flex items-start space-x-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md border border-purple-100 dark:border-gray-800"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          >
            <span className="flex-shrink-0">{step.icon}</span>
            <div>
              <h5 className="font-semibold text-lg text-purple-700 dark:text-cyan-300 mb-1">{step.title}</h5>
              <p className="text-gray-700 dark:text-gray-400">{step.desc}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
