import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    skill: '',
    difficulty: '',
    rewardType: ''
  });
const experience=["All Difficulties","Beginner","Intermediate","Advanced"]
const rewardType=["All Reward Types","Job","Internship","Contract","Cash"]
  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      setError('');
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`https://skillsgape.onrender.com/api/problems?${queryParams}`);
      setProblems(response.data|| []);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError(error.response?.data?.message || 'Failed to fetch problems');
      setProblems([]); // Clear problems on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 my-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error loading problems</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchProblems}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Problems</h1>
        <div className="space-x-2">
          <select 
            className="form-input w-auto"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            {experience.map((exp)=>(<option key={exp}value={exp}>
             {exp}
            </option>))}
            
            {/* <option value="beginner"></option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option> */}
          </select>
          <select 
            className="form-input w-auto"
            value={filters.rewardType}
            onChange={(e) => setFilters({...filters, rewardType: e.target.value})}
          >
            {rewardType.map((reward)=>(
              <option key={reward} value={reward}>
                {reward}
              </option>
            ))}
          {/* <option value="">All Reward Types</option>
             <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
             <option value="cash">Cash</option>*/}
          </select> 
        </div>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">No problems available</h3>
          <p className="text-gray-500">Check back later for new challenges.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {problems.map(problem => (
            <div key={problem._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/problems/${problem._id}`} className="text-xl font-semibold text-primary-600 hover:text-primary-700">
                    {problem.title}
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">{problem.description}</p>
                  <p>postedBy:{problem.postedBy?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {problem.skillsRequired.map(skill => (
                      <span key={skill} className="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    problem.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <div className="mt-2 text-sm text-gray-600">
                    Reward: {problem.rewardType}
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(problem.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;