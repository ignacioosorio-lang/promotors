import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-sans)' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f0f0f0', letterSpacing: 1 }}>
          Pro Motor<span style={{ color: '#e63329' }}>'s</span>
        </div>
        <div style={{ fontSize: 12, color: '#555', marginTop: 4, textTransform: 'uppercase', letterSpacing: 2 }}>
          Panel de Control
        </div>
      </div>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360 }}>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com" required />
        </div>
        <div className="input-group">
          <label className="input-label">Contraseña</label>
          <input className="input" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required />
        </div>

        {error && (
          <div style={{ color: '#e63329', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>
        )}

        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading
            ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
