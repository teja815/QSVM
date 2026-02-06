import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, Zap, Layers, BarChart2, GitBranch, PlayCircle, Code, Info, ExternalLink, BookOpen, Settings, Share2, Search, Cpu, ChevronDown, Copy, Download, Users
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-blue-600 dark:text-cyan-400" />, 
    title: "Real-time Simulation",
    desc: "Apply gates to qubits and instantly see the updated quantum state. State vectors and Bloch spheres refresh dynamically.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-600 dark:text-cyan-300" />,
    title: "Multi-Qubit Support",
    desc: "Supports 1 to n qubits, with state space dimension 2^n. Displays full state vector and probability distributions.",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-green-600 dark:text-emerald-400" />,
    title: "Visualization Options",
    desc: "Amplitude Bar Chart, Phase Coloring, Bloch Sphere, and Circuit Timeline for stepwise playback.",
  },
  {
    icon: <Code className="w-8 h-8 text-purple-600 dark:text-fuchsia-400" />,
    title: "Export & Integration",
    desc: "Export circuits as OpenQASM or Qiskit code. Share interactive circuit links with collaborators.",
  },
  {
    icon: <Settings className="w-8 h-8 text-orange-600 dark:text-amber-300" />,
    title: "Noise Models",
    desc: "Apply Qiskit Aer noise models including depolarizing, phase damping, and bit-flip errors to simulate real hardware conditions.",
  }
];

const keywordLink = (word, url, wiki) => (
  <span className="inline-flex items-center gap-1">
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="light-link font-medium"
    >
      {word}
    </a>
    <a 
      href={wiki} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-cyan-300"
    >
      <ExternalLink className="w-3 h-3" />
    </a>
  </span>
);

export default function RealTime({ darkMode }) {
  const fileInputRef = useRef(null);
  const [exportDropdown, setExportDropdown] = useState(false);
  const [shareDropdown, setShareDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to handle file selection
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}\nCircuit will be loaded and simulated.`);
      // Here you would typically handle the file and load the circuit
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  // Play Circuit Functionality
  const handlePlayCircuit = () => {
    setIsPlaying(true);
    alert("🚀 Starting quantum circuit simulation...\n\nWatch as quantum gates transform the state in real-time!\nPerfect for beginners to understand quantum state evolution.");
    
    // Simulate circuit execution
    setTimeout(() => {
      alert("🎉 Simulation complete!\nYou've successfully run a quantum circuit. Try different gates to see how they affect the quantum state.");
      setIsPlaying(false);
      setCurrentStep(0);
    }, 2000);
  };

  // Step Forward Functionality
  const handleStepForward = () => {
    const steps = ["Initial State |0⟩", "After H gate (creates superposition)", "After CNOT gate (creates entanglement)", "After X gate (flips the qubit)", "Final Measurement (collapses state)"];
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      alert(`🔍 Step ${currentStep + 1}: ${steps[currentStep + 1]}\n\nPerfect for learning! See how each gate changes the quantum state step by step.`);
    } else {
      alert("✅ Great job! You've completed the circuit. Reset to try again or experiment with different gates.");
      setCurrentStep(0);
    }
  };

  // Share Functionality
  const handleShare = () => {
    handleFileSelect();
  };

  // Export Functions
  const handleExportQASM = (version = "2.0") => {
    const qasmCode = `// OpenQASM ${version}
OPENQASM ${version};
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0], q[1];
measure q -> c;`;
    
    // Create and download file
    const blob = new Blob([qasmCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-circuit-${version}.qasm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`💾 Downloaded as OpenQASM ${version}\nReady to use with IBM Quantum Experience and Qiskit!`);
  };

  const handleExportFramework = (framework) => {
    const frameworks = {
      qiskit: {
        code: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

# Create a 2-qubit quantum circuit
qc = QuantumCircuit(2, 2)

# Add gates
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Simulate
simulator = AerSimulator()
compiled_circuit = transpile(qc, simulator)
job = simulator.run(compiled_circuit)
result = job.result()
counts = result.get_counts()
print(counts)`,
        ext: 'py',
        name: 'Qiskit'
      },
      cirq: {
        code: `import cirq

# Create qubits
q0, q1 = cirq.LineQubit.range(2)

# Create circuit
circuit = cirq.Circuit(
    cirq.H(q0),
    cirq.CNOT(q0, q1),
    cirq.measure(q0, q1, key='result')
)

print(circuit)`,
        ext: 'py',
        name: 'Cirq'
      },
      pennylane: {
        code: `import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=2)

@qml.qnode(dev)
def circuit():
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.probs(wires=[0, 1])

print(circuit())`,
        ext: 'py',
        name: 'PennyLane'
      },
      quil: {
        code: `H 0
CNOT 0 1
MEASURE 0 [0]
MEASURE 1 [1]`,
        ext: 'quil',
        name: 'Quil'
      }
    };

    const frameworkData = frameworks[framework];
    if (frameworkData) {
      const blob = new Blob([frameworkData.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum-circuit.${frameworkData.ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`💾 Exported as ${frameworkData.name} script\nReady to run on quantum simulators!`);
    }
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(message);
    });
  };

  // Share Functions - Updated with your tools
  const openQuantumStateVisualizer = () => {
    window.open("https://gargija-murumulla.github.io/QSV/", "_blank");
    alert("🔮 Opening Quantum State Visualizer...\n\nExplore advanced quantum state visualization in a new tab!");
  };

  const openCircuitGenerator = () => {
    alert("⚡ Launching Circuit Generator...\n\nCreate custom quantum circuits with our intuitive drag-and-drop interface!");
  };

  const generateShareLink = () => {
    const shareId = Math.random().toString(36).substr(2, 9);
    const shareUrl = `${window.location.origin}/circuit/${shareId}`;
    copyToClipboard(shareUrl, "🔗 Shareable link copied!\n\nShare this with others to collaborate on your quantum circuit.");
  };

  // Noise Model Functions - Updated with direct Qiskit connections
  const handleNoiseModel = (model) => {
    const noiseModels = {
      "Depolarizing": "Using Qiskit Aer depolarizing error model with single-qubit and two-qubit gate errors",
      "Phase-damping": "Qiskit phase damping noise model with T1 and T2 relaxation times", 
      "Bit-flip": "Qiskit bit-flip error model with configurable probability per gate"
    };
    
    alert(`🔧 Applying ${model} Noise Model:\n\n${noiseModels[model]}\n\nSimulating real quantum hardware imperfections using Qiskit Aer.`);
  };

  return (
    <section className={`min-h-screen py-20 px-4 ${darkMode ? "bg-transparent" : "light-mode-theme"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".qasm,.json,.py,.ipynb"
          className="hidden"
        />
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800/70 border-gray-700" : "bg-blue-50 border-violet-300"}`}>
              <Eye className="w-10 h-10 text-blue-600 dark:text-cyan-400" />
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode
              ? "text-white"
              : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"}`}
          >
            Real-time <span className="gradient-text">Visualization</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "light-body"}`}>
            The Quantum State Visualization Engine allows users to interactively simulate and observe how quantum states evolve as gates are applied. 
            With real-time updates, it helps learners, researchers, and developers understand the dynamics of {" "}
            {keywordLink("superposition", "https://www.google.com/search?q=quantum+superposition", "https://en.wikipedia.org/wiki/Quantum_superposition")}, {" "}
            {keywordLink("entanglement", "https://www.google.com/search?q=quantum+entanglement", "https://en.wikipedia.org/wiki/Quantum_entanglement")}, and {" "}
            {keywordLink("measurement", "https://www.google.com/search?q=quantum+measurement", "https://en.wikipedia.org/wiki/Measurement_in_quantum_mechanics")}.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Demo Preview Card */}
          <motion.div 
            className={`p-8 flex flex-col gap-6 items-center rounded-2xl shadow-md ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'} border`}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center border ${darkMode ? "border-gray-600" : "border-violet-300"}`}>
              <div className="text-center">
                <Cpu className="w-16 h-16 text-blue-600 dark:text-cyan-400 mx-auto mb-4" />
                <p className={`text-lg font-semibold ${darkMode
                  ? "text-gray-300"
                  : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"}`}>
                  Quantum Circuit Visualization
                </p>
                <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "light-body"}`}>
                  {isPlaying ? "⚡ Simulating Quantum Circuit..." : `🎯 Ready - Click buttons below to start!`}
                </p>
              </div>
            </div>
            
          </motion.div>

          {/* Features List Card */}
          <motion.div 
            className={`p-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'} border`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "light-heading"}`}>
              Core Capabilities
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <Info className={`w-6 h-6 mt-0.5 flex-shrink-0 ${darkMode ? "text-cyan-400" : "text-blue-500"}`} />
                <span className={darkMode ? "text-gray-300" : "light-body"}>
                  Single-qubit and multi-qubit quantum systems
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Zap className={`w-6 h-6 mt-0.5 flex-shrink-0 ${darkMode ? "text-yellow-400" : "text-blue-500"}`} />
                <span className={darkMode ? "text-gray-300" : "light-body"}>
                  Comprehensive quantum gate library including X, Y, Z, H, CNOT, SWAP, Toffoli, and rotation gates
                </span>
              </li>
              <li className="flex items-start gap-4">
                <BarChart2 className={`w-6 h-6 mt-0.5 flex-shrink-0 ${darkMode ? "text-green-400" : "text-blue-500"}`} />
                <span className={darkMode ? "text-gray-300" : "light-body"}>
                  Real-time state vector and probability distribution visualization
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Eye className={`w-6 h-6 mt-0.5 flex-shrink-0 ${darkMode ? "text-cyan-400" : "text-blue-500"}`} />
                <span className={darkMode ? "text-gray-300" : "light-body"}>
                  Bloch sphere representation for individual qubit analysis
                </span>
              </li>
              <li className="flex items-start gap-4">
                <PlayCircle className={`w-6 h-6 mt-0.5 flex-shrink-0 ${darkMode ? "text-purple-400" : "text-blue-500"}`} />
                <span className={darkMode ? "text-gray-300" : "light-body"}>
                  Interactive circuit building with step-by-step execution
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Key Features Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "light-heading"}`}>
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`p-6 text-center rounded-2xl shadow-md ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'} border`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-blue-50 border-violet-300"}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "light-heading"}`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? "text-gray-300" : "light-body"}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

    

        {/* Noise Models Section */}
        <motion.div
          className={`p-8 mb-12 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'} border`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <Settings className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-amber-300" : "text-orange-600"}`} />
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "light-heading"}`}>
              Advanced Noise Models
            </h3>
            <p className={darkMode ? "text-gray-300" : "light-body"}>
              Simulate real-world quantum hardware conditions with Qiskit Aer noise models
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <button 
              onClick={() => handleNoiseModel("Depolarizing")}
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-gray-700/50 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-violet-300 hover:bg-gray-100"} transition-colors`}
            >
              <h4 className={`font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Depolarizing
              </h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "light-body"}`}>
                Qiskit Aer depolarizing error model
              </p>
            </button>
            <button 
              onClick={() => handleNoiseModel("Phase-damping")}
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-gray-700/50 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-violet-300 hover:bg-gray-100"} transition-colors`}
            >
              <h4 className={`font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Phase-damping
              </h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "light-body"}`}>
                Qiskit Aer phase damping model
              </p>
            </button>
            <button 
              onClick={() => handleNoiseModel("Bit-flip")}
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-gray-700/50 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-violet-300 hover:bg-gray-100"} transition-colors`}
            >
              <h4 className={`font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Bit-flip
              </h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "light-body"}`}>
                Qiskit Aer bit-flip error model
              </p>
            </button>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="https://en.wikipedia.org/wiki/Quantum_computing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-amber-500 transition-all text-lg"
          >
            <ExternalLink className="w-5 h-5" />
            Explore Quantum Computing
          </a>
        </motion.div>
      </div>
    </section>
  );
}