import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { inksApi } from '../api/inks';
import TagInput from '../components/TagInput';
import { postTitleSchema, postContentSchema } from '../validation/schemas';
import type { Tag } from '../types/Tag';

interface FormErrors {
  title?: string;
  content?: string;
}

export default function InkFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: ink } = useQuery({
    queryKey: ['inks', id],
    queryFn: () => inksApi.getById(Number(id)),
    enabled: isEdit,
  });

  const { data: inkTags } = useQuery({
    queryKey: ['inks', id, 'tags'],
    queryFn: () => inksApi.getTags(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (ink) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state from query data is intentional
      setTitle(ink.title);
      setContent(ink.content);
    }
  }, [ink]);

  useEffect(() => {
    if (inkTags) {
      setSelectedTags(inkTags);
    }
  }, [inkTags]);

  const mutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      isEdit ? inksApi.update(Number(id), data) : inksApi.create(data),
    onSuccess: () => {
      if (isEdit && id) {
        inksApi.updateTags(Number(id), selectedTags.map(t => t.id)).then(() => {
          navigate(-1);
        });
      } else {
        navigate(-1);
      }
    },
  });

  const validate = (): boolean => {
    const titleResult = postTitleSchema.safeParse(title);
    const contentResult = postContentSchema.safeParse(content);

    const newErrors: FormErrors = {};
    if (!titleResult.success) {
      newErrors.title = title.trim() === '' ? 'Title is required' : 'Title must be 1-200 characters';
    }
    if (!contentResult.success) {
      newErrors.content = 'Content is required and cannot be blank';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ title, content });
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="post-form">
      <h2>{isEdit ? 'Edit Ink' : 'New Ink'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => { const next = { ...prev }; delete next.title; return next; });
            }}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label>Tags</label>
          <TagInput selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={e => {
              setContent(e.target.value);
              if (errors.content) setErrors(prev => { const next = { ...prev }; delete next.content; return next; });
            }}
            rows={10}
          />
          {errors.content && <span className="field-error">{errors.content}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={hasErrors || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
