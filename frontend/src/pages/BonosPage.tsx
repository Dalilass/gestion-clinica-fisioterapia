import { useEffect, useState, useCallback } from 'react'
import { bonosApi } from '../api/bonos'
import { pacientesApi } from '../api/pacientes'
import { Bono, Paciente } from '../types'

interface FormData {
  pacienteId: string
  totalSesiones: string
  sesionesUsadas: string
  precio: string
}

const emptyForm: FormData = {
  pacienteId: '', totalSesiones: '10', sesionesUsadas: '0', precio: '',
}

export default function BonosPage() {
  const [bonos, setBonos] = useState<Bono[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const cargar = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([bonosApi.listar(), pacientesApi.listar()])
      .then(([b, p]) => { setBonos(b); setPacientes(p) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await bonosApi.crear({
        pacienteId: Number(form.pacienteId),
        totalSesiones: Number(form.totalSesiones),
        sesionesUsadas: Number(form.sesionesUsadas),
        precio: form.precio ? Number(form.precio) : undefined as unknown as number,
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

  async function usarSesion(id: number) {
    try {
      await bonosApi.usarSesion(id)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar sesión')
    }
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar este bono?')) return
    try {
      await bonosApi.eliminar(id)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const activos = bonos.filter(b => b.activo).length
  const agotados = bonos.filter(b => !b.activo).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bonos de sesiones</h1>
          <p className="page-subtitle">{activos} activos · {agotados} agotados</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setShowModal(true) }}>
          + Nuevo bono
        </button>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner" /> Cargando bonos...</div>
      ) : bonos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎟️</div>
          <div className="empty-state-text">No hay bonos registrados</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Crear primer bono</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Sesiones</th>
                <th>Progreso</th>
                <th>Precio</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bonos.map(b => {
                const porcentaje = Math.round((b.sesionesUsadas / b.totalSesiones) * 100)
                return (
                  <tr key={b.id}>
                    <td className="td-name">{b.pacienteNombre}</td>
                    <td className="td-secondary">
                      {b.sesionesUsadas} / {b.totalSesiones}
                    </td>
                    <td style={{ minWidth: '120px' }}>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill${!b.activo ? ' agotado' : ''}`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {b.sesionesRestantes} restantes
                      </div>
                    </td>
                    <td>{b.precio ? `${Number(b.precio).toFixed(2)} €` : '—'}</td>
                    <td>
                      <span className={`badge ${b.activo ? 'badge-activo' : 'badge-agotado'}`}>
                        {b.activo ? 'Activo' : 'Agotado'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {b.activo && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => usarSesion(b.id)}
                            title="Registrar una sesión usada"
                          >
                            ✓ Usar sesión
                          </button>
                        )}
                        <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(b.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Nuevo bono</span>
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
                    <label className="form-label required">Total sesiones</label>
                    <input name="totalSesiones" value={form.totalSesiones} onChange={handleChange}
                      className="form-input" type="number" min="1" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sesiones ya usadas</label>
                    <input name="sesionesUsadas" value={form.sesionesUsadas} onChange={handleChange}
                      className="form-input" type="number" min="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio del bono (€)</label>
                    <input name="precio" value={form.precio} onChange={handleChange}
                      className="form-input" type="number" min="0" step="0.01" placeholder="Ej: 350" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Crear bono'}
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
