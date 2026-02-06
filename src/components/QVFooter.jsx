import React, { useState } from "react";
import { FaGoogle, FaTelegramPlane, FaLinkedin } from "react-icons/fa";

export default function QVFooter() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => setOpenSection(openSection === section ? null : section);

  return (
  <footer className="text-white pt-12 pb-4 px-4 md:px-12 transition-colors duration-500 bg-white dark:bg-gradient-to-br dark:from-[#1a002b] dark:to-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding Section */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-12 w-12 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-2xl">
              NT
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Team Tecz_</h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Powered by Innovation, Collaboration, and Quantum Thinking</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-400 bg-white dark:bg-transparent rounded-xl p-2">
            A student-driven hackathon team working on advanced quantum computing challenges and fostering innovation in the next generation of tech leaders.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-4 cursor-pointer md:cursor-default" onClick={() => toggleSection("quick")}>Quick Links</h3>
          <ul className={`space-y-2 text-sm ${openSection === "quick" || !openSection ? "block" : "hidden md:block"}`}>
            <li className="relative group">
              <a href="#" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">About us</a>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
                <div className="font-semibold mb-1">Team Members</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Teja-Team lead</li>
                  <li>Mani</li>
                  <li>Gargija</li>
                  <li>Haritha</li>
                  <li>Leela</li>
                  <li>Poornima</li>
                </ul>
              </div>
            </li>
           <li>
  <a href="/quantum-news" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">
    quantum current affairs
  </a>
</li>
            <li className="relative group">
              <a href="#" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">Contact Us</a>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
                <div className="font-semibold mb-1">Contact Number</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>9392522941</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* Updates */}
        <div>
          <h3 className="font-semibold text-white mb-4 cursor-pointer md:cursor-default" onClick={() => toggleSection("updates")}>AQVH-2K25</h3>
          <ul className={`space-y-2 text-sm ${openSection === "updates" || !openSection ? "block" : "hidden md:block"}`}>
             <li><a href="https://iic.apsche.ap.gov.in/" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">official  hackathon site</a></li>
            <li><a href="#" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">News & Announcements</a></li>
            <li><a href="#" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">Events & Workshops</a></li>

           <li><a href="https://www.youtube.com/live/jBS_APFMjAg?si=f_HpDPjD1Ue-_yEi" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">Bootcamp of aqvh</a></li>

            <li><a href="https://www.iaair.ai/iaair-fall-2025-internships" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">Careers & Internships</a></li>
            <li><a href="https://docs.google.com/document/d/1Igs4xb68w4V2kP-Cd7vs8oS6E5NMEdsSyd2flfGfjQU/edit?usp=sharing" className="text-white hover:underline hover:text-cyan-400 transition-colors duration-200">Research Highlights</a></li>
          </ul>
        </div>

        {/* Explore More */}
        <div>
          {/* Explore More section removed as requested */}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-10 pt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Info Links */}
          <div className="text-xs space-y-2 mb-4 md:mb-0">
            <p>
              <a href="#" className="hover:underline hover:text-cyan-400 transition-colors duration-200">Sitemap</a> |{' '}
              <a href="#" className="hover:underline hover:text-cyan-400 transition-colors duration-200">Privacy Policy</a> |{' '}
              <a href="#" className="hover:underline hover:text-cyan-400 transition-colors duration-200">Terms of Service</a> |{' '}
              <a href="#" className="hover:underline hover:text-cyan-400 transition-colors duration-200">Accessibility</a>
            </p>
           
          </div>

          {/* Social Icons */}
          <div className="flex space-x-5 text-xl">
            <a
              href="https://share.google/dpiURKUG2GrbdXXxs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition transform hover:scale-110 hover:shadow-cyan-400/40"
              title="Google"
            >
              <FaGoogle />
            </a>
            <a
              href="https://telegram.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500 transition transform hover:scale-110 hover:shadow-cyan-400/40"
              title="Telegram"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://www.linkedin.com/in/neelapu-teja/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition transform hover:scale-110 hover:shadow-cyan-400/40"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>© 2025 @Teamtecz_. All Rights Reserved.</p>
          <p>
            Designed & Maintained by{' Team tecz_'}
            <span className="text-purple-400">Quantum Valley Hackathon Team tecz_</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
