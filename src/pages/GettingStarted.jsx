import React from "react";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Cpu, Play, CheckCircle, AlertCircle, Zap, Code, ExternalLink } from "lucide-react";

const steps = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Step 1: Choose Your Qubits",
    description: "Start by selecting the number of qubits for your quantum circuit. Our visualizer supports 1 to 5 qubits, giving you up to 2^n dimensional state space to explore.",
    tips: [
      "Beginners should start with 1-2 qubits to understand basic concepts",
      "Each additional qubit doubles the complexity of the system",
      "Multi-qubit systems allow you to explore entanglement"
    ],
    color: "blue"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Step 2: Set Initial State",
    description: "Define the starting quantum state of your system. Choose from standard basis states like |0⟩ or |1⟩, or create custom superposition states.",
    tips: [
      "Default state is |0⟩ for all qubits",
      "You can set custom amplitudes and phases",
      "The state must be normalized (total probability = 1)"
    ],
    color: "purple"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Step 3: Apply Quantum Gates",
    description: "Build your quantum circuit by applying gates from our comprehensive library. Use single-qubit gates (H, X, Y, Z, S, T) and multi-qubit gates (CNOT, SWAP, Toffoli).",
    tips: [
      "Hadamard (H) gate creates superposition",
      "CNOT gate creates entanglement between qubits",
      "Pauli gates (X, Y, Z) perform rotations",
      "Drag and drop gates onto your circuit diagram"
    ],
    color: "cyan"
  },
  {
    icon: <Play className="w-8 h-8" />,
    title: "Step 4: Run & Visualize",
    description: "Execute your quantum circuit and observe real-time visualizations. See the quantum state evolve through Bloch spheres, state vectors, and probability distributions.",
    tips: [
      "Watch state vectors update in real-time",
      "Bloch sphere shows single-qubit states geometrically",
      "Histogram displays measurement probabilities",
      "Step through circuit gate-by-gate"
    ],
    color: "green"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Step 5: Analyze Results",
    description: "Study the output of your quantum circuit. View measurement statistics, analyze state amplitudes, and download results for further analysis.",
    tips: [
      "Export circuit as OpenQASM or Python code",
      "Download visualizations as images",
      "Share your circuit with others via link",
      "Apply noise models to simulate real hardware"
    ],
    color: "amber"
  }
];

const quickStart = [
  {
    title: "Bell State Creation",
    description: "Create your first entangled state",
    steps: ["Add 2 qubits", "Apply H gate to qubit 0", "Apply CNOT gate (0 → 1)", "Run and observe entanglement"],
    difficulty: "Beginner"
  },
  {
    title: "Quantum Teleportation",
    description: "Implement the quantum teleportation protocol",
    steps: ["Use 3 qubits", "Create Bell pair (qubits 1-2)", "Prepare state on qubit 0", "Apply teleportation circuit"],
    difficulty: "Intermediate"
  },
  {
    title: "Grover's Algorithm",
    description: "Build a quantum search algorithm",
    steps: ["Initialize superposition", "Apply oracle", "Apply diffusion operator", "Measure to find marked state"],
    difficulty: "Advanced"
  }
];

const tools = [
  {
    name: "Quantum State Visualizer",
    description: "Our primary tool for creating and visualizing quantum circuits in real-time",
    link: "https://gargija-murumulla.github.io/QSV/",
    features: ["Real-time state evolution", "Bloch sphere visualization", "Multi-qubit support"]
  },
  {
    name: "Circuit Generator",
    description: "Convert quantum states to circuit representations automatically",
    link: "https://teja815.github.io/state-to-ckt/",
    features: ["State-to-circuit conversion", "Optimized gate sequences", "Export to QASM"]
  }
];

