import logo from '../assets/logo.png'

const services = [
  { title: 'Cambio de Aceite',      desc: 'Mantenimiento preventivo con lubricantes de alta gama.',    icon: '🛢️' },
  { title: 'Diagnóstico Eléctrico', desc: 'Escaneo computarizado y resolución de fallas complejas.',   icon: '⚡' },
  { title: 'Sistema de Frenos',     desc: 'Seguridad garantizada: rectificado, pastillas y limpieza.', icon: '🛑' },
  { title: 'Ajuste de Motor',       desc: 'Optimización de rendimiento y reparación especializada.',   icon: '🔧' },
  { title: 'Aire Acondicionado',    desc: 'Carga de gas, limpieza y detección de fugas.',              icon: '❄️' },
  { title: 'Suspensión',            desc: 'Revisión de amortiguadores y tren delantero.',              icon: '🏎️' },
]

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#f8f8f8', color: '#111', minHeight: '100dvh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .hover-card:hover { border-color: #e63329 !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .hover-card { transition: all 0.2s ease; }
        .btn-cta:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-cta { transition: all 0.2s ease; }
      `}</style>

      {/* HERO */}
      <section style={{ padding: '70px 24px 50px', textAlign: 'center', maxWidth: 560, margin: '0 auto', animation: 'fadeIn 0.8s ease' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 220, height: 220, borderRadius: '50%', background: '#e63329', filter: 'blur(60px)', opacity: 0.12, zIndex: 0 }} />
          <img src={logo} alt="Pro Motor's" style={{ width: 200, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))' }} />
        </div>

        <div style={{ display: 'inline-block', background: 'rgba(230,51,41,0.08)', border: '0.5px solid rgba(230,51,41,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 11, color: '#e63329', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Quilicura · Santiago
        </div>
        <div style={{ fontSize: 14, color: '#777', lineHeight: 1.7, marginBottom: 28 }}>
          Mecánica automotriz de precisión.<br/>Diagnóstico, mantención y reparación profesional.
        </div>

        <a href="https://wa.me/56995716490" target="_blank" rel="noreferrer" className="btn-cta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 6px 24px rgba(37,211,102,0.3)' }}>
          💬 Contactar por WhatsApp
        </a>
      </section>

      {/* DIVISOR */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '1px', background: '#eee' }} />
      </div>

      {/* SERVICIOS */}
      <section style={{ padding: '50px 24px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6 }}>Especialidades</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Nuestros servicios</div>
          <div style={{ width: 36, height: 3, background: '#e63329', borderRadius: 2, margin: '10px auto 0' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.map((s, i) => (
            <div key={i} className="hover-card"
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{s.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#e63329', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* DIVISOR */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '1px', background: '#eee' }} />
      </div>

      {/* INFORMACIÓN */}
      <section style={{ padding: '50px 24px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6 }}>Encuéntranos</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Información</div>
          <div style={{ width: 36, height: 3, background: '#e63329', borderRadius: 2, margin: '10px auto 0' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {[
            { icon: '📍', label: 'Dirección', value: 'Las Torres Ote. 122, Quilicura', link: 'https://maps.google.com/?q=Las+Torres+Ote+122+Quilicura' },
            { icon: '📞', label: 'Teléfono',  value: '+56 9 9571 6490',               link: 'tel:+56995716490' },
            { icon: '📸', label: 'Instagram', value: '@pro.motor.ss',                 link: 'https://instagram.com/pro.motor.ss' },
          ].map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer" className="hover-card"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none', textDecoration: 'none', color: '#111' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(230,51,41,0.06)', border: '1px solid rgba(230,51,41,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: 18 }}>›</div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '10px 24px 70px', maxWidth: 560, margin: '0 auto' }}>
        <a href="https://wa.me/56995716490?text=Hola%20Pro%20Motor's,%20me%20gustar%C3%ADa%20agendar%20una%20hora."
          target="_blank" rel="noreferrer" className="btn-cta"
          style={{ display: 'block', background: 'linear-gradient(135deg, #e63329, #b82820)', color: '#fff', padding: '18px', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, textAlign: 'center', boxShadow: '0 8px 24px rgba(230,51,41,0.25)' }}>
          🔧 Agendar servicio ahora
        </a>
        <div style={{ marginTop: 14, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Lunes a Sábado · Respuesta inmediata por WhatsApp
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #eee', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#ccc' }}>© 2026 Pro Motor's</div>
        <a href="/admin" style={{ fontSize: 11, color: '#ddd', textDecoration: 'none' }}>Panel</a>
      </footer>
    </div>
  )
}
