import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

const PostProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    rewardType: 'job',
    rewardDetails: '',
    deadline: '',
    budget: '',
    difficulty: 'intermediate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const problemData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill),
        budget: formData.budget ? Number(formData.budget) : 0
      };

      await axios.post('http://localhost:5000/api/problems', problemData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post problem');
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Problem</h1>
        <p className="text-gray-600 mt-2">
          Describe a real challenge that job seekers can solve to demonstrate their skills.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Problem Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Build a responsive e-commerce product page"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            required
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the problem in detail, including requirements, constraints, and evaluation criteria..."
          />
        </div>
        <div>
          <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (comma separated) *
          </label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            required
            className="form-input"
            value={formData.skillsRequired}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, CSS, UI/UX Design"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rewardType" className="block text-sm font-medium text-gray-700 mb-2">
              Reward Type *
            </label>
            <select
              id="rewardType"
              name="rewardType"
              required
              className="form-input"
              value={formData.rewardType}
              onChange={handleChange}
            >
              <option value="job">Job Offer</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract Work</option>
              <option value="cash">Cash Prize</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level *
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              className="form-input"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="rewardDetails" className="block text-sm font-medium text-gray-700 mb-2">
            Reward Details *
          </label>
          <input
            type="text"
            id="rewardDetails"
            name="rewardDetails"
            required
            className="form-input"
            value={formData.rewardDetails}
            onChange={handleChange}
            placeholder="e.g., Full-time Frontend Developer position, $5000 cash prize, etc."
          />
        </div>

        {formData.rewardType === 'cash' && (
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget ($)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              min="0"
              step="0.01"
              className="form-input"
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        )}

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
            Submission Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            required
            min={minDateString}
            className="form-input"
            value={formData.deadline}
            onChange={handleChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Submissions will be accepted until this date
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Posting Problem...' : 'Post Problem'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProblem;