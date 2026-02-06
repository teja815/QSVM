import React from "react";
import { motion } from "framer-motion";
import { FileText, Database, Wrench, Book, Code } from "lucide-react";

export default function Resources({ darkMode }) {
  const resources = [
    {
      title: "Research Papers",
      description:
        "Access academic papers and publications in quantum computing, quantum algorithms, and quantum information science.",
      icon: <FileText className="w-8 h-8 text-indigo-500" />,
      links: [
        {
          name: "arXiv Quantum Physics",
          url: "https://arxiv.org/archive/quant-ph",
        },
        {
          name: "Nature Quantum Information",
          url: "https://www.nature.com/natquantuminfo/",
        },
        {
          name: "Physical Review A",
          url: "https://journals.aps.org/pra/",
        },
      ],
    },
    {
      title: "Datasets",
      description:
        "Download datasets for quantum machine learning, quantum chemistry, and optimization problems.",
      icon: <Database className="w-8 h-8 text-green-500" />,
      links: [
        {
          name: "IBM Quantum Dataset Hub",
          url: "https://quantum-computing.ibm.com/",
        },
        {
          name: "Pennylane Datasets",
          url: "https://pennylane.ai/datasets/",
        },
        {
          name: "Kaggle Quantum Challenge",
          url: "https://www.kaggle.com/search?q=quantum",
        },
      ],
    },
    {
      title: "Tools & Frameworks",
      description:
        "Practical tools and frameworks for building and simulating quantum circuits.",
      icon: <Wrench className="w-8 h-8 text-yellow-500" />,
      links: [
        { name: "Qiskit (IBM)", url: "https://qiskit.org/" },
        { name: "Cirq (Google)", url: "https://quantumai.google/cirq" },
        { name: "Ocean (D-Wave)", url: "https://docs.ocean.dwavesys.com/" },
        { name: "PennyLane", url: "https://pennylane.ai/" },
      ],
    },
    {
      title: "Books & Learning",
      description:
        "Comprehensive books, courses, and interactive guides for learning quantum computing.",
      icon: <Book className="w-8 h-8 text-pink-500" />,
      links: [
        {
          name: "Quantum Computing for Everyone (MIT Press)",
          url: "https://mitpress.mit.edu/9780262539530/quantum-computing-for-everyone/",
        },
        {
          name: "Quantum Country",
          url: "https://quantum.country/",
        },
        {
          name: "Coursera Quantum Computing Specialization",
          url: "https://www.coursera.org/specializations/quantum-computing",
        },
      ],
    },
    {
      title: "Libraries & GitHub",
      description:
        "Explore open-source projects and quantum libraries for research and development.",
      icon: <Code className="w-8 h-8 text-blue-500" />,
      links: [
        {
          name: "Awesome Quantum Computing (GitHub)",
          url: "https://github.com/desireevl/awesome-quantum-computing",
        },
        { name: "ProjectQ", url: "https://projectq.ch/" },
        {
          name: "TensorFlow Quantum",
          url: "https://www.tensorflow.org/quantum",
        },
      ],
    },
  ];

  return (
    <section
      className={`min-h-screen py-20 px-6 ${
        darkMode ? "bg-transparent text-gray-100" : "light-mode-theme"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h1
          className={`text-4xl md:text-5xl font-bold mb-6 text-center ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Resources
        </motion.h1>

        <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${darkMode ? "text-gray-300" : "light-body"}`}>
          Download research papers, datasets, tools, and other learning material
          for quantum computing.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl shadow-md border ${darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-violet-300'}`}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {res.icon}
                <h2 className={`text-xl font-semibold ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>{res.title}</h2>
              </div>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "light-body"}`}>{res.description}</p>
              <ul className="space-y-2">
                {res.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
