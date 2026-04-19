import Skeleton from './Skeleton';

export default function PostDetailSkeleton() {
  return (
    <div className="post-detail-skeleton">
      <Skeleton width="70%" height="32px" />
      <Skeleton width="40%" height="18px" className="skeleton-meta" />
      <div className="skeleton-content">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="60%" height="16px" />
      </div>
    </div>
  );
}