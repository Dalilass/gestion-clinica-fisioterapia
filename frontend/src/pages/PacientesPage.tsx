import { useEffect, useState, useCallback } from 'react'
import { pacientesApi } from '../api/pacientes'
import { Paciente } from '../types'

interface FormData {
  nombre: string
  apellidos: string
  telefono: string
  email: string
  fechaNacimiento: string
  observaciones: string
}

const emptyForm: FormData = {
  nombre: '', apellidos: '', telefono: '',
  email: '', fechaNacimiento: '', observaciones: '',
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buscar, setBuscar] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Paciente | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const cargar = useCallback((termino?: string) => {
    setLoading(true)
    setError(null)
    pacientesApi.listar(termino)
      .then(setPacientes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  useEffect(() => {
    const timer = setTimeout(() => cargar(buscar || undefined), 300)
    return () => clearTimeout(timer)
  }, [buscar, cargar])

  function abrirCrear() {
    setEditando(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function abrirEditar(p: Paciente) {
    setEditando(p)
    setForm({
      nombre: p.nombre,
      apellidos: p.apellidos,
      telefono: p.telefono || '',
      email: p.email || '',
      fechaNacimiento: p.fechaNacimiento || '',
      observaciones: p.observaciones || '',
    })
    setShowModal(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editando) {
        await pacientesApi.actualizar(editando.id, form)
      } else {
        await pacientesApi.crear(form)
      }
      setShowModal(false)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function eliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar a ${nombre}? También se eliminarán sus citas y bonos.`)) return
    try {
      await pacientesApi.eliminar(id)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">{pacientes.length} pacientes registrados</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>
          + Nuevo paciente
        </button>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o apellidos..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Cargando pacientes...</div>
      ) : pacientes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-text">No se encontraron pacientes</div>
          <button className="btn btn-primary" onClick={abrirCrear}>Añadir el primero</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>F. nacimiento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td className="td-name">{p.nombre} {p.apellidos}</td>
                  <td className="td-secondary">{p.telefono || '—'}</td>
                  <td className="td-secondary">{p.email || '—'}</td>
                  <td className="td-secondary">
                    {p.fechaNacimiento
                      ? p.fechaNacimiento.split('-').reverse().join('/')
                      : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Editar" onClick={() => abrirEditar(p)}>✏️</button>
                      <button className="btn-icon danger" title="Eliminar" onClick={() => eliminar(p.id, p.nombre)}>🗑️</button>
                    </div>
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
              <span className="modal-title">
                {editando ? 'Editar paciente' : 'Nuevo paciente'}
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange}
                      className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Apellidos</label>
                    <input name="apellidos" value={form.apellidos} onChange={handleChange}
                      className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" value={form.telefono} onChange={handleChange}
                      className="form-input" type="tel" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input name="email" value={form.email} onChange={handleChange}
                      className="form-input" type="email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange}
                      className="form-input" type="date" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
                    className="form-textarea" placeholder="Notas clínicas relevantes..." />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : (editando ? 'Guardar cambios' : 'Crear paciente')}
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
