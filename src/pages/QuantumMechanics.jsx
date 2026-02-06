import React from "react";
import { motion } from "framer-motion";
import { Atom, GitBranch, Layers, Eye, PlayCircle, BarChart2, Zap, Link2, AlertTriangle, Info, ExternalLink } from "lucide-react";

const features = [
  {
    icon: <Atom className="w-8 h-8 text-purple-500 dark:text-cyan-400" />, 
    title: "Qubits & Superposition",
    desc: (
      <>
        Rotate <a href="https://www.google.com/search?q=qubit" target="_blank" rel="noopener noreferrer" className="underline text-purple-600 dark:text-cyan-400 hover:text-pink-500">qubits</a> on the <a href="https://www.google.com/search?q=Bloch+sphere" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-cyan-300 hover:text-pink-500">Bloch sphere</a> and see probabilities change.
      </>
    )
  },
  {
    icon: <GitBranch className="w-8 h-8 text-amber-500 dark:text-amber-300" />, 
    title: "Entanglement",
    desc: (
      <>
        Create <a href="https://www.google.com/search?q=Bell+state" target="_blank" rel="noopener noreferrer" className="underline text-amber-600 dark:text-amber-300 hover:text-pink-500">Bell states</a> and observe how qubits become correlated.
      </>
    )
  },
  {
    icon: <PlayCircle className="w-8 h-8 text-blue-500 dark:text-purple-300" />, 
    title: "Quantum Gates",
    desc: (
      <>
        Drag and drop gates like <a href="https://www.google.com/search?q=Hadamard+gate" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-cyan-300 hover:text-pink-500">H</a>, <a href="https://www.google.com/search?q=Pauli-X+gate" target="_blank" rel="noopener noreferrer" className="underline text-pink-600 dark:text-pink-300 hover:text-blue-500">X</a>, and <a href="https://www.google.com/search?q=CNOT+gate" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-green-300 hover:text-pink-500">CNOT</a> to build circuits.
      </>
    )
  },
  {
    icon: <Eye className="w-8 h-8 text-green-500 dark:text-cyan-300" />, 
    title: "Measurement",
    desc: (
      <>
        Run multiple <a href="https://www.google.com/search?q=quantum+measurement" target="_blank" rel="noopener noreferrer" className="underline text-green-600 dark:text-cyan-300 hover:text-pink-500">shots</a> and view outcome distributions.
      </>
    )
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-red-500 dark:text-yellow-300" />, 
    title: "Noise Effects",
    desc: (
      <>
        Add realistic <a href="https://www.google.com/search?q=quantum+noise" target="_blank" rel="noopener noreferrer" className="underline text-red-600 dark:text-yellow-300 hover:text-pink-500">errors</a> to see how quantum states degrade.
      </>
    )
  }
];

const benefits = [
  {
    icon: <Zap className="w-7 h-7 text-pink-500 dark:text-yellow-400" />, 
    title: "Visualize Evolution",
    desc: "See how qubits evolve step by step."
  },
  {
    icon: <Layers className="w-7 h-7 text-blue-500 dark:text-cyan-400" />, 
    title: "Build Circuits",
    desc: "Create and run simple quantum algorithms."
  },
  {
    icon: <BarChart2 className="w-7 h-7 text-green-500 dark:text-cyan-300" />, 
    title: "Compare Results",
    desc: "See ideal vs. noisy simulation outcomes."
  },
  {
    icon: <Info className="w-7 h-7 text-purple-500 dark:text-cyan-400" />, 
    title: "Learn by Doing",
    desc: "Experiment interactively to master quantum concepts."
  }
];

export default function QuantumMechanics({ darkMode }) {
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
            Quantum Mechanics
          </span>
        </motion.h1>
        <motion.p
          className={`text-xl max-w-3xl mx-auto text-center mb-10 ${darkMode ? "text-gray-300" : "light-body"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span role="img" aria-label="galaxy"></span> Explore quantum mechanics with interactive simulations. Learn the core principles by experimenting in real time. Our platform makes abstract concepts easy to understand through hands-on visual tools.
        </motion.p>

        <motion.h2
          className="text-2xl font-bold text-center mt-12 mb-6 bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          What You Can Explore
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 border ${darkMode ? 'border-gray-800' : 'border-blue-100'} hover:scale-105 transition-transform group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <span className="mb-2 animate-bounce group-hover:animate-spin-slow">{f.icon}</span>
              <h4 className={`mt-1 text-lg font-semibold ${darkMode ? 'text-cyan-300' : 'text-blue-700'}`}>{f.title}</h4>
              <p className={`text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.h2
          className="text-2xl font-bold text-center mt-12 mb-6 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Why It’s Useful
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              className={`flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md border ${darkMode ? 'border-gray-800' : 'border-purple-200'} hover:scale-120 transition-transform`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <span className="mb-2">{b.icon}</span>
              <h4 className="mt-1 text-lg font-semibold text-purple-700 dark:text-cyan-300">{b.title}</h4>
              <p className={`text-center mt-1 ${!darkMode ? 'text-black' : 'text-gray-400'}`}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://en.wikipedia.org/wiki/Quantum_mechanics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-amber-500 transition-all text-lg"
          >
            <ExternalLink className="w-5 h-5" />
            Learn More on Wikipedia
          </a>
        </div>
      </div>
    </section>
  );
}
