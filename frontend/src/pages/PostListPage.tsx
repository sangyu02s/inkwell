import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/posts';

export default function PostListPage() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Failed to load posts</div>;

  return (
    <div className="post-list">
      <h2>All Posts</h2>
      {posts?.length === 0 ? (
        <p>No posts yet. <Link to="/posts/new">Create one!</Link></p>
      ) : (
        posts?.map(post => (
          <article key={post.id} className="post-card">
            <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
            <p className="post-meta">{new Date(post.createdAt).toLocaleDateString()}</p>
            <div className="post-actions">
              <Link to={`/posts/${post.id}`} className="btn">View</Link>
              <Link to={`/posts/${post.id}/edit`} className="btn">Edit</Link>
              <button 
                onClick={() => deleteMutation.mutate(post.id)}
                className="btn btn-danger"
              >Delete</button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
