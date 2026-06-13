export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  observaciones?: string;
}

export type EstadoCita = 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';

export interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  fecha: string;
  hora: string;
  motivo?: string;
  estado: EstadoCita;
  precio: number;
}

export interface Bono {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  totalSesiones: number;
  sesionesUsadas: number;
  sesionesRestantes: number;
  precio: number;
  activo: boolean;
}

export interface Dashboard {
  totalPacientes: number;
  citasPendientes: number;
  citasRealizadas: number;
  ingresosEstimados: number;
  proximasCitas: Cita[];
}
