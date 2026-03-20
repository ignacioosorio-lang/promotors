import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import { useQuery } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { fmtFecha, clp } from '../../../lib/utils'

export default function Vehiculos({ drawerOpen: fabOpen, onCloseDrawer }) {
  const { tenant } = useAuth()
  const [search,     setSearch]    = useState('')
  const [selected,   setSelected]  = useState(null)
  const [nuevoOpen,  setNuevoOpen] = useState(false)

  useEffect(() => { if (fabOpen) setNuevoOpen(true) }, [fabOpen])

  const { data: vehiculos, loading, refetch } = useQuery(async () =>
    supabase.from('vehiculos')
      .select('*, cliente:clientes(nombre, apellido, telefono)')
      .eq('tenant_id', tenant?.id)
      .eq('activo', true)
      .order('created_at', { ascending: false }), [tenant?.id])

  const filtrados = vehiculos?.filter(v =>
    !search || v.patente?.toLowerCase().includes(search.toLowerCase()) ||
    v.marca?.toLowerCase().includes(search.toLowerCase()) ||
    v.modelo?.toLowerCase().includes(search.toLowerCase()) ||
    v.cliente?.nombre?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  if (selected) {
    return <FichaVehiculo vehiculo={selected} onBack={() => setSelected(null)} tenantId={tenant?.id} />
  }

  return (
    <>
      <input className="input" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Buscar por patente, marca, cliente..."
        style={{ marginBottom: 12 }} />

      <div className="card">
        {loading && <div className="spinner" />}
        {!loading && filtrados.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🚗</div>
            <div className="empty-text">Sin vehículos registrados</div>
          </div>
        )}
        {filtrados.map(v => (
          <div key={v.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => setSelected(v)}>
            <div className="avatar-sq" style={{ fontSize: 22 }}>🚗</div>
            <div className="list-row-info">
              <div className="list-row-title" style={{ fontWeight: 800, letterSpacing: 1 }}>{v.patente}</div>
              <div className="list-row-sub">{v.marca} {v.modelo} {v.anio ? `(${v.anio})` : ''}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                {v.cliente?.nombre ?? 'Sin cliente'}
              </div>
            </div>
            <div className="list-row-right">
              {v.km_actual > 0 && (
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{v.km_actual.toLocaleString()} km</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {nuevoOpen && (
        <NuevoVehiculoDrawer
          tenantId={tenant?.id}
          onClose={() => { setNuevoOpen(false); onCloseDrawer?.() }}
          onGuardado={refetch}
        />
      )}
    </>
  )
}

function FichaVehiculo({ vehiculo, onBack, tenantId }) {
  const { data: ordenes } = useQuery(async () =>
    supabase.from('ordenes_trabajo')
      .select('*, servicios_ot(*), repuestos_ot(*)')
      .eq('vehiculo_id', vehiculo.id)
      .order('fecha_ingreso', { ascending: false }), [vehiculo.id])

  const totalGastado = ordenes?.reduce((s, ot) => {
    const serv = ot.servicios_ot?.reduce((a, x) => a + (x.precio ?? 0), 0) ?? 0
    const rep  = ot.repuestos_ot?.reduce((a, x) => a + (x.precio_venta ?? 0) * x.cantidad, 0) ?? 0
    return s + serv + rep
  }, 0) ?? 0

  return (
    <div>
      <button onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
        ← Volver a vehículos
      </button>

      {/* Ficha */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 40 }}>🚗</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>{vehiculo.patente}</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)' }}>{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio ? `· ${vehiculo.anio}` : ''}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Cliente',   vehiculo.cliente?.nombre ?? '—'],
            ['Teléfono',  vehiculo.cliente?.telefono ?? '—'],
            ['Color',     vehiculo.color ?? '—'],
            ['KM actual', vehiculo.km_actual ? `${vehiculo.km_actual.toLocaleString()} km` : '—'],
            ['Visitas',   `${ordenes?.length ?? 0} veces`],
            ['Total gastado', <strong style={{ color: 'var(--accent)' }}>{clp(totalGastado)}</strong>],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Historial de servicios</span>
        </div>
        {!ordenes || ordenes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔧</div>
            <div className="empty-text">Sin historial</div>
          </div>
        ) : (
          ordenes.map(ot => {
            const serv = ot.servicios_ot?.reduce((a, x) => a + (x.precio ?? 0), 0) ?? 0
            const rep  = ot.repuestos_ot?.reduce((a, x) => a + (x.precio_venta ?? 0) * x.cantidad, 0) ?? 0
            return (
              <div key={ot.id} className="list-row">
                <div className="avatar-sq" style={{ fontSize: 18 }}>🔧</div>
                <div className="list-row-info">
                  <div className="list-row-title">OT #{ot.numero_ot}</div>
                  <div className="list-row-sub">{fmtFecha(ot.fecha_ingreso)} · {ot.diagnostico ?? 'Sin diagnóstico'}</div>
                  {ot.km_ingreso && <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{ot.km_ingreso.toLocaleString()} km</div>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{clp(serv + rep)}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function NuevoVehiculoDrawer({ tenantId, onClose, onGuardado }) {
  const [form, setForm] = useState({ patente: '', marca: '', modelo: '', anio: '', color: '', km_actual: '', cliente_id: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const { data: clientes } = useQuery(async () =>
    supabase.from('clientes').select('id, nombre, apellido').eq('tenant_id', tenantId).eq('activo', true).order('nombre'), [tenantId])

  async function handleGuardar() {
    if (!form.patente.trim()) return
    setLoading(true)
    await supabase.from('vehiculos').insert({
      tenant_id:  tenantId,
      patente:    form.patente.toUpperCase().trim(),
      marca:      form.marca || null,
      modelo:     form.modelo || null,
      anio:       form.anio ? Number(form.anio) : null,
      color:      form.color || null,
      km_actual:  form.km_actual ? Number(form.km_actual) : 0,
      cliente_id: form.cliente_id || null,
    })
    setLoading(false)
    onGuardado()
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Nuevo vehículo</div>

        <div className="input-group">
          <label className="input-label">Patente *</label>
          <input className="input" value={form.patente} onChange={e => set('patente', e.target.value.toUpperCase())}
            placeholder="ABCD12" style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Marca</label>
            <input className="input" value={form.marca} onChange={e => set('marca', e.target.value)} placeholder="Toyota" />
          </div>
          <div className="input-group">
            <label className="input-label">Modelo</label>
            <input className="input" value={form.modelo} onChange={e => set('modelo', e.target.value)} placeholder="Corolla" />
          </div>
          <div className="input-group">
            <label className="input-label">Año</label>
            <input className="input" type="number" value={form.anio} onChange={e => set('anio', e.target.value)} placeholder="2018" />
          </div>
          <div className="input-group">
            <label className="input-label">Color</label>
            <input className="input" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Blanco" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">KM actual</label>
          <input className="input" type="number" value={form.km_actual} onChange={e => set('km_actual', e.target.value)} placeholder="85000" />
        </div>

        <div className="input-group">
          <label className="input-label">Cliente (opcional)</label>
          <select className="input" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
            <option value="">-- Sin cliente --</option>
            {clientes?.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.apellido ?? ''}</option>)}
          </select>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGuardar} disabled={loading || !form.patente.trim()}>
          {loading ? 'Guardando...' : 'Agregar vehículo'}
        </button>
      </div>
    </div>
  )
}
