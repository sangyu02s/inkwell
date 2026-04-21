import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <nav>
        <Link to="/inks/new" className="btn-primary">New Ink</Link>
        <span className="nav-user">{user?.username}</span>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </nav>
    );
  }

  return (
    <nav>
      <Link to="/auth/login">Login</Link>
      <Link to="/auth/register">Register</Link>
    </nav>
  );
}