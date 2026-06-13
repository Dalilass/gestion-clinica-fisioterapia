import { Paciente } from '../types';
import { api } from './client';

export const pacientesApi = {
  listar: (buscar?: string) =>
    api.get<Paciente[]>(`/pacientes${buscar ? `?buscar=${encodeURIComponent(buscar)}` : ''}`),
  obtener: (id: number) => api.get<Paciente>(`/pacientes/${id}`),
  crear: (data: Omit<Paciente, 'id'>) => api.post<Paciente>('/pacientes', data),
  actualizar: (id: number, data: Omit<Paciente, 'id'>) =>
    api.put<Paciente>(`/pacientes/${id}`, data),
  eliminar: (id: number) => api.delete<void>(`/pacientes/${id}`),
};