export default function GettingStarted({ darkMode }) {
  return (
    <section className={`min-h-screen py-20 px-4 ${darkMode ? "bg-transparent text-gray-100" : "light-mode-theme"}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800/70 border-gray-700" : "bg-blue-50 border-violet-300"}`}>
              <BookOpen className="w-10 h-10 text-purple-500 dark:text-cyan-400" />
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode
              ? "text-white"
              : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"}`}
          >
            Getting Started with <span className="gradient-text">Quantum Visualization</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "light-body"}`}>
            Your comprehensive guide to building and visualizing quantum circuits. Follow these steps to start your quantum computing journey.
          </p>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl shadow-lg border p-6 ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'
                }`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    darkMode
                      ? `bg-${step.color}-900/50 text-${step.color}-300`
                      : `bg-${step.color}-100 text-${step.color}-700`
                  }`}
                    style={{
                      background: darkMode
                        ? `rgba(${step.color === 'blue' ? '59, 130, 246' : step.color === 'purple' ? '168, 85, 247' : step.color === 'cyan' ? '6, 182, 212' : step.color === 'green' ? '34, 197, 94' : '245, 158, 11'}, 0.2)`
                        : `rgba(${step.color === 'blue' ? '59, 130, 246' : step.color === 'purple' ? '168, 85, 247' : step.color === 'cyan' ? '6, 182, 212' : step.color === 'green' ? '34, 197, 94' : '245, 158, 11'}, 0.1)`,
                      color: darkMode
                        ? `rgb(${step.color === 'blue' ? '147, 197, 253' : step.color === 'purple' ? '216, 180, 254' : step.color === 'cyan' ? '103, 232, 249' : step.color === 'green' ? '134, 239, 172' : '253, 224, 71'})`
                        : `rgb(${step.color === 'blue' ? '29, 78, 216' : step.color === 'purple' ? '126, 34, 206' : step.color === 'cyan' ? '8, 145, 178' : step.color === 'green' ? '22, 163, 74' : '217, 119, 6'})`
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>
                      {step.title}
                    </h3>
                    <p className={`mb-4 ${darkMode ? "text-gray-300" : "light-body"}`}>
                      {step.description}
                    </p>
                    <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className={`w-4 h-4 ${darkMode ? "text-cyan-400" : "text-blue-600"}`} />
                        <span className={`font-semibold text-sm ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>
                          Pro Tips:
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i} className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "light-heading"}`}>
            Quick Start Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStart.map((example, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl shadow-lg border p-6 ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  example.difficulty === "Beginner"
                    ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                    : example.difficulty === "Intermediate"
                    ? darkMode ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-700"
                    : darkMode ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"
                }`}>
                  {example.difficulty}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>
                  {example.title}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "light-body"}`}>
                  {example.description}
                </p>
                <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}>
                  <ol className="space-y-2">
                    {example.steps.map((s, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <span className={`font-semibold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}>
                          {i + 1}.
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "light-heading"}`}>
            Available Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl shadow-lg border p-6 ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <Cpu className={`w-8 h-8 flex-shrink-0 ${darkMode ? "text-cyan-400" : "text-blue-600"}`} />
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>
                      {tool.name}
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "light-body"}`}>
                      {tool.description}
                    </p>
                    <ul className="space-y-1 mb-4">
                      {tool.features.map((feature, i) => (
                        <li key={i} className={`text-sm flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-amber-500 transition-all"
                    >
                      Launch Tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={`rounded-2xl shadow-lg border p-8 text-center ${
            darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Rocket className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-cyan-400" : "text-blue-600"}`} />
          <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "light-heading"}`}>
            Ready to Start?
          </h3>
          <p className={`mb-6 max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "light-body"}`}>
            Begin your quantum computing journey now with our interactive visualizer. Experiment, learn, and explore the fascinating world of quantum mechanics!
          </p>
          <a
            href="https://gargija-murumulla.github.io/QSV/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold shadow-lg hover:from-pink-500 hover:to-amber-500 transition-all text-lg"
          >
            <Play className="w-5 h-5" />
            Launch Quantum Visualizer
          </a>
        </motion.div>
      </div>
    </section>
  );
}
