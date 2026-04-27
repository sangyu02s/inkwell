import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { inksApi } from '../api/inks';
import PostListSkeleton from '../components/PostListSkeleton';
import Pagination from '../components/Pagination';
import TagFilter from '../components/TagFilter';
import TagChip from '../components/TagChip';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

export default function InkListPage() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [size] = useState(DEFAULT_SIZE);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['inks', { page, size, tag: selectedTag }],
    queryFn: () => inksApi.getAll({ page, size, tag: selectedTag || undefined }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSelectTag = (tagName: string | null) => {
    setSelectedTag(tagName);
    setPage(0);
  };

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, pageData?.totalElements || 0);

  if (isLoading) return <PostListSkeleton count={size} />;
  if (error) return <div className="error">Failed to load inks</div>;

  return (
    <div className="post-list">
      <h2>All Inks</h2>
      <TagFilter selectedTag={selectedTag} onSelectTag={handleSelectTag} />
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
              {ink.tags && ink.tags.length > 0 && (
                <div className="post-tags">
                  {ink.tags.map(tag => (
                    <TagChip key={tag.id} tag={tag} />
                  ))}
                </div>
              )}
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
