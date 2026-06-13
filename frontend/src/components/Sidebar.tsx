import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/pacientes', icon: '👤', label: 'Pacientes' },
  { to: '/citas', icon: '📅', label: 'Citas' },
  { to: '/bonos', icon: '🎟️', label: 'Bonos' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏥</div>
          <div>
            <div className="sidebar-logo-text">FisioClinic</div>
            <div className="sidebar-logo-sub">Panel de gestión</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        FisioClinic MVP v1.0
      </div>
    </aside>
  )
}
