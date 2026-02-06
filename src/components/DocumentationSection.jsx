import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Lightbulb, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DocumentationSection({ darkMode }) {
  const docs = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of quantum ,how to use our platform.',
      color: 'from-blue-500 to-cyan-500',
      link: '/getting-started',
    },
    {
      icon: Code,
      title: 'Quantum Algorithms',
      description: 'quantum algorithms with live simulations and applications.',
      color: 'from-purple-500 to-pink-500',
      link: '/api',
    },
    {
      icon: Lightbulb,
      title: 'bullets news/updates',
      description: 'stay updated with the latest current affairs in quantum computing.',
      color: 'from-green-500 to-teal-500',
      link: '/tutorials',
    },
    {
      icon: Download,
      title: 'Resources',
      description: 'Download quantum computing papers, datasets, and tools.',
      color: 'from-orange-500 to-red-500',
      link: '/resources',
    },
  ];

  return (
    <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Documentation &{' '}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Everything you need to master quantum computing, from beginner tutorials
            to advanced research papers.
          </p>
        </motion.div>

        {/* Docs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {docs.map((doc, index) => (
            <Link key={doc.title} to={doc.link}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative group cursor-pointer p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500'
                    : 'bg-white/50 border-gray-200 hover:border-purple-300'
                }`}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${doc.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${doc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <doc.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {doc.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {doc.description}
                </p>

                {/* Hover Arrow / Reference Link */}
                <motion.div
                  className={`mt-4 flex items-center text-sm font-medium transition-colors duration-200 ${
                    darkMode
                      ? 'text-cyan-400 group-hover:text-purple-400'
                      : 'text-purple-600 group-hover:text-cyan-600'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Explore →
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
