import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700  py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bridge the Skill Gap with Real Problems
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Employers post real challenges. Job seekers demonstrate skills through solutions. 
            Find perfect matches beyond traditional resumes.
          </p>
          <div className="space-x-4">
            {!user ? (
              <>
                <Link to="/register?role=jobseeker" className=" bg-cyan-500 p-2 rounded-lg text-white hover:bg-cyan-400/100 backdrop-blur-lg">
                  Start Solving Problems
                </Link>
                <Link to="/register?role=employer" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                  Post Challenges
                </Link>
              </>
            ) : (
              <Link to="/problems" className="btn-primary bg-cyan-500 text-white hover:bg-gray-100">
                Explore Problems
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Employers Post Problems</h3>
              <p className="text-gray-600">Post real business challenges instead of job descriptions</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Solvers Submit Solutions</h3>
              <p className="text-gray-600">Demonstrate skills through practical solutions, individually or in teams</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Solutions Win</h3>
              <p className="text-gray-600">Top solutions receive job offers, internships, or cash rewards</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;