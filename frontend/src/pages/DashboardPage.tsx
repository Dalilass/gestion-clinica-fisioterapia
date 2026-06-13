import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/dashboard'
import { Dashboard } from '../types'

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatTime(timeStr: string) {
  return timeStr.substring(0, 5)
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardApi.obtener()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Cargando resumen...
    </div>
  )

  if (error) return <div className="error-message">⚠️ {error}</div>
  if (!data) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general de la clínica</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-label">Total pacientes</div>
          <div className="stat-value">{data.totalPacientes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Citas pendientes</div>
          <div className="stat-value">{data.citasPendientes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Citas realizadas</div>
          <div className="stat-value">{data.citasRealizadas}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💶</div>
          <div className="stat-label">Ingresos estimados</div>
          <div className="stat-value">{Number(data.ingresosEstimados).toFixed(0)} €</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text)' }}>
          Próximas citas
        </h2>

        {data.proximasCitas.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No hay citas próximas pendientes</div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {data.proximasCitas.map(cita => (
                  <tr key={cita.id}>
                    <td className="td-name">{cita.pacienteNombre}</td>
                    <td>{formatDate(cita.fecha)}</td>
                    <td>{formatTime(cita.hora)}</td>
                    <td className="td-secondary">{cita.motivo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
