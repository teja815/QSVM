 import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedBg from "./AnimatedBg";

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 rounded-lg border bg-white/60 dark:bg-slate-800/60 transition hover:scale-105"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default function Layout({ children }) {
  const [dark, setDark] = useState(
    localStorage.getItem("qsv-theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("qsv-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-black">
      <AnimatedBg dark={dark} />

      <header className="w-full sticky top-0 z-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="font-extrabold text-2xl bg-gradient-to-r from-purple-500 to-pink-500 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent"
          >
            QSV
          </Link>
          <nav className="flex gap-3 items-center text-sm font-medium">
            <Link to="/learn">Learn</Link>
            <Link to="/view-demo">Demo</Link>
            <Link to="/quantum-mech">QM</Link>
            <Link to="/quantum-computing">QC</Link>
            <Link to="/real-time">Real-Time</Link>
            <Link to="/community">Community</Link>
            <Link to="/getting-started">Start</Link>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/api">API</Link>
            <Link to="/resources">Resources</Link>
            <ThemeToggle dark={dark} setDark={setDark} />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © QSV {new Date().getFullYear()}
      </footer>
    </div>
  );
}
