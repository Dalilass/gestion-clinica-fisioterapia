import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import PacientesPage from './pages/PacientesPage'
import CitasPage from './pages/CitasPage'
import BonosPage from './pages/BonosPage'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/citas" element={<CitasPage />} />
          <Route path="/bonos" element={<BonosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
