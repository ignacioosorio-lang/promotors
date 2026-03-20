import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/AuthContext'
import { useQuery, useMutation } from '../../../hooks/useQuery'
import { supabase } from '../../../lib/supabase'
import { clp, fmtFecha, fmtFechaCorta, estadoOT } from '../../../lib/utils'
import { EstadoBadgeOT } from '../dashboard/Dashboard'

const ESTADOS = ['recibido', 'proceso', 'listo', 'entregado']

export default function Ordenes({ drawerOpen: fabOpen, onCloseDrawer }) {
  const { tenant } = useAuth()
  const [filtro,     setFiltro]    = useState('activas')
  const [selected,   setSelected]  = useState(null)
  const [nuevoOpen,  setNuevoOpen] = useState(false)
  const [vista,      setVista]     = useState('lista') // lista | detalle

  useEffect(() => { if (fabOpen) setNuevoOpen(true) }, [fabOpen])

  const { data: ordenes, loading, refetch } = useQuery(async () => {
    let q = supabase.from('ordenes_trabajo')
      .select('*, vehiculo:vehiculos(patente, marca, modelo, anio), cliente:clientes(nombre, apellido, telefono)')
      .eq('tenant_id', tenant?.id)
      .order('fecha_ingreso', { ascending: false })
    if (filtro === 'activas') q = q.in('estado', ['recibido', 'proceso', 'listo'])
    if (filtro === 'listas')  q = q.eq('estado', 'listo')
    if (filtro === 'entregadas') q = q.eq('estado', 'entregado')
    return q
  }, [tenant?.id, filtro])

  async function cambiarEstado(id, estado) {
    await supabase.from('ordenes_trabajo').update({ estado, updated_at: new Date().toISOString() }).eq('id', id)
    await refetch()
  }

  async function handleCompletar(ot, metodoPago) {
    const total = (ot.mano_obra ?? 0) + (ot.total_repuestos ?? 0)
    await supabase.from('ordenes_trabajo').update({
      estado:       'entregado',
      metodo_pago:  metodoPago,
      fecha_entrega: new Date().toISOString(),
      pagado:       true,
      updated_at:   new Date().toISOString()
    }).eq('id', ot.id)
    await supabase.from('cobros').insert({
      tenant_id:   tenant?.id,
      orden_id:    ot.id,
      monto:       total,
      metodo_pago: metodoPago,
      notas:       `OT #${ot.numero_ot} - ${ot.vehiculo?.patente}`,
    })
    await refetch()
    setSelected(null)
  }

  if (selected) {
    return (
      <DetalleOT
        ot={selected}
        onBack={() => setSelected(null)}
        onCambiarEstado={cambiarEstado}
        onCompletar={handleCompletar}
        onRefetch={refetch}
        tenantId={tenant?.id}
      />
    )
  }

  return (
    <>
      <div className="tabs">
        {[
          { id: 'activas',    label: 'Activas' },
          { id: 'listas',     label: 'Listas' },
          { id: 'entregadas', label: 'Entregadas' },
          { id: 'todas',      label: 'Todas' },
        ].map(f => (
          <button key={f.id} className={`tab ${filtro === f.id ? 'active' : ''}`} onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card">
        {loading && <div className="spinner" />}
        {!loading && (!ordenes || ordenes.length === 0) && (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <div className="empty-text">Sin órdenes</div>
          </div>
        )}
        {ordenes?.map(ot => (
          <div key={ot.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => setSelected(ot)}>
            <div className="avatar-sq" style={{ fontSize: 20 }}>🚗</div>
            <div className="list-row-info">
              <div className="list-row-title">
                #{ot.numero_ot} · {ot.vehiculo?.patente ?? '—'}
              </div>
              <div className="list-row-sub">
                {ot.vehiculo?.marca} {ot.vehiculo?.modelo} · {ot.cliente?.nombre}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                {fmtFecha(ot.fecha_ingreso)}
              </div>
            </div>
            <div className="list-row-right">
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                {clp((ot.mano_obra ?? 0) + (ot.total_repuestos ?? 0))}
              </div>
              <EstadoBadgeOT estado={ot.estado} />
            </div>
          </div>
        ))}
      </div>

      {nuevoOpen && (
        <NuevaOTDrawer
          tenantId={tenant?.id}
          onClose={() => { setNuevoOpen(false); onCloseDrawer?.() }}
          onGuardado={refetch}
        />
      )}
    </>
  )
}

function DetalleOT({ ot, onBack, onCambiarEstado, onCompletar, onRefetch, tenantId }) {
  const [vista,      setVista]     = useState('detalle') // detalle | pago | agregar
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [guardando,  setGuardando] = useState(false)
  const [tipoAgregar, setTipoAgregar] = useState('servicio') // servicio | repuesto

  const { data: servicios, refetch: refServ } = useQuery(async () =>
    supabase.from('servicios_ot').select('*').eq('orden_id', ot.id), [ot.id])

  const { data: repuestos, refetch: refRep } = useQuery(async () =>
    supabase.from('repuestos_ot').select('*').eq('orden_id', ot.id), [ot.id])

  const totalServicios = servicios?.reduce((s, x) => s + (x.precio ?? 0), 0) ?? 0
  const totalRepuestos = repuestos?.reduce((s, x) => s + ((x.precio_venta ?? 0) * x.cantidad), 0) ?? 0
  const totalOT        = totalServicios + totalRepuestos

  async function handleEntrega() {
    setGuardando(true)
    await onCompletar(ot, metodoPago)
    setGuardando(false)
  }

  // Generar mensaje WhatsApp "listo"
  function avisarWhatsApp() {
    const tel    = ot.cliente?.telefono?.replace(/\D/g, '')
    const numero = tel?.startsWith('56') ? tel : `56${tel}`
    const msg    = encodeURIComponent(`Hola ${ot.cliente?.nombre} 👋 tu vehículo *${ot.vehiculo?.patente} ${ot.vehiculo?.marca} ${ot.vehiculo?.modelo}* ya está listo para retirar en Pro Motor's 🔧\n\nLas Torres Ote. 122, Quilicura 📍\n\nTotal: *${clp(totalOT)}*`)
    window.open(`https://wa.me/${numero}?text=${msg}`, '_blank')
  }

  return (
    <div>
      <button onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
        ← Volver a órdenes
      </button>

      {/* Header OT */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>OT #{ot.numero_ot}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{fmtFecha(ot.fecha_ingreso)}</div>
          </div>
          <EstadoBadgeOT estado={ot.estado} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Patente',  ot.vehiculo?.patente ?? '—'],
            ['Vehículo', `${ot.vehiculo?.marca ?? ''} ${ot.vehiculo?.modelo ?? ''}`],
            ['Cliente',  ot.cliente?.nombre ?? '—'],
            ['Teléfono', ot.cliente?.telefono ?? '—'],
            ['KM ingreso', ot.km_ingreso ? `${ot.km_ingreso.toLocaleString()} km` : '—'],
            ['Total',    <strong style={{ color: 'var(--accent)' }}>{clp(totalOT)}</strong>],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        {ot.diagnostico && (
          <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8, fontSize: 12, color: 'var(--text-2)' }}>
            🔍 {ot.diagnostico}
          </div>
        )}
      </div>

      {/* Servicios */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Mano de obra ({clp(totalServicios)})</span>
          {!['entregado','cancelado'].includes(ot.estado) && (
            <button onClick={() => { setTipoAgregar('servicio'); setVista('agregar') }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 20, cursor: 'pointer' }}>+</button>
          )}
        </div>
        {servicios?.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Sin servicios agregados</div>}
        {servicios?.map(s => (
          <div key={s.id} className="list-row">
            <div className="list-row-info">
              <div className="list-row-title">{s.nombre}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{clp(s.precio)}</div>
          </div>
        ))}
      </div>

      {/* Repuestos */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">Repuestos ({clp(totalRepuestos)})</span>
          {!['entregado','cancelado'].includes(ot.estado) && (
            <button onClick={() => { setTipoAgregar('repuesto'); setVista('agregar') }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 20, cursor: 'pointer' }}>+</button>
          )}
        </div>
        {repuestos?.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Sin repuestos agregados</div>}
        {repuestos?.map(r => (
          <div key={r.id} className="list-row">
            <div className="list-row-info">
              <div className="list-row-title">{r.nombre}</div>
              <div className="list-row-sub">x{r.cantidad} · Costo: {clp(r.precio_compra)}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{clp(r.precio_venta * r.cantidad)}</div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      {!['entregado','cancelado'].includes(ot.estado) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {ot.estado !== 'proceso' && (
            <button className="btn btn-primary btn-full" onClick={() => onCambiarEstado(ot.id, 'proceso')}>
              ⚙️ Marcar en proceso
            </button>
          )}
          {ot.estado !== 'listo' && (
            <button className="btn btn-primary btn-full" style={{ background: '#2d7a3a' }}
              onClick={async () => { await onCambiarEstado(ot.id, 'listo'); onRefetch() }}>
              ✅ Marcar como listo
            </button>
          )}
          {ot.estado === 'listo' && ot.cliente?.telefono && (
            <button className="btn btn-full" style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', fontSize: 14 }}
              onClick={avisarWhatsApp}>
              💬 Avisar por WhatsApp que está listo
            </button>
          )}
          {ot.estado === 'listo' && (
            <button className="btn btn-primary btn-full" style={{ background: '#185fa5' }}
              onClick={() => setVista('pago')}>
              💰 Registrar entrega y cobro
            </button>
          )}
          <button className="btn btn-secondary btn-full" onClick={() => onCambiarEstado(ot.id, 'cancelado')}>
            ✗ Cancelar OT
          </button>
        </div>
      )}

      {/* Vista pago */}
      {vista === 'pago' && (
        <div className="overlay" onClick={() => setVista('detalle')}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div className="drawer-title">Registrar cobro</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
              OT #{ot.numero_ot} · {ot.vehiculo?.patente} · <strong style={{ color: 'var(--accent)' }}>{clp(totalOT)}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { value: 'efectivo',      label: 'Efectivo',     icon: '💵' },
                { value: 'transferencia', label: 'Transferencia', icon: '📲' },
                { value: 'debito',        label: 'Débito',        icon: '💳' },
                { value: 'credito',       label: 'Crédito',       icon: '💳' },
              ].map(m => (
                <button key={m.value} onClick={() => setMetodoPago(m.value)}
                  style={{ padding: '16px 8px', background: metodoPago === m.value ? 'rgba(230,51,41,0.12)' : 'var(--surface2)', border: `1.5px solid ${metodoPago === m.value ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: metodoPago === m.value ? 'var(--accent)' : 'var(--text-1)' }}>{m.label}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-full" style={{ background: '#185fa5', marginBottom: 8 }}
              onClick={handleEntrega} disabled={guardando}>
              {guardando ? 'Guardando...' : '✔ Confirmar entrega y cobro'}
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => setVista('detalle')}>Volver</button>
          </div>
        </div>
      )}

      {/* Vista agregar servicio/repuesto */}
      {vista === 'agregar' && (
        <AgregarItemDrawer
          tipo={tipoAgregar}
          ordenId={ot.id}
          tenantId={tenantId}
          onClose={() => setVista('detalle')}
          onGuardado={() => { refServ(); refRep(); setVista('detalle') }}
        />
      )}
    </div>
  )
}

function AgregarItemDrawer({ tipo, ordenId, tenantId, onClose, onGuardado }) {
  const [nombre,   setNombre]   = useState('')
  const [precio,   setPrecio]   = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [precioC,  setPrecioC]  = useState('')
  const [loading,  setLoading]  = useState(false)

  const { data: productos } = useQuery(async () =>
    supabase.from('productos').select('*').eq('tenant_id', tenantId).eq('activo', true).order('nombre'), [tenantId])

  async function handleGuardar() {
    setLoading(true)
    if (tipo === 'servicio') {
      await supabase.from('servicios_ot').insert({ orden_id: ordenId, nombre, precio: Number(precio) })
      await supabase.from('ordenes_trabajo').update({ mano_obra: supabase.rpc('get_mano_obra', { p_orden: ordenId }) }).eq('id', ordenId)
    } else {
      await supabase.from('repuestos_ot').insert({
        orden_id: ordenId, nombre, cantidad: Number(cantidad),
        precio_compra: Number(precioC), precio_venta: Number(precio)
      })
      // Descontar stock si se seleccionó producto
      await supabase.from('ordenes_trabajo').update({
        total_repuestos: supabase.rpc('get_total_repuestos', { p_orden: ordenId })
      }).eq('id', ordenId)
    }
    setLoading(false)
    onGuardado()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Agregar {tipo === 'servicio' ? 'servicio' : 'repuesto'}</div>

        {tipo === 'repuesto' && productos && productos.length > 0 && (
          <div className="input-group">
            <label className="input-label">Seleccionar del inventario (opcional)</label>
            <select className="input" onChange={e => {
              const p = productos.find(x => x.id === e.target.value)
              if (p) { setNombre(p.nombre); setPrecio(p.precio_venta ?? ''); setPrecioC(p.precio_compra ?? '') }
            }}>
              <option value="">-- Elegir repuesto --</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stock_actual})</option>
              ))}
            </select>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">{tipo === 'servicio' ? 'Descripción del servicio' : 'Nombre del repuesto'} *</label>
          <input className="input" value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder={tipo === 'servicio' ? 'Cambio de aceite y filtro' : 'Filtro de aceite Toyota'} />
        </div>

        {tipo === 'repuesto' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="input-group">
              <label className="input-label">Cantidad</label>
              <input className="input" type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Precio costo</label>
              <input className="input" type="number" value={precioC} onChange={e => setPrecioC(e.target.value)} placeholder="8000" />
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Precio de venta *</label>
          <input className="input" type="number" value={precio} onChange={e => setPrecio(e.target.value)}
            placeholder={tipo === 'servicio' ? '15000' : '14000'} />
        </div>

        {tipo === 'repuesto' && precio && precioC && (
          <div style={{ padding: '10px 12px', background: 'var(--ok-bg)', borderRadius: 'var(--radius-md)', marginBottom: 12, fontSize: 13, color: 'var(--ok-text)', fontWeight: 600 }}>
            Margen: +{clp(Number(precio) - Number(precioC))} ({Math.round(((Number(precio) - Number(precioC)) / Number(precioC)) * 100)}%)
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={handleGuardar}
          disabled={loading || !nombre.trim() || !precio}>
          {loading ? 'Guardando...' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}

function NuevaOTDrawer({ tenantId, onClose, onGuardado }) {
  const [patente,    setPatente]    = useState('')
  const [clienteId,  setClienteId]  = useState('')
  const [vehiculoId, setVehiculoId] = useState('')
  const [kmIngreso,  setKmIngreso]  = useState('')
  const [diagnostico,setDiagnostico]= useState('')
  const [manoObra,   setManoObra]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [paso,       setPaso]       = useState(1)

  const { data: clientes } = useQuery(async () =>
    supabase.from('clientes').select('id, nombre, apellido').eq('tenant_id', tenantId).eq('activo', true).order('nombre'), [tenantId])

  const { data: vehiculos } = useQuery(async () => {
    if (!clienteId) return []
    return supabase.from('vehiculos').select('*').eq('cliente_id', clienteId).eq('activo', true)
  }, [clienteId])

  async function handleGuardar() {
    setLoading(true)
    let vId = vehiculoId

    // Si no hay vehículo seleccionado pero hay patente, crear vehículo
    if (!vId && patente.trim()) {
      const { data: v } = await supabase.from('vehiculos').insert({
        tenant_id:  tenantId,
        cliente_id: clienteId || null,
        patente:    patente.toUpperCase().trim(),
        km_actual:  kmIngreso ? Number(kmIngreso) : 0,
      }).select('id').single()
      if (v) vId = v.id
    }

    await supabase.from('ordenes_trabajo').insert({
      tenant_id:   tenantId,
      vehiculo_id: vId || null,
      cliente_id:  clienteId || null,
      km_ingreso:  kmIngreso ? Number(kmIngreso) : null,
      diagnostico: diagnostico || null,
      mano_obra:   manoObra ? Number(manoObra) : 0,
      estado:      'recibido',
    })

    setLoading(false)
    onGuardado()
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <div className="drawer-title">Nueva Orden de Trabajo</div>

        <div className="input-group">
          <label className="input-label">Cliente (opcional)</label>
          <select className="input" value={clienteId} onChange={e => { setClienteId(e.target.value); setVehiculoId('') }}>
            <option value="">-- Sin cliente --</option>
            {clientes?.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.apellido ?? ''}</option>)}
          </select>
        </div>

        {clienteId && vehiculos && vehiculos.length > 0 && (
          <div className="input-group">
            <label className="input-label">Vehículo del cliente</label>
            <select className="input" value={vehiculoId} onChange={e => {
              setVehiculoId(e.target.value)
              const v = vehiculos.find(x => x.id === e.target.value)
              if (v) setPatente(v.patente)
            }}>
              <option value="">-- Nuevo vehículo --</option>
              {vehiculos.map(v => <option key={v.id} value={v.id}>{v.patente} · {v.marca} {v.modelo}</option>)}
            </select>
          </div>
        )}

        {!vehiculoId && (
          <div className="input-group">
            <label className="input-label">Patente *</label>
            <input className="input" value={patente} onChange={e => setPatente(e.target.value.toUpperCase())}
              placeholder="ABCD12" style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }} />
          </div>
        )}

        <div className="input-group">
          <label className="input-label">KM de ingreso</label>
          <input className="input" type="number" value={kmIngreso} onChange={e => setKmIngreso(e.target.value)} placeholder="85000" />
        </div>

        <div className="input-group">
          <label className="input-label">Diagnóstico / trabajo a realizar</label>
          <input className="input" value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
            placeholder="Cambio aceite, revisión frenos..." />
        </div>

        <div className="input-group">
          <label className="input-label">Mano de obra estimada</label>
          <input className="input" type="number" value={manoObra} onChange={e => setManoObra(e.target.value)} placeholder="15000" />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGuardar}
          disabled={loading || (!patente.trim() && !vehiculoId)}>
          {loading ? 'Creando OT...' : 'Crear Orden de Trabajo'}
        </button>
      </div>
    </div>
  )
}
