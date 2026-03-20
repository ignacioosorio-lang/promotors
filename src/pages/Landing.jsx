export default function Landing() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100dvh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#f0f0f0' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .fade { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* Hero */}
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }} className="fade">
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔧</div>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>
          PRO MOTOR<span style={{ color: '#e63329' }}>'S</span>
        </div>
        <div style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24 }}>
          Mecánica Automotriz
        </div>
        <div style={{ fontSize: 15, color: '#999', marginBottom: 32, lineHeight: 1.6 }}>
          Servicio profesional de mecánica automotriz en Quilicura.<br/>
          Diagnóstico, mantención y reparación de todo tipo de vehículos.
        </div>
        <a href="https://wa.me/56995716490" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>
          💬 Contactar por WhatsApp
        </a>
      </div>

      {/* Servicios */}
      <div style={{ padding: '0 24px 40px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 20, textAlign: 'center' }}>
          Nuestros servicios
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '🛢️', label: 'Cambio de aceite' },
            { icon: '🔋', label: 'Diagnóstico eléctrico' },
            { icon: '🛑', label: 'Sistema de frenos' },
            { icon: '⚙️', label: 'Motor y transmisión' },
            { icon: '❄️', label: 'Aire acondicionado' },
            { icon: '🔩', label: 'Suspensión y dirección' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#141414', border: '0.5px solid #242424', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ccc' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0 24px 40px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: '#141414', border: '0.5px solid #242424', borderRadius: 14, padding: 20 }}>
          {[
            { icon: '📍', label: 'Dirección', value: 'Las Torres Ote. 122, Quilicura' },
            { icon: '📞', label: 'Teléfono',  value: '+56 9 9571 6490' },
            { icon: '📸', label: 'Instagram', value: '@pro.motor.ss' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '0.5px solid #242424' : 'none' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div style={{ padding: '0 24px 60px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <a href="https://wa.me/56995716490?text=Hola%20Pro%20Motor%27s%2C%20necesito%20un%20servicio" target="_blank" rel="noreferrer"
          style={{ display: 'block', background: '#e63329', color: '#fff', padding: '16px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>
          🔧 Agendar servicio ahora
        </a>
      </div>

      {/* Admin link */}
      <div style={{ textAlign: 'center', paddingBottom: 30 }}>
        <a href="/admin" style={{ fontSize: 11, color: '#333', textDecoration: 'none' }}>Panel de control</a>
      </div>
    </div>
  )
}
