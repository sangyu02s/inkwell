import axios from 'axios';
import type { Tag } from '../types/Tag';

const API_URL = '/api/tags';

export const tagsApi = {
  getAll: () => axios.get<Tag[]>(API_URL).then(r => r.data),
  search: (q: string) => axios.get<Tag[]>(API_URL, { params: { q } }).then(r => r.data),
  create: (name: string) => axios.post<Tag>(API_URL, { name }).then(r => r.data),
};
