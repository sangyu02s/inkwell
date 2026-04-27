import { useQuery } from '@tanstack/react-query';
import { tagsApi } from '../api/tags';

interface TagFilterProps {
  selectedTag: string | null;
  onSelectTag: (tagName: string | null) => void;
}

export default function TagFilter({ selectedTag, onSelectTag }: TagFilterProps) {
  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="tag-filter">
      <button
        type="button"
        className={`tag-filter-btn ${selectedTag === null ? 'active' : ''}`}
        onClick={() => onSelectTag(null)}
      >
        All
      </button>
      {allTags.map(tag => (
        <button
          key={tag.id}
          type="button"
          className={`tag-filter-btn ${selectedTag === tag.name ? 'active' : ''}`}
          onClick={() => onSelectTag(selectedTag === tag.name ? null : tag.name)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
