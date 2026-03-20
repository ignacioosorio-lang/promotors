import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import Dashboard from '../components/modules/dashboard/Dashboard'
import Ordenes from '../components/modules/ordenes/Ordenes'
import Vehiculos from '../components/modules/vehiculos/Vehiculos'
import Clientes from '../components/modules/clientes/Clientes'
import Inventario from '../components/modules/inventario/Inventario'
import Caja from '../components/modules/caja/Caja'

const MODULOS = [
  { id: 'dashboard', label: 'Inicio',     icon: '🏠' },
  { id: 'ordenes',   label: 'Órdenes',    icon: '📋' },
  { id: 'vehiculos', label: 'Vehículos',  icon: '🚗' },
  { id: 'clientes',  label: 'Clientes',   icon: '👥' },
  { id: 'inventario',label: 'Inventario', icon: '📦' },
  { id: 'caja',      label: 'Caja',       icon: '💰' },
]

export default function Panel() {
  const { tenant, signOut } = useAuth()
  const [modulo,     setModulo]     = useState('dashboard')
  const [fabOpen,    setFabOpen]    = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)

  const FAB_LABELS = {
    ordenes:    'Nueva OT',
    vehiculos:  'Nuevo vehículo',
    clientes:   'Nuevo cliente',
    inventario: 'Nuevo repuesto',
    caja:       'Nuevo cobro',
  }

  function handleFab() {
    setFabOpen(true)
    setTimeout(() => setFabOpen(false), 100)
  }

  function cambiarModulo(id) {
    setModulo(id)
    setMenuOpen(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', fontFamily: 'var(--font-sans)', maxWidth: 480, margin: '0 auto', position: 'relative' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '0.5px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔧</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)', letterSpacing: 0.5 }}>
              Pro Motor<span style={{ color: 'var(--accent)' }}>'s</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {MODULOS.find(m => m.id === modulo)?.label}
            </div>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 22, padding: 4 }}>
          ☰
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '14px 16px 100px' }}>
        {modulo === 'dashboard'  && <Dashboard onNavigate={cambiarModulo} />}
        {modulo === 'ordenes'    && <Ordenes   drawerOpen={fabOpen} onCloseDrawer={() => setFabOpen(false)} />}
        {modulo === 'vehiculos'  && <Vehiculos  drawerOpen={fabOpen} onCloseDrawer={() => setFabOpen(false)} />}
        {modulo === 'clientes'   && <Clientes   drawerOpen={fabOpen} onCloseDrawer={() => setFabOpen(false)} />}
        {modulo === 'inventario' && <Inventario drawerOpen={fabOpen} onCloseDrawer={() => setFabOpen(false)} />}
        {modulo === 'caja'       && <Caja       drawerOpen={fabOpen} onCloseDrawer={() => setFabOpen(false)} />}
      </div>

      {/* FAB */}
      {modulo !== 'dashboard' && (
        <button className="fab" onClick={handleFab} title={FAB_LABELS[modulo]}>
          +
        </button>
      )}

      {/* Navbar inferior */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'var(--surface)', borderTop: '0.5px solid var(--border)', display: 'flex', zIndex: 40 }}>
        {MODULOS.map(m => (
          <button key={m.id} onClick={() => cambiarModulo(m.id)}
            style={{
              flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, transition: 'opacity 0.15s',
              opacity: modulo === m.id ? 1 : 0.45,
            }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <span style={{ fontSize: 9, fontWeight: modulo === m.id ? 700 : 400, color: modulo === m.id ? 'var(--accent)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Menu lateral */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Menu</div>
            {MODULOS.map(m => (
              <button key={m.id} onClick={() => cambiarModulo(m.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', background: 'none', border: 'none', borderBottom: '0.5px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', color: modulo === m.id ? 'var(--accent)' : 'var(--text-1)', fontWeight: modulo === m.id ? 700 : 400, fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
            <button onClick={signOut}
              style={{ width: '100%', marginTop: 20, padding: '13px', background: 'var(--err-bg)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--err-text)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
