import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSetup() {
  const { user, createProfile, checkUsernameAvailable } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(''); // '', 'checking', 'available', 'taken'

  // Pre-fill name from Google profile
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    } else if (user?.user_metadata?.name) {
      setFullName(user.user_metadata.name);
    }
  }, [user]);

  // Debounced username check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus('');
      return;
    }

    // Validate format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('');
      setErrors(prev => ({ ...prev, username: 'Only letters, numbers, and underscores' }));
      return;
    }

    setUsernameStatus('checking');
    setErrors(prev => ({ ...prev, username: '' }));

    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      setUsernameStatus(available ? 'available' : 'taken');
      if (!available) {
        setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsernameAvailable]);

  function validateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!username || username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Only letters, numbers, and underscores';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!validateAge(dob)) {
      newErrors.dob = 'You must be at least 18 years old';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createProfile({
        full_name: fullName.trim(),
        username: username.toLowerCase(),
        dob,
        avatar_url: user?.user_metadata?.avatar_url || null,
      });
      navigate('/lobby');
    } catch (err) {
      console.error('Profile creation error:', err);
      if (err.message?.includes('duplicate')) {
        setErrors({ username: 'Username is already taken' });
      } else {
        setErrors({ submit: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-card-glow" />
        <div className="setup-card-content">
          {/* Header */}
          <div className="setup-header">
            <div className="setup-avatar">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" />
              ) : (
                <span>{fullName ? fullName.charAt(0).toUpperCase() : '?'}</span>
              )}
            </div>
            <h1>Complete Your Profile</h1>
            <p className="text-secondary">Just a few details to get you started</p>
          </div>

          {/* Progress steps */}
          <div className="setup-progress">
            <div className="progress-step completed">
              <div className="progress-dot">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Google Sign In</span>
            </div>
            <div className="progress-line active" />
            <div className="progress-step active">
              <div className="progress-dot">2</div>
              <span>Profile Setup</span>
            </div>
            <div className="progress-line" />
            <div className="progress-step">
              <div className="progress-dot">3</div>
              <span>Join Lobby</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="setup-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-status">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                  placeholder="Choose a unique username"
                  className={errors.username ? 'input-error' : usernameStatus === 'available' ? 'input-success' : ''}
                />
                {usernameStatus === 'checking' && (
                  <div className="input-status checking">
                    <div className="mini-spinner" />
                  </div>
                )}
                {usernameStatus === 'available' && (
                  <div className="input-status available">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                {usernameStatus === 'taken' && (
                  <div className="input-status taken">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.username && <span className="field-error">{errors.username}</span>}
              {usernameStatus === 'available' && <span className="field-success">Username is available!</span>}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={maxDateStr}
                className={errors.dob ? 'input-error' : ''}
              />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
              <span className="field-hint">You must be at least 18 years old</span>
            </div>

            {errors.submit && (
              <div className="login-error" style={{ marginBottom: '16px' }}>
                {errors.submit}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="setup-submit"
              disabled={isSubmitting || usernameStatus === 'taken' || usernameStatus === 'checking'}
            >
              {isSubmitting ? (
                <>
                  <div className="google-btn-spinner" />
                  <span>Creating Profile...</span>
                </>
              ) : (
                <>
                  <span>Continue to Lobby</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
