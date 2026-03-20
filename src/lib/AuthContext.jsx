import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session,  setSession]  = useState(undefined)  // undefined = cargando
  const [perfil,   setPerfil]   = useState(null)
  const [tenant,   setTenant]   = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) cargarPerfil(data.session.user.id)
      else setLoading(false)
    })

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      if (sess) cargarPerfil(sess.user.id)
      else { setPerfil(null); setTenant(null); setLoading(false) }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function cargarPerfil(userId) {
    const { data: p } = await supabase
      .from('perfiles')
      .select('*, tenant:tenants(*)')
      .eq('id', userId)
      .single()

    if (p) {
      setPerfil(p)
      setTenant(p.tenant)
    }
    setLoading(false)
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  // Helpers de rol
  const esAdmin    = perfil?.rol === 'admin'
  const esBarbero  = perfil?.rol === 'barbero' || esAdmin
  const esAsistente= perfil?.rol === 'asistente' || esAdmin

  return (
    <AuthContext.Provider value={{ session, perfil, tenant, loading, login, logout, esAdmin, esBarbero, esAsistente }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
