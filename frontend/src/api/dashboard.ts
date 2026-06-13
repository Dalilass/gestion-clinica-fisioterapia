import { Dashboard } from '../types';
import { api } from './client';

export const dashboardApi = {
  obtener: () => api.get<Dashboard>('/dashboard'),
};
