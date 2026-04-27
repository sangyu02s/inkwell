import axios from 'axios';
import type { Ink } from '../types/Ink';
import type { Page } from '../types/Page';
import type { Tag } from '../types/Tag';

const API_URL = '/api/inks';

export interface GetAllParams {
  page?: number;
  size?: number;
  sort?: string;
  tag?: string;
  tags?: string;
}

export const inksApi = {
  getAll: (params: GetAllParams = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', tag, tags } = params;
    return axios
      .get<Page<Ink>>(API_URL, { params: { page, size, sort, tag, tags } })
      .then(r => r.data);
  },
  getById: (id: number) => axios.get<Ink>(`${API_URL}/${id}`).then(r => r.data),
  create: (data: { title: string; content: string }) =>
    axios.post<Ink>(API_URL, data).then(r => r.data),
  update: (id: number, data: { title: string; content: string }) =>
    axios.put<Ink>(`${API_URL}/${id}`, data).then(r => r.data),
  delete: (id: number) => axios.delete(`${API_URL}/${id}`),
  getTags: (id: number) => axios.get<Tag[]>(`${API_URL}/${id}/tags`).then(r => r.data),
  updateTags: (id: number, tagIds: number[]) =>
    axios.put<Ink>(`${API_URL}/${id}/tags`, { tagIds }).then(r => r.data),
};
