import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'employer') {
        const response = await axios.get('https://skillsgape.onrender.com/api/problems/my-problems');
        setProblems(response.data);
      } else {
        const submissionsResponse = await axios.get('https://skillsgape.onrender.com/api/submissions/my-submissions');
        setSubmissions(submissionsResponse.data);
        
        const problemsResponse = await axios.get('https://skillsgape.onrender.com/api/problems');
        setProblems(problemsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user.username}! ({user.role})
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          {user.role === 'employer' ? (
            <button
              onClick={() => setActiveTab('my-problems')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-problems'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Problems
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('my-submissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-submissions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Submissions
            </button>
          )}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {user.role === 'employer' ? (
            <>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary-600">{problems.length}</h3>
                <p className="text-gray-600">Problems Posted</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {problems.reduce((total, problem) => total + problem.submissions.length, 0)}
                </h3>
                <p className="text-gray-600">Total Submissions</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-blue-600">
                  {problems.filter(p => p.status === 'open').length}
                </h3>
                <p className="text-gray-600">Active Problems</p>
              </div>
            </>
          ) : (
            <>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary-600">{submissions.length}</h3>
                <p className="text-gray-600">Submissions Made</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'winner').length}
                </h3>
                <p className="text-gray-600">Winning Submissions</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-blue-600">
                  {problems.filter(p => p.status === 'open').length}
                </h3>
                <p className="text-gray-600">Available Problems</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Employer: My Problems */}
      {activeTab === 'my-problems' && user.role === 'employer' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Problems</h2>
            <Link to="/post-problem" className="btn-primary">
              Post New Problem
            </Link>
          </div>

          {problems.length === 0 ? (
            <div className="card text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No problems posted yet</h3>
              <p className="text-gray-600 mb-4">Start by posting your first challenge</p>
              <Link to="/post-problem" className="btn-primary">
                Post Your First Problem
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {problems.map(problem => (
                <div key={problem._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link 
                        to={`/problems/${problem._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {problem.title}
                      </Link>
                      <p className="text-gray-600 mt-1 line-clamp-2">{problem.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          problem.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {problem.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {problem.submissions.length} submissions
                        </span>
                        <span className="text-sm text-gray-600">
                          Due: {new Date(problem.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                        {problem.rewardType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Seeker: My Submissions */}
      {activeTab === 'my-submissions' && user.role === 'jobseeker' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">My Submissions</h2>

          {submissions.length === 0 ? (
            <div className="card text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-600 mb-4">Start solving problems to build your reputation</p>
              <Link to="/problems" className="btn-primary">
                Browse Problems
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {submissions.map(submission => (
                <div key={submission._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link 
                        to={`/problems/${submission.problemId?._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {submission.problemId?.title || 'Problem not found'}
                      </Link>
                      
                      <p className="text-gray-600 mt-2 line-clamp-2">{submission.solutionText}</p>
                      <p>{submission.githubRepo}</p>
                      <p>{submission.liveDemo}</p>
                      <p>Submitted By: {submission?.submittedBy?.email}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          submission.status === 'winner' ? 'bg-green-100 text-green-800' :
                          submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      {submission.score && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          Score: {submission.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Available Problems for Job Seekers */}
      {activeTab === 'overview' && user.role === 'jobseeker' && problems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Recommended Problems</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {problems.slice(0, 4).map(problem => (
              <div key={problem._id} className="card">
                <Link 
                  to={`/problems/${problem._id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                >
                  {problem.title}
                </Link>
                <div className="flex flex-wrap gap-2 mt-2">
                  {problem.skillsRequired.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-600">{problem.rewardType}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(problem.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/problems" className="btn-primary">
              View All Problems
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;