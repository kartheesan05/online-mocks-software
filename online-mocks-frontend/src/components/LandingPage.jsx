import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-700 to-blue-600 flex flex-col items-center justify-center p-6">
      {/* Simplified Background Element */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          {/* Single wave animation */}
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full min-w-[1440px] fill-indigo-300"
          >
            <motion.path
              d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,218.7C672,235,768,213,864,186.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,218.7C672,235,768,213,864,186.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,250.7C96,245,192,235,288,202.7C384,171,480,117,576,112C672,107,768,149,864,160C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 20,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-4xl w-full text-center space-y-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Online Mock Placements
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Prepare for your career with realistic interview simulations
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <button className="h-14 px-8 text-lg font-medium rounded-md bg-indigo-500 text-white shadow-lg hover:bg-indigo-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
            HR Login
          </button>
          <button className="h-14 px-8 text-lg font-medium rounded-md border-2 border-indigo-300 text-white bg-transparent hover:bg-indigo-800/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
            Volunteer Login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
