import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../api/posts';
import PostDetailSkeleton from '../components/PostDetailSkeleton';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <PostDetailSkeleton />;
  if (error || !post) return <div className="error">Post not found</div>;

  return (
    <article className="post-detail">
      <h2>{post.title}</h2>
      <p className="post-meta">
        {new Date(post.createdAt).toLocaleDateString()}
        {post.updatedAt && ` (updated: ${new Date(post.updatedAt).toLocaleDateString()})`}
      </p>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <Link to={`/posts/${post.id}/edit`} className="btn">Edit</Link>
        <Link to="/" className="btn">Back</Link>
      </div>
    </article>
  );
}