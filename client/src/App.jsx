import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Navbar from './components/Layout/navbar';
import Home from './pages/home';
import {SignIn} from './pages/auth/login';
import SignUp from './pages/auth/register';
import ProblemList from './pages/problems/problemList';
 import ProblemDetails from './pages/problems/problemDetails';
 import PostProblem from './pages/problems/postProblems';
 import Dashboard from './pages/dashboard';
 import ProtectedRoute from './utils/protectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/problems" element={<ProblemList />} />
           <Route path="/register" element={<SignUp />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/post-problem" element={
              <ProtectedRoute role="employer">
                <PostProblem />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } /> 
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;