import Skeleton from './Skeleton';

interface PostListSkeletonProps {
  count?: number;
}

export default function PostListSkeleton({ count = 8 }: PostListSkeletonProps) {
  return (
    <div className="post-list-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton width="60%" height="24px" />
          <Skeleton width="30%" height="16px" className="skeleton-meta" />
          <div className="skeleton-actions">
            <Skeleton width="60px" height="32px" />
            <Skeleton width="60px" height="32px" />
            <Skeleton width="70px" height="32px" />
          </div>
        </div>
      ))}
    </div>
  );
}