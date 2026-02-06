import React from "react";
import { logout } from "../firebase";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Cpu, ExternalLink, Play } from "lucide-react";
// Add these import statements
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import VisualizerSection from "../components/VisualizerSection";
import DocumentationSection from "../components/DocumentationSection";
import ContactSection from "../components/ContactSection";
import QuantumChatbot from "../components/QuantumChatbot";


export default function Home({ user, darkMode, toggleDarkMode }) {
  // Visualizer route removed; no-op placeholder kept in case other components expect it
  const handleVisualizerClick = () => {
    // Visualizer removed. This action is intentionally left blank.
    console.info('Visualizer route removed');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    >


      {/* Existing Sections */}
  <HeroSection darkMode={darkMode} />
      <AboutSection darkMode={darkMode} />

      <VisualizerSection
        darkMode={darkMode}
        
        showAmplitudeCard={true}
      />

      <DocumentationSection darkMode={darkMode} />
      <ContactSection darkMode={darkMode} />

      <QuantumChatbot darkMode={darkMode} />

    </Layout>
  );
}