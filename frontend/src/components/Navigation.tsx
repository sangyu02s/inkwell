import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import './Navigation.css';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <nav>
        <Link to="/inks/new" className="btn-primary">New</Link>
        <div className="nav-user-dropdown">
          <span className="nav-username">{user?.username}</span>
          <div className="dropdown-menu">
            <button onClick={logout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <Link to="/auth/login" className="btn">Login</Link>
    </nav>
  );
}