import { Routes, Route, Link } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1><Link to="/">Inkwell</Link></h1>
        <nav><Link to="/posts/new" className="btn-primary">New Post</Link></nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<PostFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;
