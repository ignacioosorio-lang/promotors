import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Login from './pages/Login'
import Panel from './pages/Panel'
import Landing from './pages/Landing'

function AppInner() {
  const { session, loading } = useAuth()
  const path = window.location.pathname

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #222', borderTop: '3px solid #e63329', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (path === '/admin' || path.startsWith('/admin')) {
    if (!session) return <Login />
    return <Panel />
  }

  return <Landing />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
