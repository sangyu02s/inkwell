import type { Tag } from '../types/Tag';

interface TagChipProps {
  tag: Tag;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export default function TagChip({ tag, onClick, removable, onRemove }: TagChipProps) {
  return (
    <span
      className={`tag-chip ${onClick ? 'tag-chip-clickable' : ''}`}
      onClick={onClick}
    >
      {tag.name}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="tag-remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
