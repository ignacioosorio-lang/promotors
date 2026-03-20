import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import { useQuery } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { clp, hoyRango, semanaRango, mesRango } from '../../../lib/utils'

const TABS = ['Hoy', 'Semana', 'Mes']

export default function Caja({ drawerOpen: fabOpen, onCloseDrawer }) {
  const { tenant } = useAuth()
  const [tab,       setTab]      = useState(0)
  const [cobroOpen, setCobroOpen]= useState(false)

  useEffect(() => { if (fabOpen) setCobroOpen(true) }, [fabOpen])

  const rango = tab === 0 ? hoyRango() : tab === 1 ? semanaRango() : mesRango()

  const { data: cobros, loading, refetch } = useQuery(async () =>
    supabase.from('cobros')
      .select('*, orden:ordenes_trabajo(numero_ot, vehiculo:vehiculos(patente))')
      .eq('tenant_id', tenant?.id)
      .gte('created_at', rango.desde)
      .lte('created_at', rango.hasta)
      .order('created_at', { ascending: false }), [tenant?.id, tab])

  const total     = cobros?.reduce((s, c) => s + c.monto, 0) ?? 0
  const efectivo  = cobros?.filter(c => c.metodo_pago === 'efectivo').reduce((s, c) => s + c.monto, 0) ?? 0
  const transfer  = cobros?.filter(c => c.metodo_pago === 'transferencia').reduce((s, c) => s + c.monto, 0) ?? 0
  const tarjeta   = cobros?.filter(c => ['debito','credito'].includes(c.metodo_pago)).reduce((s, c) => s + c.monto, 0) ?? 0

  return (
    <>
      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">Total ingresos</div>
          <div className="metric-value" style={{ color: 'var(--accent)', fontSize: 20 }}>{clp(total)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Movimientos</div>
          <div className="metric-value">{cobros?.length ?? 0}</div>
        </div>
      </div>

      {/* Desglose por método */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Efectivo',      val: efectivo, color: '#4caf50', pct: total > 0 ? Math.round((efectivo/total)*100) : 0 },
          { label: 'Transferencia', val: transfer,  color: '#3b82f6', pct: total > 0 ? Math.round((transfer/total)*100)  : 0 },
          { label: 'Tarjeta',       val: tarjeta,   color: '#9c6bdf', pct: total > 0 ? Math.round((tarjeta/total)*100)   : 0 },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{clp(m.val)}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.pct}%</div>
          </div>
        ))}
      </div>

      {/* Lista de cobros */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Movimientos</span>
        </div>
        {loading && <div className="spinner" />}
        {!loading && (!cobros || cobros.length === 0) && (
          <div className="empty">
            <div className="empty-icon">💰</div>
            <div className="empty-text">Sin movimientos en este período</div>
          </div>
        )}
        {cobros?.map(c => {
          const icono = c.metodo_pago === 'efectivo' ? '💵' : c.metodo_pago === 'transferencia' ? '📲' : '💳'
          return (
            <div key={c.id} className="list-row">
              <span style={{ fontSize: 22 }}>{icono}</span>
              <div className="list-row-info">
                <div className="list-row-title">
                  {c.orden ? `OT #${c.orden.numero_ot} · ${c.orden.vehiculo?.patente ?? ''}` : c.notas ?? 'Cobro manual'}
                </div>
                <div className="list-row-sub">
                  {c.metodo_pago} · {new Date(c.created_at).toLocaleDateString('es-CL')}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ok-text)' }}>+{clp(c.monto)}</div>
            </div>
          )
        })}
      </div>

      {cobroOpen && (
        <CobroManualDrawer
          tenantId={tenant?.id}
          onClose={() => { setCobroOpen(false); onCloseDrawer?.() }}
          onGuardado={refetch}
        />
      )}
    </>
  )
}

function CobroManualDrawer({ tenantId, onClose, onGuardado }) {
  const [monto,      setMonto]     = useState('')
  const [metodo,     setMetodo]    = useState('efectivo')
  const [notas,      setNotas]     = useState('')
  const [loading,    setLoading]   = useState(false)

  async function handleGuardar() {
    if (!monto) return
    setLoading(true)
    await supabase.from('cobros').insert({
      tenant_id:   tenantId,
      monto:       Number(monto),
      metodo_pago: metodo,
      notas:       notas || 'Cobro manual',
    })
    setLoading(false)
    onGuardado()
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Cobro manual</div>

        <div className="input-group">
          <label className="input-label">Monto *</label>
          <input className="input" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="15000" style={{ fontSize: 20, fontWeight: 700 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { value: 'efectivo',      label: 'Efectivo',     icon: '💵' },
            { value: 'transferencia', label: 'Transferencia', icon: '📲' },
            { value: 'debito',        label: 'Débito',        icon: '💳' },
            { value: 'credito',       label: 'Crédito',       icon: '💳' },
          ].map(m => (
            <button key={m.value} onClick={() => setMetodo(m.value)}
              style={{ padding: '14px 8px', background: metodo === m.value ? 'rgba(230,51,41,0.12)' : 'var(--surface2)', border: `1.5px solid ${metodo === m.value ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: metodo === m.value ? 'var(--accent)' : 'var(--text-1)' }}>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="input-group">
          <label className="input-label">Descripción</label>
          <input className="input" value={notas} onChange={e => setNotas(e.target.value)} placeholder="Venta repuesto, servicio, etc." />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGuardar} disabled={loading || !monto}>
          {loading ? 'Guardando...' : 'Registrar cobro'}
        </button>
      </div>
    </div>
  )
}
