import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/database'; // Import directly or use context if you prefer
import { useAuth } from '../context/AuthContext'; // To set user context after success

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // We assume the email is passed via state from the signup page
  const email = location.state?.email; 

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await AuthService.verifyOTP(email, otp);
        // Force a page reload or context update to get the user logged in
        window.location.href = '/dashboard'; 
    } catch (err: any) {
        setError(err.message || 'Verification failed');
    } finally {
        setLoading(false);
    }
  };

  if (!email) return <div>Error: No email provided. Please sign up again.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          We sent a code to <strong>{email}</strong>
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit Code"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center text-2xl tracking-widest"
            maxLength={6}
          />
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;