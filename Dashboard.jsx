import { useAuth } from '../../../lib/AuthContext'
import { useQuery } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { clp, hoyRango, estadoOT } from '../../../lib/utils'

export function EstadoBadgeOT({ estado }) {
  const e = estadoOT(estado)
  return <span className={`badge ${e.clase}`}>{e.label}</span>
}

export default function Dashboard({ onNavigate }) {
  const { tenant } = useAuth()
  const rango = hoyRango()

  const { data: otHoy } = useQuery(async () =>
    supabase.from('ordenes_trabajo')
      .select('*, vehiculo:vehiculos(patente, marca, modelo), cliente:clientes(nombre)')
      .eq('tenant_id', tenant?.id)
      .gte('fecha_ingreso', rango.desde)
      .lte('fecha_ingreso', rango.hasta)
      .order('fecha_ingreso', { ascending: false }), [tenant?.id])

  const { data: otActivas } = useQuery(async () =>
    supabase.from('ordenes_trabajo')
      .select('id, estado, vehiculo:vehiculos(patente)')
      .eq('tenant_id', tenant?.id)
      .in('estado', ['recibido', 'proceso', 'listo'])
      .order('fecha_ingreso'), [tenant?.id])

  const { data: stockCritico } = useQuery(async () =>
    supabase.from('productos')
      .select('id, nombre, stock_actual, stock_minimo')
      .eq('tenant_id', tenant?.id)
      .eq('activo', true)
      .lte('stock_actual', 2), [tenant?.id])

  const { data: cobrosHoy } = useQuery(async () =>
    supabase.from('cobros')
      .select('monto, metodo_pago')
      .eq('tenant_id', tenant?.id)
      .gte('created_at', rango.desde)
      .lte('created_at', rango.hasta), [tenant?.id])

  const totalHoy     = cobrosHoy?.reduce((s, c) => s + c.monto, 0) ?? 0
  const otListas     = otActivas?.filter(o => o.estado === 'listo').length ?? 0
  const otEnProceso  = otActivas?.filter(o => o.estado === 'proceso').length ?? 0

  return (
    <>
      {/* Alertas */}
      {otListas > 0 && (
        <div onClick={() => onNavigate('ordenes')}
          style={{ background: 'var(--ok-bg)', border: '0.5px solid var(--ok-text)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ok-text)' }}>{otListas} vehículo{otListas > 1 ? 's' : ''} listo{otListas > 1 ? 's' : ''} para retirar</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Toca para ver las órdenes</div>
          </div>
        </div>
      )}

      {stockCritico && stockCritico.length > 0 && (
        <div onClick={() => onNavigate('inventario')}
          style={{ background: 'var(--err-bg)', border: '0.5px solid var(--err-text)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--err-text)' }}>{stockCritico.length} repuesto{stockCritico.length > 1 ? 's' : ''} con stock crítico</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Toca para ver el inventario</div>
          </div>
        </div>
      )}

      {/* Métricas del día */}
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">Ingreso hoy</div>
          <div className="metric-value" style={{ fontSize: 18, color: 'var(--accent)' }}>{clp(totalHoy)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">OT activas</div>
          <div className="metric-value">{otActivas?.length ?? 0}</div>
          {otEnProceso > 0 && <div className="metric-delta">{otEnProceso} en proceso</div>}
        </div>
      </div>

      {/* OT de hoy */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Órdenes de hoy</span>
          <button onClick={() => onNavigate('ordenes')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            Ver todas
          </button>
        </div>
        {!otHoy || otHoy.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔧</div>
            <div className="empty-text">Sin órdenes hoy</div>
          </div>
        ) : (
          otHoy.map(ot => (
            <div key={ot.id} className="list-row">
              <div className="avatar-sq">🚗</div>
              <div className="list-row-info">
                <div className="list-row-title">{ot.vehiculo?.patente ?? '—'} · {ot.vehiculo?.marca} {ot.vehiculo?.modelo}</div>
                <div className="list-row-sub">{ot.cliente?.nombre ?? 'Sin cliente'}</div>
              </div>
              <div className="list-row-right">
                <EstadoBadgeOT estado={ot.estado} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Accesos rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { icon: '📋', label: 'Nueva OT',      mod: 'ordenes' },
          { icon: '🚗', label: 'Vehículos',      mod: 'vehiculos' },
          { icon: '📦', label: 'Inventario',     mod: 'inventario' },
          { icon: '💰', label: 'Caja',           mod: 'caja' },
        ].map(a => (
          <button key={a.mod} onClick={() => onNavigate(a.mod)}
            style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}>
            <span style={{ fontSize: 26 }}>{a.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{a.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
