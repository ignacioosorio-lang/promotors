import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import { useQuery } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { clp } from '../../../lib/utils'

export default function Inventario({ drawerOpen: fabOpen, onCloseDrawer }) {
  const { tenant } = useAuth()
  const [filtro,    setFiltro]   = useState('todos')
  const [movDrawer, setMovDrawer]= useState(null)
  const [nuevoOpen, setNuevoOpen]= useState(false)

  useEffect(() => { if (fabOpen) setNuevoOpen(true) }, [fabOpen])

  const { data: productos, loading, refetch } = useQuery(async () =>
    supabase.from('productos')
      .select('*')
      .eq('tenant_id', tenant?.id)
      .eq('activo', true)
      .order('nombre'), [tenant?.id])

  const criticos = productos?.filter(p => p.stock_actual === 0) ?? []
  const bajos    = productos?.filter(p => p.stock_actual > 0 && p.stock_actual <= p.stock_minimo) ?? []
  const ok       = productos?.filter(p => p.stock_actual > p.stock_minimo) ?? []

  const filtrados = filtro === 'todos' ? (productos ?? [])
    : filtro === 'criticos' ? criticos
    : filtro === 'bajos'    ? bajos : ok

  const totalInvertido  = productos?.reduce((s, p) => s + ((p.precio_compra ?? 0) * p.stock_actual), 0) ?? 0
  const totalValorVenta = productos?.reduce((s, p) => s + ((p.precio_venta  ?? 0) * p.stock_actual), 0) ?? 0
  const gananciaTotal   = totalValorVenta - totalInvertido

  return (
    <>
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">Total repuestos</div>
          <div className="metric-value">{productos?.length ?? 0}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Stock crítico</div>
          <div className="metric-value" style={{ color: criticos.length > 0 ? 'var(--err-text)' : 'var(--ok-text)' }}>
            {criticos.length + bajos.length}
          </div>
        </div>
      </div>

      {(totalInvertido > 0 || totalValorVenta > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Invertido',   val: clp(totalInvertido),  color: 'var(--err-text)', icon: '📦' },
            { label: 'Valor venta', val: clp(totalValorVenta), color: 'var(--accent)',   icon: '💰' },
            { label: 'Ganancia',    val: clp(gananciaTotal),   color: 'var(--ok-text)',  icon: '📈' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 10 }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
      )}

      <div className="tabs">
        {['todos','criticos','bajos','ok'].map(f => (
          <button key={f} className={`tab ${filtro === f ? 'active' : ''}`} onClick={() => setFiltro(f)}>
            {f === 'todos' ? 'Todos' : f === 'criticos' ? 'Crítico' : f === 'bajos' ? 'Bajo' : 'Ok'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading && <div className="spinner" />}
        {!loading && filtrados.length === 0 && (
          <div className="empty"><div className="empty-icon">📦</div><div className="empty-text">Sin repuestos</div></div>
        )}
        {filtrados.map(p => {
          const pct    = Math.min(100, Math.round((p.stock_actual / Math.max(p.stock_minimo * 2, 1)) * 100))
          const barCol = p.stock_actual === 0 ? '#e63329' : p.stock_actual <= p.stock_minimo ? '#ef9f27' : '#4caf50'
          const badge  = p.stock_actual === 0 ? 'badge-err' : p.stock_actual <= p.stock_minimo ? 'badge-warn' : 'badge-ok'
          const label  = p.stock_actual === 0 ? 'Sin stock' : p.stock_actual <= p.stock_minimo ? 'Bajo' : 'Ok'
          const margen    = (p.precio_venta ?? 0) - (p.precio_compra ?? 0)
          const margenPct = p.precio_compra > 0 ? Math.round((margen / p.precio_compra) * 100) : 0

          return (
            <div key={p.id} className="list-row" style={{ cursor: 'pointer', alignItems: 'flex-start' }}
              onClick={() => setMovDrawer(p)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
                {p.categoria && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{p.categoria}</div>}
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>
                  Stock: <strong>{p.stock_actual}</strong> {p.unidad} / mín: {p.stock_minimo}
                </div>
                <div className="stock-bar" style={{ width: 80, marginTop: 5 }}>
                  <div className="stock-fill" style={{ width: `${pct}%`, background: barCol }} />
                </div>
                {(p.precio_compra > 0 || p.precio_venta > 0) && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {p.precio_compra > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>
                        Costo: {clp(p.precio_compra)}
                      </span>
                    )}
                    {p.precio_venta > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--accent)', background: 'rgba(230,51,41,0.08)', padding: '2px 6px', borderRadius: 4 }}>
                        Venta: {clp(p.precio_venta)}
                      </span>
                    )}
                    {margen > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--ok-text)', background: 'var(--ok-bg)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        +{clp(margen)} ({margenPct}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className={`badge ${badge}`}>{label}</span>
            </div>
          )
        })}
      </div>

      {movDrawer && (
        <MovimientoDrawer
          producto={movDrawer}
          tenantId={tenant?.id}
          onClose={() => setMovDrawer(null)}
          onGuardado={() => { refetch(); setMovDrawer(null) }}
        />
      )}

      {nuevoOpen && (
        <NuevoProductoDrawer
          tenantId={tenant?.id}
          onClose={() => { setNuevoOpen(false); onCloseDrawer?.() }}
          onGuardado={refetch}
        />
      )}
    </>
  )
}

function MovimientoDrawer({ producto, tenantId, onClose, onGuardado }) {
  const [tipo,         setTipo]        = useState('entrada')
  const [cantidad,     setCantidad]    = useState(1)
  const [motivo,       setMotivo]      = useState('')
  const [precioVenta,  setPrecioVenta] = useState(producto.precio_venta ?? '')
  const [precioCompra, setPrecioCompra]= useState(producto.precio_compra ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading,      setLoading]     = useState(false)

  async function handleGuardar() {
    setLoading(true)
    const stockNuevo = tipo === 'entrada'
      ? producto.stock_actual + Number(cantidad)
      : tipo === 'salida'
      ? Math.max(0, producto.stock_actual - Number(cantidad))
      : Number(cantidad)

    await supabase.from('productos').update({
      stock_actual:  stockNuevo,
      precio_venta:  precioVenta  ? Number(precioVenta)  : null,
      precio_compra: precioCompra ? Number(precioCompra) : null,
      updated_at:    new Date().toISOString()
    }).eq('id', producto.id)

    await supabase.from('movimientos_inventario').insert({
      tenant_id:      tenantId,
      producto_id:    producto.id,
      tipo, cantidad: Number(cantidad),
      stock_anterior: producto.stock_actual,
      stock_nuevo:    stockNuevo,
      motivo,
    })
    setLoading(false)
    onGuardado()
  }

  async function handleEliminar() {
    await supabase.from('productos').update({ activo: false }).eq('id', producto.id)
    onGuardado()
  }

  const margen    = (Number(precioVenta) || 0) - (Number(precioCompra) || 0)
  const margenPct = Number(precioCompra) > 0 ? Math.round((margen / Number(precioCompra)) * 100) : 0

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="drawer-title" style={{ margin: 0 }}>{producto.nombre}</div>
          <button onClick={() => setConfirmDelete(true)}
            style={{ background: 'var(--err-bg)', border: '0.5px solid var(--err-text)', borderRadius: 8, color: 'var(--err-text)', fontSize: 11, fontWeight: 600, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
            🗑 Eliminar
          </button>
        </div>

        {confirmDelete && (
          <div style={{ background: 'var(--err-bg)', border: '1px solid var(--err-text)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--err-text)', marginBottom: 8 }}>¿Eliminar "{producto.nombre}"?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>Cancelar</button>
              <button style={{ flex: 1, background: 'var(--err-text)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, padding: 10, cursor: 'pointer', fontFamily: 'inherit' }} onClick={handleEliminar}>Eliminar</button>
            </div>
          </div>
        )}

        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
          Stock actual: <strong>{producto.stock_actual}</strong> {producto.unidad}
        </div>

        <div className="input-group">
          <label className="input-label">Tipo de movimiento</label>
          <select className="input" value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="entrada">Entrada (llegó stock)</option>
            <option value="salida">Salida (se usó / vendió)</option>
            <option value="ajuste">Ajuste (corrección)</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">{tipo === 'ajuste' ? 'Nuevo stock total' : 'Cantidad'}</label>
          <input className="input" type="number" min="0" value={cantidad} onChange={e => setCantidad(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Precio costo</label>
            <input className="input" type="number" value={precioCompra} onChange={e => setPrecioCompra(e.target.value)} placeholder="8000" />
          </div>
          <div className="input-group">
            <label className="input-label">Precio venta</label>
            <input className="input" type="number" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)} placeholder="14000" />
          </div>
        </div>

        {margen > 0 && (
          <div style={{ padding: '10px 12px', background: 'var(--ok-bg)', borderRadius: 'var(--radius-md)', marginBottom: 12, fontSize: 13, color: 'var(--ok-text)', fontWeight: 600 }}>
            Margen: +{clp(margen)} ({margenPct}%)
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Motivo (opcional)</label>
          <input className="input" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Compra proveedor..." />
        </div>

        <div style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: 13 }}>
          Stock resultante: <strong>
            {tipo === 'entrada' ? producto.stock_actual + Number(cantidad || 0)
            : tipo === 'salida' ? Math.max(0, producto.stock_actual - Number(cantidad || 0))
            : Number(cantidad || 0)} {producto.unidad}
          </strong>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGuardar} disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar movimiento'}
        </button>
      </div>
    </div>
  )
}

function NuevoProductoDrawer({ tenantId, onClose, onGuardado }) {
  const [form, setForm] = useState({ nombre: '', categoria: '', stock_actual: 0, stock_minimo: 2, precio_compra: '', precio_venta: '', unidad: 'un' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const margen    = (Number(form.precio_venta) || 0) - (Number(form.precio_compra) || 0)
  const margenPct = Number(form.precio_compra) > 0 ? Math.round((margen / Number(form.precio_compra)) * 100) : 0

  async function handleGuardar() {
    if (!form.nombre.trim()) return
    setLoading(true)
    await supabase.from('productos').insert({
      ...form,
      tenant_id:     tenantId,
      stock_actual:  Number(form.stock_actual),
      stock_minimo:  Number(form.stock_minimo),
      precio_compra: form.precio_compra ? Number(form.precio_compra) : null,
      precio_venta:  form.precio_venta  ? Number(form.precio_venta)  : null,
    })
    setLoading(false)
    onGuardado()
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Nuevo repuesto</div>

        <div className="input-group">
          <label className="input-label">Nombre *</label>
          <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Filtro de aceite Toyota Corolla" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Categoría</label>
            <input className="input" value={form.categoria} onChange={e => set('categoria', e.target.value)} placeholder="Filtros" />
          </div>
          <div className="input-group">
            <label className="input-label">Unidad</label>
            <select className="input" value={form.unidad} onChange={e => set('unidad', e.target.value)}>
              <option value="un">Unidad</option>
              <option value="lt">Litro</option>
              <option value="kg">Kilo</option>
              <option value="m">Metro</option>
              <option value="set">Set</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Stock inicial</label>
            <input className="input" type="number" min="0" value={form.stock_actual} onChange={e => set('stock_actual', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Stock mínimo</label>
            <input className="input" type="number" min="0" value={form.stock_minimo} onChange={e => set('stock_minimo', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Precio costo</label>
            <input className="input" type="number" value={form.precio_compra} onChange={e => set('precio_compra', e.target.value)} placeholder="8000" />
          </div>
          <div className="input-group">
            <label className="input-label">Precio venta</label>
            <input className="input" type="number" value={form.precio_venta} onChange={e => set('precio_venta', e.target.value)} placeholder="14000" />
          </div>
        </div>

        {margen > 0 && (
          <div style={{ padding: '10px 12px', background: 'var(--ok-bg)', borderRadius: 'var(--radius-md)', marginBottom: 12, fontSize: 13, color: 'var(--ok-text)', fontWeight: 600 }}>
            Margen: +{clp(margen)} ({margenPct}%)
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={handleGuardar} disabled={loading || !form.nombre.trim()}>
          {loading ? 'Guardando...' : 'Agregar repuesto'}
        </button>
      </div>
    </div>
  )
}
