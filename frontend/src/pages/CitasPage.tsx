import { useEffect, useState, useCallback } from 'react'
import { citasApi } from '../api/citas'
import { pacientesApi } from '../api/pacientes'
import { Cita, EstadoCita, Paciente } from '../types'

interface FormData {
  pacienteId: string
  fecha: string
  hora: string
  motivo: string
  estado: EstadoCita
  precio: string
}

const emptyForm: FormData = {
  pacienteId: '', fecha: '', hora: '',
  motivo: '', estado: 'PENDIENTE', precio: '40',
}

const estadoLabels: Record<EstadoCita, string> = {
  PENDIENTE: 'Pendiente',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
}

function formatDate(dateStr: string) {
  return dateStr.split('-').reverse().join('/')
}

function formatTime(timeStr: string) {
  return timeStr.substring(0, 5)
}

function formatPrecio(precio: number) {
  return Number(precio).toFixed(2).replace('.', ',') + ' €'
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const cargar = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([citasApi.listar(), pacientesApi.listar()])
      .then(([c, p]) => { setCitas(c); setPacientes(p) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await citasApi.crear({
        pacienteId: Number(form.pacienteId),
        fecha: form.fecha,
        hora: form.hora,
        motivo: form.motivo,
        estado: form.estado,
        precio: Number(form.precio),
      })
      setShowModal(false)
      setForm(emptyForm)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function cambiarEstado(id: number, estado: EstadoCita) {
    try {
      await citasApi.cambiarEstado(id, estado)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
    }
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta cita?')) return
    try {
      await citasApi.eliminar(id)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Citas</h1>
          <p className="page-subtitle">{citas.length} citas en total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setShowModal(true) }}>
          + Nueva cita
        </button>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner" /> Cargando citas...</div>
      ) : citas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No hay citas registradas</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Crear primera cita</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c.id}>
                  <td className="td-name">{c.pacienteNombre}</td>
                  <td>{formatDate(c.fecha)}</td>
                  <td>{formatTime(c.hora)}</td>
                  <td className="td-secondary">{c.motivo || '—'}</td>
                  <td>
                    <select
                      value={c.estado}
                      onChange={e => cambiarEstado(c.id, e.target.value as EstadoCita)}
                      className={`badge badge-${c.estado.toLowerCase()}`}
                      style={{ border: 'none', cursor: 'pointer', font: 'inherit', fontSize: '12px' }}
                    >
                      {(Object.keys(estadoLabels) as EstadoCita[]).map(e => (
                        <option key={e} value={e}>{estadoLabels[e]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatPrecio(c.precio)}</td>
                  <td>
                    <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(c.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Nueva cita</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label required">Paciente</label>
                  <select name="pacienteId" value={form.pacienteId} onChange={handleChange}
                    className="form-select" required>
                    <option value="">Selecciona un paciente...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} {p.apellidos}</option>
                    ))}
                  </select>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Fecha</label>
                    <input name="fecha" value={form.fecha} onChange={handleChange}
                      className="form-input" type="date" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Hora</label>
                    <input name="hora" value={form.hora} onChange={handleChange}
                      className="form-input" type="time" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select name="estado" value={form.estado} onChange={handleChange}
                      className="form-select">
                      {(Object.keys(estadoLabels) as EstadoCita[]).map(e => (
                        <option key={e} value={e}>{estadoLabels[e]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio (€)</label>
                    <input name="precio" value={form.precio} onChange={handleChange}
                      className="form-input" type="number" min="0" step="0.01" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Motivo</label>
                  <input name="motivo" value={form.motivo} onChange={handleChange}
                    className="form-input" placeholder="Ej: Dolor lumbar, rehabilitación..." />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Crear cita'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
