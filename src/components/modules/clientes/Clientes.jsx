import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import { useQuery } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { colorAvatar, iniciales, clp } from '../../../lib/utils'

export default function Clientes({ drawerOpen: fabOpen, onCloseDrawer }) {
  const { tenant } = useAuth()
  const [search,    setSearch]   = useState('')
  const [selected,  setSelected] = useState(null)
  const [nuevoOpen, setNuevoOpen]= useState(false)

  useEffect(() => { if (fabOpen) setNuevoOpen(true) }, [fabOpen])

  const { data: clientes, loading, refetch } = useQuery(async () =>
    supabase.from('clientes')
      .select('*, vehiculos(id, patente, marca, modelo)')
      .eq('tenant_id', tenant?.id)
      .eq('activo', true)
      .order('nombre'), [tenant?.id])

  const filtrados = clientes?.filter(c =>
    !search ||
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.apellido?.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono?.includes(search) ||
    c.rut?.includes(search)
  ) ?? []

  return (
    <>
      <input className="input" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Buscar por nombre, teléfono, RUT..."
        style={{ marginBottom: 12 }} />

      <div className="card">
        {loading && <div className="spinner" />}
        {!loading && filtrados.length === 0 && (
          <div className="empty">
            <div className="empty-icon">👥</div>
            <div className="empty-text">Sin clientes registrados</div>
          </div>
        )}
        {filtrados.map(c => {
          const col = colorAvatar(c.nombre)
          return (
            <div key={c.id} className="list-row" style={{ cursor: 'pointer' }}
              onClick={() => setSelected(c)}>
              <div className="avatar" style={{ background: col.bg, color: col.color }}>
                {iniciales(c.nombre, c.apellido ?? '')}
              </div>
              <div className="list-row-info">
                <div className="list-row-title">{c.nombre} {c.apellido ?? ''}</div>
                <div className="list-row-sub">{c.telefono ?? '—'} {c.rut ? `· ${c.rut}` : ''}</div>
                {c.vehiculos?.length > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                    🚗 {c.vehiculos.map(v => v.patente).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                {c.vehiculos?.length ?? 0} auto{(c.vehiculos?.length ?? 0) !== 1 ? 's' : ''}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div className="drawer-title">Detalle cliente</div>
            {(() => {
              const col = colorAvatar(selected.nombre)
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: 14, background: 'var(--surface2)', borderRadius: 'var(--radius-md)' }}>
                    <div className="avatar xl" style={{ background: col.bg, color: col.color }}>
                      {iniciales(selected.nombre, selected.apellido ?? '')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.nombre} {selected.apellido ?? ''}</div>
                      {selected.telefono && (
                        <a href={`tel:${selected.telefono}`} style={{ fontSize: 13, color: 'var(--info-text)', textDecoration: 'none' }}>
                          {selected.telefono}
                        </a>
                      )}
                      {selected.rut && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>RUT: {selected.rut}</div>}
                    </div>
                  </div>

                  {selected.vehiculos?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div className="card-title" style={{ marginBottom: 10 }}>Vehículos</div>
                      {selected.vehiculos.map(v => (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid var(--border)' }}>
                          <span style={{ fontSize: 20 }}>🚗</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>{v.patente}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{v.marca} {v.modelo}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.telefono && (
                    <a href={`https://wa.me/56${selected.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, background: '#25D366', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>
                      💬 Contactar por WhatsApp
                    </a>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}

      {nuevoOpen && (
        <NuevoClienteDrawer
          tenantId={tenant?.id}
          onClose={() => { setNuevoOpen(false); onCloseDrawer?.() }}
          onGuardado={refetch}
        />
      )}
    </>
  )
}

function NuevoClienteDrawer({ tenantId, onClose, onGuardado }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', email: '', rut: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleGuardar() {
    if (!form.nombre.trim()) return
    setLoading(true)
    await supabase.from('clientes').insert({ ...form, tenant_id: tenantId, activo: true })
    setLoading(false)
    onGuardado()
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Nuevo cliente</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Nombre *</label>
            <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Juan" />
          </div>
          <div className="input-group">
            <label className="input-label">Apellido</label>
            <input className="input" value={form.apellido} onChange={e => set('apellido', e.target.value)} placeholder="Pérez" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Teléfono</label>
          <input className="input" type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+56 9 1234 5678" />
        </div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="juan@email.com" />
        </div>
        <div className="input-group">
          <label className="input-label">RUT</label>
          <input className="input" value={form.rut} onChange={e => set('rut', e.target.value)} placeholder="12.345.678-9" />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGuardar} disabled={loading || !form.nombre.trim()}>
          {loading ? 'Guardando...' : 'Agregar cliente'}
        </button>
      </div>
    </div>
  )
}
