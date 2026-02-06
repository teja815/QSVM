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
    desc: "Choose gates from Dropdown and select like X, H, or CNOT to build your circuit."
  },
  {
    icon: <PlayCircle className="w-7 h-7 text-blue-500 dark:text-purple-300" />,
    title: "Visualise and Run circuit",
    desc: "Visualise the Q-sphere ,Histograms and Bloch sphere of respective qubits ."
  },
  {
    icon: <BarChart2 className="w-7 h-7 text-green-500 dark:text-cyan-300" />,
    title: "Analyze the results",
    desc: "View probability distributions, Bloch sphere visualizations, and circuit outputs."
  }
];

export default function QuantumComputing({ darkMode }) {
  return (
    <section className={`min-h-screen py-20 px-4 ${darkMode ? "bg-transparent text-white" : "light-mode-theme"}`}>
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className={`text-4xl md:text-5xl font-extrabold text-center mb-6 ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-flex items-center gap-2">
            <Atom className="w-10 h-10 text-blue-600 dark:text-cyan-400 animate-spin-slow" />
            Quantum Computing
          </span>
        </motion.h1>
        <motion.p
          className={`text-xl max-w-3xl mx-auto text-center mb-10 ${darkMode ? "text-gray-300" : "light-body"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Quantum computing is a new way of processing information that uses the principles of quantum mechanics. Instead of using classical bits (0 or 1), quantum computers use <span className="font-semibold text-blue-600 dark:text-cyan-400">qubits</span>, which can exist in a superposition of 0 and 1 at the same time. This makes them powerful for solving problems that are extremely hard for traditional computers.
        </motion.p>

        <motion.h2
          className="text-2xl font-bold text-center mt-12 mb-6 bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Key Concepts to Know
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {keyConcepts.map((concept, i) => (
            <motion.div
              key={concept.title}
              className={`flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 border ${darkMode ? 'border-gray-800' : 'border-blue-100'} hover:scale-105 transition-transform`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              {concept.icon}
              <h4 className={`mt-3 text-lg font-semibold ${darkMode ? 'text-cyan-300' : 'text-blue-700'}`}>{concept.title}</h4>
              <p className={`text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{concept.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.h3
          className="text-2xl font-bold mb-4 text-center mt-12 bg-gradient-to-r from-cyan-900 to-purple-900 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
           How to Use Our Platform
        </motion.h3>
        <ol className="space-y-6 max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              className={`flex items-start space-x-4 rounded-xl p-5 shadow-md border ${darkMode ? 'bg-gray-800 border-gray-800' : 'bg-white border-violet-200'} ${darkMode ? '' : 'text-black'}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <span className="flex-shrink-0">{step.icon}</span>
              <div>
                <h5 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-cyan-300' : 'text-black'}`}>{step.title}</h5>
                <p className={`${darkMode ? 'text-gray-400' : 'text-black'}`}>{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
