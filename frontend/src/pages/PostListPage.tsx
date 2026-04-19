import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/posts';
import PostListSkeleton from '../components/PostListSkeleton';
import Pagination from '../components/Pagination';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

export default function PostListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [size] = useState(DEFAULT_SIZE);

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['posts', { page, size }],
    queryFn: () => postsApi.getAll({ page, size }),
  });

  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, pageData?.totalElements || 0);

  if (isLoading) return <PostListSkeleton count={size} />;
  if (error) return <div className="error">Failed to load posts</div>;

  return (
    <div className="post-list">
      <h2>All Posts</h2>
      {pageData?.content.length === 0 ? (
        <p>No posts yet. <Link to="/posts/new">Create one!</Link></p>
      ) : (
        <>
          {pageData?.content.map(post => (
            <article key={post.id} className="post-card">
              <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
              <p className="post-meta">{new Date(post.createdAt).toLocaleDateString()}</p>
              <div className="post-actions">
                <Link to={`/posts/${post.id}`} className="btn">View</Link>
                <Link to={`/posts/${post.id}/edit`} className="btn">Edit</Link>
                <button
                  onClick={() => deleteMutation.mutate(post.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          <div className="pagination-summary">
            Showing {start}–{end} of {pageData?.totalElements} posts
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