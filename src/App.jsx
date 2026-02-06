import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { auth, handleRedirectResult } from "./firebase";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";
import ViewDemo from "./pages/ViewDemo";
import QuantumMechanics from "./pages/QuantumMechanics";
import QuantumComputing from "./pages/QuantumComputing";
import RealTime from "./pages/RealTime";
import Community from "./pages/Community";
import GettingStarted from "./pages/GettingStarted";
import APIReference from "./pages/APIReference";
import Tutorials from "./pages/Tutorials";
import Resources from "./pages/Resources";
import QuantumNews from "./pages/QuantumNews";
import UpdatedQSV from "./pages/UpdatedQSV";


//import './styles/App.css';

// Layout Wrapper
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Global Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };
    checkRedirect();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-10 h-10 border-4 border-white border-dashed rounded-full" />
          </div>
          <p className="text-white text-lg">Loading Quantum Bucket...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/"
          element={
            user ? (
              <Home
                user={user}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Connected Pages */}
        <Route
          path="/learn"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <LearnMore darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/view-demo"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <ViewDemo darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/updatedqsv"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <UpdatedQSV darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quantum-mech"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <QuantumMechanics darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quantum-computing"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <QuantumComputing darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/real-time"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <RealTime darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/community"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Community darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/getting-started"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <GettingStarted darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/api"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <APIReference darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/tutorials"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Tutorials darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/resources"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Resources darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quantum-news"
          element={
            user ? (
              <Layout user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <QuantumNews darkMode={darkMode} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
  {/* Quantum Visualizer route removed per request */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
