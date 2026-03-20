import logo from '../assets/logo.png'

export default function Landing() {
  return (
    <div style={{ background: '#080808', minHeight: '100dvh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#f0f0f0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        .fade1 { animation: fadeUp 0.7s ease forwards; }
        .fade2 { animation: fadeUp 0.7s 0.15s ease forwards; opacity:0; }
        .fade3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity:0; }
        .fade4 { animation: fadeUp 0.7s 0.45s ease forwards; opacity:0; }
        .svc-card:hover { border-color: #e63329 !important; transform: translateY(-2px); }
        .svc-card { transition: all 0.2s ease; }
        .btn-wa:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-wa { transition: all 0.2s; }
      `}</style>

      {/* HERO */}
      <div style={{ position: 'relative', padding: '70px 24px 50px', textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(230,51,41,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade1" style={{ marginBottom: 32 }}>
          <img src={logo} alt="Pro Motor's"
            style={{ width: 220, height: 220, objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(230,51,41,0.25))' }} />
        </div>

        <div className="fade2" style={{ marginBottom: 12 }}>
          <div style={{ display: 'inline-block', background: 'rgba(230,51,41,0.1)', border: '0.5px solid rgba(230,51,41,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 11, color: '#e63329', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            Quilicura · Santiago
          </div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7, fontWeight: 300 }}>
            Mecánica automotriz de precisión.<br/>
            Diagnóstico, mantención y reparación profesional.
          </div>
        </div>

        <div className="fade3" style={{ marginTop: 28 }}>
          <a href="https://wa.me/56995716490" target="_blank" rel="noreferrer" className="btn-wa"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '15px 32px', borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 8px 30px rgba(37,211,102,0.25)' }}>
            <span style={{ fontSize: 18 }}>💬</span> Contactar por WhatsApp
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />
      </div>

      {/* SERVICIOS */}
      <div className="fade3" style={{ padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 8 }}>Especialidades</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Nuestros servicios</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '🛢️', label: 'Cambio de aceite y filtros',  desc: 'Todos los tipos y marcas' },
            { icon: '⚡',  label: 'Diagnóstico eléctrico',       desc: 'Escáner computarizado' },
            { icon: '🛑', label: 'Sistema de frenos',            desc: 'Pastillas, discos y líquido' },
            { icon: '⚙️', label: 'Motor y transmisión',          desc: 'Reparación y mantención' },
            { icon: '❄️', label: 'Aire acondicionado',           desc: 'Carga y reparación' },
            { icon: '🔩', label: 'Suspensión y dirección',       desc: 'Alineación y balanceo' },
          ].map((s, i) => (
            <div key={i} className="svc-card"
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#111', border: '0.5px solid #1e1e1e', borderRadius: 14, padding: '14px 18px' }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{s.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#e63329', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '0.5px', background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />
      </div>

      {/* INFO */}
      <div className="fade4" style={{ padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 8 }}>Encuéntranos</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Información</div>
        </div>

        <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: 18, overflow: 'hidden' }}>
          {[
            { icon: '📍', label: 'Dirección', value: 'Las Torres Ote. 122, Quilicura', link: 'https://maps.google.com/?q=Las+Torres+Ote+122+Quilicura' },
            { icon: '📞', label: 'Teléfono',  value: '+56 9 9571 6490',                link: 'tel:+56995716490' },
            { icon: '📸', label: 'Instagram', value: '@pro.motor.ss',                  link: 'https://instagram.com/pro.motor.ss' },
          ].map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < 2 ? '0.5px solid #1a1a1a' : 'none', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: 38, height: 38, background: 'rgba(230,51,41,0.08)', border: '0.5px solid rgba(230,51,41,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#333', fontSize: 16 }}>›</div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ padding: '0 24px 70px', textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <a href="https://wa.me/56995716490?text=Hola%20Pro%20Motor%27s%2C%20necesito%20un%20servicio" target="_blank" rel="noreferrer"
          style={{ display: 'block', background: 'linear-gradient(135deg, #e63329, #b82820)', color: '#fff', padding: '18px', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: 0.5, boxShadow: '0 8px 30px rgba(230,51,41,0.3)' }}>
          🔧 Agendar servicio ahora
        </a>
        <div style={{ marginTop: 20, fontSize: 12, color: '#333' }}>
          Lunes a Sábado · Respuesta inmediata por WhatsApp
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '0.5px solid #141414', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#333' }}>© 2026 Pro Motor's</div>
        <a href="/admin" style={{ fontSize: 11, color: '#2a2a2a', textDecoration: 'none' }}>Panel</a>
      </div>
    </div>
  )
}
