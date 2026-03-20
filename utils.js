import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export const clp = n => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', minimumFractionDigits: 0
}).format(n ?? 0)

export const fmtFecha = d => new Date(d).toLocaleDateString('es-CL', {
  day: '2-digit', month: '2-digit', year: 'numeric'
})

export const fmtFechaCorta = d => new Date(d).toLocaleDateString('es-CL', {
  day: '2-digit', month: '2-digit'
})

export const fmtHora = d => new Date(d).toLocaleTimeString('es-CL', {
  hour: '2-digit', minute: '2-digit'
})

export const hoyRango = () => ({
  desde: startOfDay(new Date()).toISOString(),
  hasta: endOfDay(new Date()).toISOString(),
})

export const semanaRango = () => ({
  desde: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
  hasta: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
})

export const mesRango = () => ({
  desde: startOfMonth(new Date()).toISOString(),
  hasta: endOfMonth(new Date()).toISOString(),
})

export const iniciales = (nombre = '', apellido = '') =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()

const COLORES = [
  { bg: '#1a2744', color: '#6c8ebf' },
  { bg: '#1a2b1a', color: '#4caf50' },
  { bg: '#2b1a1a', color: '#e63329' },
  { bg: '#2b2410', color: '#ef9f27' },
  { bg: '#1e1a2b', color: '#9c6bdf' },
  { bg: '#1a2528', color: '#26a69a' },
]

export const colorAvatar = (nombre = '') => {
  const i = nombre.charCodeAt(0) % COLORES.length
  return COLORES[i]
}

export const estadoOT = (estado) => {
  const map = {
    recibido:  { label: 'Recibido',   clase: 'estado-recibido' },
    proceso:   { label: 'En proceso', clase: 'estado-proceso'  },
    listo:     { label: 'Listo',      clase: 'estado-listo'    },
    entregado: { label: 'Entregado',  clase: 'estado-entregado'},
    cancelado: { label: 'Cancelado',  clase: 'estado-cancelado'},
  }
  return map[estado] ?? { label: estado, clase: 'badge-gray' }
}
