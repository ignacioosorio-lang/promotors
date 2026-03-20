import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

export const TZ = 'America/Santiago'

export const fmt = (date, pattern) =>
  format(new Date(date), pattern, { locale: es })

export const fmtFecha   = (d) => fmt(d, "d 'de' MMMM yyyy")
export const fmtHora    = (d) => fmt(d, 'HH:mm')
export const fmtDia     = (d) => fmt(d, 'EEEE d MMM', { locale: es })
export const fmtMes     = (d) => fmt(d, 'MMMM yyyy')
export const fmtCorto   = (d) => fmt(d, 'dd/MM/yyyy')

export const hoyRango   = () => ({ desde: startOfDay(new Date()).toISOString(), hasta: endOfDay(new Date()).toISOString() })
export const semanaRango= () => ({ desde: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(), hasta: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString() })
export const mesRango   = () => ({ desde: startOfMonth(new Date()).toISOString(), hasta: endOfMonth(new Date()).toISOString() })

// Formatear como pesos chilenos
export const clp = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n ?? 0)

// Iniciales para avatar
export const iniciales = (nombre = '', apellido = '') =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()

// Color de avatar determinista por nombre
const COLORES = [
  { bg: '#e6f1fb', color: '#185fa5' },
  { bg: '#eaf3de', color: '#3b6d11' },
  { bg: '#faeeda', color: '#854f0b' },
  { bg: '#fbeaf0', color: '#993556' },
  { bg: '#eeedfe', color: '#534ab7' },
  { bg: '#e1f5ee', color: '#0f6e56' },
  { bg: '#faece7', color: '#993c1d' },
]
export const colorAvatar = (nombre = '') =>
  COLORES[nombre.charCodeAt(0) % COLORES.length]
