import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiUser, FiArrowRight, FiAlertCircle } = FiIcons;

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Enable light theme for body on login page
  useEffect(() => {
    document.body.classList.add('light-theme-active');
    return () => {
      document.body.classList.remove('light-theme-active');
    };
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Try backend login first
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('crm_auth_token', data.token);
        localStorage.setItem('crm_user', JSON.stringify(data.user));
        navigate('/crm');
      } else {
        // Fallback for local dev without server running
        if (credentials.username === 'admin' && credentials.password === 'SharpKnives2024!') {
          localStorage.setItem('crm_auth_token', 'local-dev-token');
          navigate('/crm');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for offline
      if (credentials.username === 'admin' && credentials.password === 'SharpKnives2024!') {
        localStorage.setItem('crm_auth_token', 'local-offline-token');
        navigate('/crm');
      } else {
        setError('Server unavailable & invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-whetstone-cream flex items-center justify-center px-4 text-carbon-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-damascus-bronze rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white font-bold text-2xl">CK</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-carbon-black">Staff Access</h1>
          <p className="text-steel-gray mt-2">Please log in to access the CRM</p>
        </div>

        <div className="bg-edge-white shadow-lg rounded-lg p-8 border border-steel-gray/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-black mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="text-steel-gray" />
                </div>
                <input 
                  type="text" 
                  name="username" 
                  value={credentials.username} 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon-black mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="text-steel-gray" />
                </div>
                <input 
                  type="password" 
                  name="password" 
                  value={credentials.password} 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center border border-red-100">
                <SafeIcon icon={FiAlertCircle} className="mr-2" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-white shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <SafeIcon icon={FiArrowRight} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-steel-gray hover:text-damascus-bronze transition-colors">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;