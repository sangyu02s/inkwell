import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { inksApi } from '../api/inks';
import PostListSkeleton from '../components/PostListSkeleton';
import Pagination from '../components/Pagination';
import { useAuth } from '../contexts/useAuth';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

export default function InkListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [size] = useState(DEFAULT_SIZE);

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['inks', { page, size }],
    queryFn: () => inksApi.getAll({ page, size }),
  });

  const deleteMutation = useMutation({
    mutationFn: inksApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inks'] }),
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
              <h3><Link to={`/inks/${ink.id}`}>{ink.title}</Link></h3>
              <p className="post-meta">By {ink.authorUsername} on {new Date(ink.createdAt).toLocaleDateString()}</p>
              <div className="post-actions">
                <Link to={`/inks/${ink.id}`} className="btn">View</Link>
                {user?.id === ink.authorId && (
                  <>
                    <Link to={`/inks/${ink.id}/edit`} className="btn">Edit</Link>
                    <button
                      onClick={() => {
                        if (confirm('Delete this ink?')) {
                          deleteMutation.mutate(ink.id);
                        }
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
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
