import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from '../services/firebase';

const AuthScreen = ({ onAuthSuccess, isNewUser }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googlePopupOpen, setGooglePopupOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Cleanup function to reset popup state if component unmounts during auth
  useEffect(() => {
    return () => {
      if (googlePopupOpen) {
        setGooglePopupOpen(false);
      }
    };
  }, [googlePopupOpen]);

  // Configure Google provider with proper scopes and custom parameters
  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  googleProvider.setCustomParameters({
    prompt: 'select_account', // Force account selection every time
    access_type: 'offline',   // Request refresh token
    include_granted_scopes: 'true' // Include granted scopes
  });

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setGooglePopupOpen(true);
    setError('');
    
    try {
      console.log('Starting Google sign-in process...');
      console.log('Opening Google authentication popup...');
      console.log('Google provider configuration:', {
        scopes: googleProvider.scopes,
        customParameters: googleProvider.customParameters
      });
      
      // Create a promise that resolves when popup completes or rejects on timeout
      const popupPromise = signInWithPopup(auth, googleProvider);
      
      // Add a timeout to prevent indefinite waiting
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Popup timeout - please try again')), 60000); // 60 second timeout
      });
      
      // Race between popup completion and timeout
      const result = await Promise.race([popupPromise, timeoutPromise]);
      
      // Only proceed if we have a valid user result
      if (result && result.user) {
        const user = result.user;
        console.log('Google sign-in successful for:', user.email, 'UID:', user.uid);
        console.log('User display name:', user.displayName);
        console.log('User photo URL:', user.photoURL);
        
        // Wait a moment to ensure popup is fully closed and user sees the transition
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Now call onAuthSuccess - database check will be handled in App.jsx
        onAuthSuccess(user);
      } else {
        throw new Error('No user data received from Google authentication');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Handle specific popup-related errors with user-friendly messages
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled. Please try again and complete the account selection in the popup window.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Google sign-in was cancelled. Please try again and complete the authentication process.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method. Please use email/password instead.');
      } else if (error.message === 'Popup timeout - please try again') {
        setError('Google sign-in popup timed out. Please try again and complete the account selection quickly.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error during Google sign-in. Please check your internet connection and try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled for this app. Please contact support.');
      } else {
        setError(getAuthErrorMessage(error.code));
      }
    } finally {
      setLoading(false);
      setGooglePopupOpen(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email sign-in successful for:', user.email);
      
      // Always call onAuthSuccess - database check will be handled in App.jsx
      onAuthSuccess(user);
    } catch (error) {
      console.error('Email sign-in error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email sign-up successful for:', user.email);
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Always call onAuthSuccess - database check will be handled in App.jsx
      onAuthSuccess(user);
    } catch (error) {
      console.error('Email sign-up error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled. Please try again and complete the account selection.';
      case 'auth/popup-blocked':
        return 'Google sign-in popup was blocked. Please allow popups for this site and try again.';
      case 'auth/cancelled-popup-request':
        return 'Google sign-in was cancelled. Please try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many sign-in attempts. Please try again later.';
      default:
        return 'Authentication failed. Please try again';
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="mt-2 text-gray-400">Enter your email to receive a reset link</p>
          </div>
          
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            
            {success && (
              <div className="text-green-400 text-sm">{success}</div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setSuccess('');
                }}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">QuitCard Arena</h1>
          <p className="text-gray-400">Your journey to quit starts here</p>
        </div>

        {/* Google Sign-In Button */}
        <div>
          {/* Popup status indicator */}
          {googlePopupOpen && (
            <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-center text-blue-300 text-sm">
                <div className="animate-pulse mr-2">🔐</div>
                Google popup is open - please complete your account selection
              </div>
            </div>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Opening Google Sign-in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          {/* Help text for Google sign-in */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {googlePopupOpen ? (
              <span className="text-blue-400 font-medium">
                🔐 Google popup is open - please complete account selection
              </span>
            ) : (
              'Click to open Google account selection popup'
            )}
          </p>
          
          {/* Error display with retry option */}
          {error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="text-red-300 text-sm mb-2">{error}</div>
              {error.includes('Google sign-in') && !googlePopupOpen && (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Retrying...' : 'Try Google Sign-in Again'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('signin');
              clearForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              clearForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-400 text-sm">{success}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
