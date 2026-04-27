import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../api/tags';
import type { Tag } from '../types/Tag';

interface TagInputProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

export default function TagInput({ selectedTags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: (q: string) => tagsApi.search(q),
    onSuccess: (data) => {
      const filtered = data.filter(
        tag => !selectedTags.some(st => st.id === tag.id)
      );
      setSearchResults(filtered);
      setShowDropdown(filtered.length > 0 || inputValue.length > 0);
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => tagsApi.create(name),
    onSuccess: (newTag) => {
      onChange([...selectedTags, newTag]);
      setInputValue('');
      setShowDropdown(false);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length > 0) {
        searchMutation.mutate(inputValue);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tag: Tag) => {
    onChange([...selectedTags, tag]);
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleCreate = () => {
    if (inputValue.trim().length === 0) return;
    createMutation.mutate(inputValue.trim());
  };

  const handleRemove = (tagId: number) => {
    onChange(selectedTags.filter(t => t.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      } else if (inputValue.trim().length > 0) {
        handleCreate();
      }
    } else if (e.key === ',') {
      e.preventDefault();
      if (inputValue.trim().length > 0) {
        handleCreate();
      }
    }
  };

  return (
    <div className="tag-input-container">
      <div className="selected-tags">
        {selectedTags.map(tag => (
          <span key={tag.id} className="tag-chip">
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemove(tag.id)}
              className="tag-remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="tag-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length > 0 && searchResults.length > 0 && setShowDropdown(true)}
          placeholder="Add tags..."
          className="tag-input"
        />
        {showDropdown && (
          <div ref={dropdownRef} className="tag-dropdown">
            {searchResults.map(tag => (
              <div
                key={tag.id}
                className="tag-dropdown-item"
                onClick={() => handleSelect(tag)}
              >
                {tag.name}
              </div>
            ))}
            {inputValue.trim().length > 0 && !searchResults.some(t => t.name.toLowerCase() === inputValue.toLowerCase().trim()) && (
              <div
                className="tag-dropdown-item tag-create"
                onClick={() => handleCreate()}
              >
                Create "{inputValue.trim()}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
