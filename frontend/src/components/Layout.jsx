import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isModerator } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Submissions
        </NavLink>
        {user && (
          <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
            Create submission
          </NavLink>
        )}
        {isModerator && (
          <NavLink to="/moderator" className={({ isActive }) => (isActive ? 'active' : '')}>
            Moderation
          </NavLink>
        )}
        <span style={{ marginLeft: 'auto' }}>
          {user ? (
            <>
              <span style={{ marginRight: '0.75rem' }}>{user.name} ({user.role})</span>
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">Log in</NavLink>
          )}
        </span>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
