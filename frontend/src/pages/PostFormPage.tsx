import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../api/posts';

export default function PostFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: post } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getById(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      isEdit ? postsApi.update(Number(id), data) : postsApi.create(data),
    onSuccess: () => navigate('/'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content });
  };

  return (
    <div className="post-form">
      <h2>{isEdit ? 'Edit Post' : 'New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <Link to="/" className="btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
