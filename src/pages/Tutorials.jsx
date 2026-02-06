import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Newspaper,
  TrendingUp,
  Zap,
  Award,
  Building2,
  Rocket,
  ExternalLink,
  Calendar,
  Tag
} from "lucide-react";

// -----------------------------------------
//  NEWS CATEGORIES (unchanged)
// -----------------------------------------
const newsCategories = [
  { id: "all", name: "All News", icon: <Newspaper className="w-4 h-4" /> },
  { id: "breakthrough", name: "Breakthroughs", icon: <Zap className="w-4 h-4" /> },
  { id: "hardware", name: "Hardware", icon: <Building2 className="w-4 h-4" /> },
  { id: "algorithms", name: "Algorithms", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "industry", name: "Industry", icon: <Award className="w-4 h-4" /> }
];

export default function QuantumNews({ darkMode }) {
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedNews, setExpandedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  //  FETCH DYNAMIC QUANTUM NEWS (API)
  // -----------------------------------------
  const fetchNews = async () => {
    try {
      const apiKey = "5582a972aad14100816e1a75c4bb4aa4";

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=quantum%20computing&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      );

      const json = await response.json();

      // Convert NewsAPI output → your card format
      const formatted = json.articles.map((item, index) => ({
        id: index + 1,
        category: detectCategory(item.title + " " + item.description),
        title: item.title,
        description: item.description,
        date: new Date(item.publishedAt).toISOString().split("T")[0],
        source: item.source.name,
        link: item.url,
        tags: extractTags(item.title),
        impact: detectImpact(item.title)
      }));

      setNewsData(formatted);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load news:", error);
    }
  };

  // -----------------------------------------
  //  CATEGORY / TAG / IMPACT DETECTORS
  // -----------------------------------------

  const detectCategory = (text) => {
    const t = text.toLowerCase();
    if (t.includes("algorithm") || t.includes("ai")) return "algorithms";
    if (t.includes("chip") || t.includes("qubit") || t.includes("hardware")) return "hardware";
    if (t.includes("research") || t.includes("breakthrough") || t.includes("experiment")) return "breakthrough";
    if (t.includes("company") || t.includes("industry") || t.includes("market")) return "industry";
    return "breakthrough";
  };

  const detectImpact = (text) => {
    const highKeywords = ["breakthrough", "qubit", "record", "new", "major", "revolution"];
    return highKeywords.some(k => text.toLowerCase().includes(k)) ? "high" : "medium";
  };

  const extractTags = (title) => {
    return title.split(" ").slice(0, 3);
  };

  // -----------------------------------------
  //  AUTO-FETCH & AUTO-REFRESH EVERY 60s
  // -----------------------------------------
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // 60 sec refresh
    return () => clearInterval(interval);
  }, []);

  // -----------------------------------------
  //  FILTER NEWS BY CATEGORY
  // -----------------------------------------
  const filteredNews =
    selectedCategory === "all"
      ? newsData
      : newsData.filter((news) => news.category === selectedCategory);

  return (
    <section
      className={`min-h-screen py-20 px-4 ${
        darkMode ? "bg-transparent text-gray-100" : "light-mode-theme"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-xl border ${
                darkMode
                  ? "bg-gray-800/70 border-gray-700"
                  : "bg-blue-50 border-violet-300"
              }`}
            >
              <Newspaper className="w-10 h-10 text-purple-500 dark:text-cyan-400 animate-pulse" />
            </div>
          </div>

          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode
                ? "text-white"
                : "bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent"
            }`}
          >
            Quantum Computing <span className="gradient-text">Live News</span>
          </h1>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-300" : "light-body"
            }`}
          >
            Real-time updates from global sources on quantum computing and quantum
            technologies.
          </p>
        </motion.div>

        {/* CATEGORY FILTER BUTTONS */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {newsCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg scale-105"
                  : darkMode
                  ? "bg-gray-800/70 text-gray-300 border border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border border-violet-300 hover:bg-gray-50"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-xl py-10 animate-pulse">Loading latest quantum news…</p>
        )}

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            filteredNews.map((news, index) => (
              <motion.div
                key={news.id}
                className={`rounded-2xl shadow-lg border overflow-hidden hover:scale-105 transition-all cursor-pointer ${
                  darkMode
                    ? "bg-gray-800/70 border-gray-700"
                    : "bg-white border-violet-300"
                } ${expandedNews === news.id ? "ring-2 ring-purple-500" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                onClick={() =>
                  setExpandedNews(expandedNews === news.id ? null : news.id)
                }
              >
                <div
                  className={`p-1 ${
                    news.impact === "high"
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <Rocket className="w-3 h-3" />
                      {news.impact === "high" ? "HIGH IMPACT" : "FEATURED"}
                    </span>
                    <span className="text-white text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {news.date}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      darkMode ? "text-cyan-300" : "text-blue-700"
                    }`}
                  >
                    {news.title}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      darkMode ? "text-gray-300" : "light-body"
                    }`}
                  >
                    {news.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {news.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          darkMode
                            ? "bg-purple-900/50 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span
                      className={`text-xs font-semibold ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {news.source}
                    </span>
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
                        darkMode
                          ? "text-cyan-400 hover:text-cyan-300"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* EMPTY CATEGORY */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No news available
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
