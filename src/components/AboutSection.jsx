import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Cpu, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutSection({ darkMode }) {
  const features = [
    {
      icon: Atom,
      title: 'Quantum Mechanics',
      description: 'Explore the fundamental principles of quantum mechanics through interactive simulations.',
      gradient: 'from-purple-500 to-pink-500',
      link: '/quantum-mech'
    },
    {
      icon: Cpu,
      title: 'Quantum Computing',
      description: 'Understand quantum algorithms and their applications in modern computing.',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/quantum-computing'
    },
    {
      icon: Zap,
      title: 'Real-time Visualization',
      description: 'Watch quantum states evolve in real-time with our advanced visualization engine.',
      gradient: 'from-green-500 to-teal-500',
      link: '/real-time'
    },
    {
      icon: Globe,
      title: 'about Qpioneers',
      description: 'Join researchers and enthusiasts from around the world in quantum exploration.',
      gradient: 'from-orange-500 to-red-500',
      link: '/community'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            About{' '}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Quantum Bucket
            </span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Quantum Bucket is a revolutionary platform that makes quantum computing accessible
            through stunning visualizations and interactive experiences.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link key={feature.title} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative group p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500'
                    : 'bg-white/50 border-gray-200 hover:border-purple-300'
                }`}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
