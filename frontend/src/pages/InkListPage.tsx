import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { inksApi } from '../api/inks';
import PostListSkeleton from '../components/PostListSkeleton';
import Pagination from '../components/Pagination';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

export default function InkListPage() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [size] = useState(DEFAULT_SIZE);

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['inks', { page, size }],
    queryFn: () => inksApi.getAll({ page, size }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, pageData?.totalElements || 0);

  if (isLoading) return <PostListSkeleton count={size} />;
  if (error) return <div className="error">Failed to load inks</div>;

  return (
    <div className="post-list">
      <h2>All Inks</h2>
      {pageData?.content.length === 0 ? (
        <p>No inks yet. <Link to="/inks/new">Create one!</Link></p>
      ) : (
        <>
          {pageData?.content.map(ink => (
            <article key={ink.id} className="post-card">
              <div className="post-card-header">
                <h3><Link to={`/inks/${ink.id}`}>{ink.title}</Link></h3>
                <span className="post-meta">
                  {ink.authorUsername} · {new Date(ink.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="post-excerpt">{ink.content}</p>
            </article>
          ))}
          <div className="pagination-summary">
            Showing {start}–{end} of {pageData?.totalElements} inks
          </div>
          <Pagination
            currentPage={page}
            totalPages={pageData?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
