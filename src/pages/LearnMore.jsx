import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Globe, Users } from "lucide-react";

export default function LearnMore({ darkMode }) {
  return (
    <section
      className={`min-h-screen py-20 px-6 ${
        darkMode ? "bg-transparent text-gray-100" : "bg-transparent text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Learn More About Quantum Computing
        </motion.h1>

        {/* Intro */}
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          Quantum computing is a rapidly growing field that harnesses the laws
          of quantum mechanics to solve problems that are too complex for
          classical computers. Explore its foundations, applications, and global
          community resources below.
        </p>

        {/* Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* What is Quantum Computing */}
          <motion.div
            className="p-6 rounded-2xl shadow-md bg-white/70 dark:bg-gray-500/300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-8 h-8 text-indigo-500" />
              <h2 className="text-2xl font-semibold">
                What is Quantum Computing?
              </h2>
            </div>
            <p>
              Quantum computing uses qubits, superposition, and entanglement to
              process information in ways impossible for classical systems. It
              promises exponential speed-ups for specific problems like
              cryptography, drug discovery, and optimization.
            </p>
          </motion.div>

          {/* Applications */}
          <motion.div
            className="p-6 rounded-2xl shadow-md bg-white/70 dark:bg-gray-500/300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-semibold">Applications</h2>
            </div>
            <p>
              From simulating molecules to optimizing financial systems and
              advancing AI, quantum computing is set to revolutionize multiple
              industries. Major companies like IBM, Google, and Microsoft are
              leading research in this domain.
            </p>
          </motion.div>

          {/* Resources */}
          <motion.div
            className="p-6 rounded-2xl shadow-md bg-white/70 dark:bg-gray-500/300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-semibold">Learning Resources</h2>
            </div>
            <p className="mb-3">
              Explore beginner-friendly and advanced resources to deepen your
              understanding:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="https://qiskit.org/learn"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Qiskit Textbook
                </a>
              </li>
              <li>
                <a
                  href="https://quantum.country/"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quantum Country
                </a>
              </li>
              <li>
                <a
                  href="https://www.coursera.org/specializations/quantum-computing"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coursera Quantum Computing Specialization
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            className="p-6 rounded-2xl shadow-md bg-white/70 dark:bg-gray-700/200"
            whileHover={{ scale: 1.15 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-pink-500" />
              <h2 className="text-2xl font-semibold">Join the Community</h2>
            </div>
            <p>
              Connect with researchers, developers, and enthusiasts around the
              globe. Participate in hackathons, summer schools, and open-source
              projects to strengthen your skills.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
