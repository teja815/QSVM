 import React from "react";
import { motion } from "framer-motion";

export default function PageTemplate({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-cyan-400 dark:to-blue-500">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
      )}
      <div>{children}</div>
    </motion.div>
  );
}
