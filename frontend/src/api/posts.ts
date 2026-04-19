import axios from 'axios';
import type { Post } from '../types/Post';

const API_URL = '/api/posts';

export const postsApi = {
  getAll: () => axios.get<Post[]>(API_URL).then(r => r.data),
  getById: (id: number) => axios.get<Post>(`${API_URL}/${id}`).then(r => r.data),
  create: (data: { title: string; content: string }) => 
    axios.post<Post>(API_URL, data).then(r => r.data),
  update: (id: number, data: { title: string; content: string }) => 
    axios.put<Post>(`${API_URL}/${id}`, data).then(r => r.data),
  delete: (id: number) => axios.delete(`${API_URL}/${id}`),
};
