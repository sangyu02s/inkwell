import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { inksApi } from '../api/inks';
import PostDetailSkeleton from '../components/PostDetailSkeleton';
import { useAuth } from '../contexts/useAuth';
import TagChip from '../components/TagChip';

export default function InkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: ink, isLoading, error } = useQuery({
    queryKey: ['inks', id],
    queryFn: () => inksApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <PostDetailSkeleton />;
  if (error || !ink) return <div className="error">Ink not found</div>;

  const canEdit = user?.id === ink.authorId;

  return (
    <article className="post-detail">
      <div className="post-detail-header">
        <div>
          <h2>{ink.title}</h2>
          <p className="post-meta">
            By {ink.authorUsername} on {new Date(ink.createdAt).toLocaleDateString()}
            {ink.updatedAt && ` (updated: ${new Date(ink.updatedAt).toLocaleDateString()})`}
          </p>
          {ink.tags && ink.tags.length > 0 && (
            <div className="post-tags">
              {ink.tags.map(tag => (
                <TagChip key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
        <div className="post-detail-actions">
          <Link to="/" className="btn">Back</Link>
          {canEdit && (
            <>
              <Link to={`/inks/${ink.id}/edit`} className="btn">Edit</Link>
              <button
                onClick={() => {
                  if (confirm('Delete this ink?')) {
                    inksApi.delete(ink.id).then(() => window.location.href = '/');
                  }
                }}
                className="btn btn-danger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className="post-content">{ink.content}</div>
    </article>
  );
}