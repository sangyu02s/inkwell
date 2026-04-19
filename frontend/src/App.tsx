import { Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import InkListPage from './pages/InkListPage';
import InkDetailPage from './pages/InkDetailPage';
import InkFormPage from './pages/InkFormPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1><Link to="/">Inkwell</Link></h1>
        <nav><Link to="/inks/new" className="btn-primary">New Ink</Link></nav>
      </header>
      <main className="main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<InkListPage />} />
            <Route path="/inks/new" element={<InkFormPage />} />
            <Route path="/inks/:id" element={<InkDetailPage />} />
            <Route path="/inks/:id/edit" element={<InkFormPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}
export default App;
