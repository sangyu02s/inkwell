import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import InkListPage from './pages/InkListPage';
import InkDetailPage from './pages/InkDetailPage';
import InkFormPage from './pages/InkFormPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <header className="header">
          <h1><Link to="/">Inkwell</Link></h1>
          <Navigation />
        </header>
        <main className="main">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<InkListPage />} />
              <Route path="/inks/:id" element={<InkDetailPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/inks/new" element={
                <ProtectedRoute>
                  <InkFormPage />
                </ProtectedRoute>
              } />
              <Route path="/inks/:id/edit" element={
                <ProtectedRoute>
                  <InkFormPage />
                </ProtectedRoute>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </AuthProvider>
  );
}
export default App;