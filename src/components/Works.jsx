import React, { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { applicationService } from "../service/appService";
import { Search } from "lucide-react"; // 👈 install lucide-react for icons

const StarBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse delay-1000" />
    <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse delay-1500" />
    <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse delay-700" />
    <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-ping" />
    <div className="absolute bottom-1/2 left-1/2 w-1 h-1 bg-yellow-400/20 rounded-full animate-ping" />
  </div>
);

const ProjectCard = ({ index, title, description, images, link }) => {
  const [expanded, setExpanded] = useState(false);
  const image = images?.[0] || "https://via.placeholder.com/480x320";

  const shouldTruncate = description.length > 90;
  const previewDescription = shouldTruncate ? description.slice(0, 90) + "..." : description;

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1, 0.95)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full max-w-xl mx-auto"
    >
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Tilt
          tiltMaxAngleX={6}
          tiltMaxAngleY={7}
          scale={1.07}
          className="bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 border border-yellow-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-yellow-300/70 transition-shadow duration-300 group transform-gpu hover:scale-105 flex flex-col h-full"
        >
          {/* Image Section */}
          <div className="relative h-64 sm:h-72 overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x320";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/70 via-transparent to-transparent" />
          </div>

          {/* Text Section */}
          <div className="p-6 sm:p-8 text-yellow-900 flex flex-col flex-grow">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">
              {title}
            </h3>

            <p className="text-base text-yellow-800 mb-3">
              {expanded || !shouldTruncate ? description : previewDescription}
            </p>

            {shouldTruncate && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded((prev) => !prev);
                }}
                className="text-sm font-semibold text-yellow-600 hover:underline self-start"
              >
                {expanded ? "Show Less ▲" : "Show More ▼"}
              </button>
            )}

            {/* Explore Button */}
            <div className="inline-flex items-center mt-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-300 group-hover:brightness-110">
              <span>Explore Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Tilt>
      </a>
    </motion.div>
  );
};

const Works = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  // debounce typing before fetching
  useEffect(() => {
    const delay = setTimeout(() => {
      const loadApplications = async () => {
        try {
          const response = await applicationService.getApplications(search);
          setApps(response.applications || response); // backend returns { applications }
        } catch (error) {
          console.error("Failed to fetch apps", error);
        } finally {
          setLoading(false);
        }
      };
      loadApplications();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const displayedApps = showAll ? apps : apps.slice(0, 8);

  return (
    <section className="relative bg-gradient-to-b from-cream via-yellow-50 to-yellow-100 py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <StarBackground />

      {/* Header */}
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <p className="text-yellow-600 text-base sm:text-lg font-semibold tracking-widest uppercase">
          Victor Ecosystem
        </p>
        <h2 className="text-yellow-800 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Premium <span className="text-yellow-600">Digital</span> Solutions
        </h2>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-yellow-300 bg-white/70 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-yellow-900 placeholder-yellow-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center px-4 sm:px-0"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {loading ? (
          <p className="text-center col-span-full text-yellow-700">Loading...</p>
        ) : displayedApps.length > 0 ? (
          displayedApps.map((app, index) => (
            <ProjectCard key={app._id} index={index} {...app} />
          ))
        ) : (
          <p className="text-center col-span-full text-yellow-700">No applications found.</p>
        )}
      </motion.div>

      {/* Toggle Button */}
      {apps.length > 8 && (
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-12 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {showAll ? "Show Less ▲" : "Discover More Applications ▼"}
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default Works;
