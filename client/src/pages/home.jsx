import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { AiOutlineSolution } from "react-icons/ai";
import { BsAward } from "react-icons/bs";
import { CgBriefcase } from "react-icons/cg";
import { motion } from "framer-motion";
import heroImage from '../assets/hero.jpg';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-5">

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Drive real change in hiring with{" "}
              <span className="text-[#14B8C4]">real-world</span> challenges
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              A platform where employers create impact-driven problems
              and job seekers prove their value through solutions,
              making opportunity fairer, faster, and more meaningful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
              {!user ? (
                <>
                  <Link
                    to="/login?role=jobseeker"
                    className="px-6 py-3 border border-[#14B8C4] text-cyan-900 font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Start Solving Problems
                  </Link>

                  <Link
                    to="/login?role=employer"
                    className="px-6 py-3 text-white font-semibold rounded-lg bg-[#14B8C4] hover:bg-cyan-400 transition"
                  >
                    Post Challenges
                  </Link>
                </>
              ) : (
                <Link
                  to="/problems"
                  className="px-6 py-3 bg-yellow-500 text-red-900 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Explore Problems
                </Link>
              )}
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center w-full"
          >
            <img
              src={heroImage}
              alt="Hero"
              className="w-full max-w-md md:max-w-lg rounded-2xl shadow-xl"
            />
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="text-center bg-[#efefef] hover:shadow-lg transition p-6 rounded-xl">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-6xl text-[#14B8C4]">
                  <CgBriefcase />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Employers Post Problems
              </h3>
              <p className="text-gray-600">
                Post real business challenges instead of job descriptions
              </p>
            </div>

            <div className="text-center bg-[#efefef] hover:shadow-lg transition p-6 rounded-xl">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl text-[#14B8C4]">
                  <AiOutlineSolution />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Solvers Submit Solutions
              </h3>
              <p className="text-gray-600">
                Demonstrate skills through practical solutions, individually or in teams
              </p>
            </div>

            <div className="text-center bg-[#efefef] hover:shadow-lg transition p-6 rounded-xl">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl text-[#14B8C4]">
                  <BsAward />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Best Solutions Win
              </h3>
              <p className="text-gray-600">
                Top solutions receive job offers, internships, or cash rewards
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;