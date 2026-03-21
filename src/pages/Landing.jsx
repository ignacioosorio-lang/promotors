import logo from '../assets/logo.png'

const colors = {
  bg:        '#080808',
  accent:    '#e63329',
  text:      '#f0f0f0',
  textMuted: '#a0a0a0',
  card:      '#121212',
}

const services = [
  { title: 'Cambio de Aceite',       desc: 'Mantenimiento preventivo con lubricantes de alta gama.',      icon: '🛢️' },
  { title: 'Diagnóstico Eléctrico',  desc: 'Escaneo computarizado y resolución de fallas complejas.',     icon: '⚡' },
  { title: 'Sistema de Frenos',      desc: 'Seguridad garantizada: rectificado, pastillas y limpieza.',   icon: '🛑' },
  { title: 'Ajuste de Motor',        desc: 'Optimización de rendimiento y reparación especializada.',     icon: '🔧' },
  { title: 'Aire Acondicionado',     desc: 'Carga de gas, limpieza y detección de fugas.',               icon: '❄️' },
  { title: 'Suspensión',             desc: 'Revisión de amortiguadores y tren delantero.',               icon: '🏎️' },
]

export default function Landing() {
  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text, minHeight: '100dvh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 30px rgba(230,51,41,0.2) } 50% { box-shadow: 0 0 70px rgba(230,51,41,0.45) } }
        .hover-red:hover { border-color: ${colors.accent} !important; transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.5); }
        .hover-red { transition: all 0.25s ease; }
        .btn-cta:hover { background-color: #ff3c30 !important; transform: scale(1.04); box-shadow: 0 14px 36px rgba(230,51,41,0.45) !important; }
        .btn-cta { transition: all 0.25s ease; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', animation: 'fadeIn 0.9s ease-out', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 36 }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 260, height: 260, borderRadius: '50%', background: colors.accent, filter: 'blur(80px)', opacity: 0.25, zIndex: 0 }} />
          <img src={logo} alt="Pro Motor's" style={{ width: 240, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 30px rgba(230,51,41,0.3))' }} />
        </div>

        <h1 style={{ fontSize: 13, fontWeight: 300, letterSpacing: 6, color: colors.textMuted, textTransform: 'uppercase', margin: '0 0 10px' }}>
          Ingeniería Automotriz de Precisión
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: colors.accent, fontWeight: 600, letterSpacing: 2 }}>
          Quilicura, Chile
        </p>

        <a href="https://wa.me/56995716490" target="_blank" rel="noreferrer" className="btn-cta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 36, background: '#25D366', color: '#fff', padding: '14px 30px', borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 8px 28px rgba(37,211,102,0.25)' }}>
          💬 Contactar por WhatsApp
        </a>
      </section>

      {/* ── DIVISOR ── */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />
      </div>

      {/* ── SERVICIOS ── */}
      <section style={{ padding: '60px 24px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Servicios</h2>
        <div style={{ width: 36, height: 3, background: colors.accent, borderRadius: 2, margin: '0 auto 32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.map((s, i) => (
            <div key={i} className="hover-red"
              style={{ display: 'flex', alignItems: 'center', gap: 18, background: colors.card, borderRadius: 14, padding: '16px 20px', border: '0.5px solid #1e1e1e' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{s.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: colors.accent, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVISOR ── */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />
      </div>

      {/* ── INFORMACIÓN ── */}
      <section style={{ padding: '60px 24px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Información</h2>
        <div style={{ width: 36, height: 3, background: colors.accent, borderRadius: 2, margin: '0 auto 32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '📍', label: 'Dirección', value: 'Las Torres Ote. 122, Quilicura', link: 'https://maps.google.com/?q=Las+Torres+Ote+122+Quilicura' },
            { icon: '📞', label: 'Teléfono',  value: '+56 9 9571 6490',               link: 'tel:+56995716490' },
            { icon: '📸', label: 'Instagram', value: '@pro.motor.ss',                 link: 'https://instagram.com/pro.motor.ss' },
          ].map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer" className="hover-red"
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: colors.card, borderRadius: 14, padding: '16px 20px', border: '0.5px solid #1e1e1e', textDecoration: 'none', color: colors.text }}>
              <div style={{ width: 42, height: 42, background: 'rgba(230,51,41,0.08)', border: '0.5px solid rgba(230,51,41,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#333', fontSize: 18 }}>›</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '20px 24px 80px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <a href="https://wa.me/56995716490?text=Hola%20Pro%20Motor's,%20me%20gustar%C3%ADa%20agendar%20una%20hora."
          target="_blank" rel="noreferrer" className="btn-cta"
          style={{ display: 'block', background: 'linear-gradient(135deg, #e63329, #b82820)', color: '#fff', padding: '18px', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: 0.5, boxShadow: '0 8px 30px rgba(230,51,41,0.3)' }}>
          🔧 Agendar servicio ahora
        </a>
        <div style={{ marginTop: 16, fontSize: 12, color: '#333' }}>
          Lunes a Sábado · Respuesta inmediata por WhatsApp
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '0.5px solid #141414', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#333' }}>© 2026 Pro Motor's</div>
        <a href="/admin" style={{ fontSize: 11, color: '#2a2a2a', textDecoration: 'none' }}>Panel</a>
      </footer>
    </div>
  )
}
