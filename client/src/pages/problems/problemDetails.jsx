import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solution, setSolution] = useState({
    solutionText:"",
    githubRepo:"",
    liveDemo:"",
    solutionFile: null
  });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblem();
    if (user?.role === 'employer') {
      fetchSubmissions();
    }
  }, [id, user]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`https://skillsgape.onrender.com/api/submissions/problem/${id}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };
  

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
     if (
      !solution.solutionText.trim() ||
      !solution.githubRepo.trim() ||
      !solution.liveDemo.trim()
    ) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('solutionText', solution.solutionText);
      formData.append('githubRepo', solution.githubRepo);
      formData.append('liveDemo', solution.liveDemo);
      if (solution.solutionFile) {
        formData.append('solutionFile', solution.solutionFile);
      }

      await axios.post(`https://skillsgape.onrender.com/api/submissions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSolution({
        solutionText:"",
        githubRepo:"",
        liveDemo:"",
        solutionFile: null
      });
      setShowSubmissionForm(false);
      alert('Solution submitted successfully!');
      if (user?.role === 'jobseeker') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Failed to submit solution.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectWinner = async (submissionId) => {
    if (window.confirm('Are you sure you want to select this submission as the winner?')) {
      try {
        await axios.patch(`https://skillsgape.onrender.com/api/submissions/${submissionId}`, {
          status: 'winner'
        });
        fetchSubmissions();
        alert('Winner selected successfully!');
      } catch (error) {
        console.error('Error selecting winner:', error);
        alert('Failed to select winner.');
      }
    }
  };

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  if (!problem) return <div className="text-center py-8">Problem not found.</div>;

  const isExpired = new Date(problem.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
            <p className="text-gray-600 mt-2">Posted by {problem.postedBy?.email}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              problem.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
            <div className={`mt-2 text-sm font-medium ${
              isExpired ? 'text-red-600' : 'text-green-600'
            }`}>
              {isExpired ? 'Expired' : `Due: ${new Date(problem.deadline).toLocaleDateString()}`}
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {problem.skillsRequired.map(skill => (
                <span key={skill} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Reward</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-medium text-green-800 capitalize">{problem.rewardType}</div>
              {problem.rewardDetails && (
                <div className="text-green-700 text-sm mt-1">{problem.rewardDetails}</div>
              )}
              {problem.budget > 0 && problem.rewardType === 'cash' && (
                <div className="font-semibold text-green-900 mt-1">${problem.budget}</div>
              )}
            </div>
          </div>
        </div>

        {user?.role === 'jobseeker' && !isExpired && (
          <div className="border-t pt-6">
            {!showSubmissionForm ? (
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="btn-primary"
              >
                Submit Solution
              </button>
            ) : (
              <form onSubmit={handleSubmitSolution} className="space-y-4">
                <div>
                  <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Solution
                  </label>
                  <textarea
                    id="solution"
                    rows="6"
                    className="form-input"
                    value={solution.solutionText}
                    onChange={(e) => setSolution({...solution,solutionText:e.target.value})}
                    placeholder="Describe your solution in detail..."
                    required
                  />
                </div>
                <div>
                <label>GitHub Repository:</label>
                <input
                  type="url"
                  value={solution.githubRepo}
                  onChange={(e) => setSolution({...solution,githubRepo:e.target.value})}
                  placeholder="https://github.com/yourrepo"
                />
              </div>
              <div>
                <label>Live Demo:</label>
                <input
                  type="url"
                  value={solution.liveDemo}
                  onChange={(e) => setSolution({...solution,liveDemo:e.target.value})}
                  placeholder="https://yourdemo.com"
                />
              </div>
              <div>
                <label htmlFor="solutionFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Solution File (Optional)
                </label>
                <input
                  id="solutionFile"
                  type="file"
                  className="form-input"
                  onChange={(e) => setSolution({...solution, solutionFile: e.target.files[0]})}
                />
              </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Solution'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {user?.role === 'employer' && (
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-4">Submissions ({submissions.length})</h2>
          
          {submissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet.</p>
          ) : (
            <div className="space-y-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {submissions.map(submission => (
                <div key={submission._id} className="border border-gray-300 h-[350px] rounded-lg p-4 ">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">
                        Submitted by: {submission.submittedBy?.email}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.status === 'winner' ? 'bg-green-100 text-green-800' :
                      submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  
                  <div className="prose max-w-none mb-3 overflow-y-auto max-h-[200px]">
                    <p className="text-gray-700 whitespace-pre-line text-sm">{submission.solutionText}</p>

                    {submission.githubRepo && (
                      <p className="text-blue-600 mt-2 text-sm">
                        GitHub: <a href={submission.githubRepo} target="_blank" rel="noopener noreferrer" className="underline">{submission.githubRepo}</a>
                      </p>
                    )}

                    {submission.liveDemo && (
                      <p className="text-blue-600 mt-1 text-sm">
                        Live Demo: <a href={submission.liveDemo} target="_blank" rel="noopener noreferrer" className="underline">{submission.liveDemo}</a>
                      </p>
                    )}

                    {submission.solutionFile && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Uploaded File:</p>
                        <img 
                          src={`http://localhost:5000/${submission.solutionFile}`} 
                          alt="Solution file" 
                          className="max-w-full h-auto rounded border border-gray-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            const error = document.createElement('p');
                            error.className = 'text-red-600 text-sm';
                            error.textContent = 'Image failed to load';
                            parent.appendChild(error);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {submission.status !== 'winner' && (
                    <button
                      onClick={() => handleSelectWinner(submission._id)}
                      className="btn-primary text-sm"
                    >
                      Select as Winner
                    </button>
                  )}

                  {submission.score !== undefined && submission.score !== null && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="text-sm font-medium text-blue-900">
                        Score: <span className="font-bold">{submission.score}/100</span>
                      </p>
                    </div>
                  )}

                  {submission.feedback && (
                    <div className="mt-3 bg-gray-50 border border-gray-300 rounded p-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetails;