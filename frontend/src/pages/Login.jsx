import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api/client';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login(email, password);
        setToken(data.token, data.user);
      } else {
        const data = await register({ name, email, password, role });
        setToken(data.token, data.user);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
        <form onSubmit={handleSubmit}>
          {/*{mode === 'register' && (*/}
          {/*  <>*/}
          {/*    <div className="form-group">*/}
          {/*      <label>Name</label>*/}
          {/*      <input*/}
          {/*        type="text"*/}
          {/*        value={name}*/}
          {/*        onChange={(e) => setName(e.target.value)}*/}
          {/*        required*/}
          {/*        autoComplete="name"*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*    <div className="form-group">*/}
          {/*      <label>Role (for demo)</label>*/}
          {/*      <select*/}
          {/*        value={role}*/}
          {/*        onChange={(e) => setRole(e.target.value)}*/}
          {/*        style={{ width: '100%', padding: '0.5rem' }}*/}
          {/*      >*/}
          {/*        <option value="user">User</option>*/}
          {/*        <option value="moderator">Moderator</option>*/}
          {/*      </select>*/}
          {/*    </div>*/}
          {/*  </>*/}
          {/*)}*/}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          {/*{mode === 'login' ? (*/}
          {/*  <>No account? <button type="button" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }} onClick={() => setMode('register')}>Sign up</button></>*/}
          {/*) : (*/}
          {/*  <>Have an account? <button type="button" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }} onClick={() => setMode('login')}>Log in</button></>*/}
          {/*)}*/}
        </p>
      </div>
      <p style={{ textAlign: 'center' }}>
        <NavLink to="/">Back to home</NavLink>
      </p>
    </div>
  );
}
