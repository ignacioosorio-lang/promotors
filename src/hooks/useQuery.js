import { useEffect, useState, useCallback } from 'react'

/**
 * Hook genérico para consultas a Supabase.
 * queryFn debe ser una función async que retorna { data, error }.
 * Se re-ejecuta cuando cambian las deps.
 */
export function useQuery(queryFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: d, error: e } = await queryFn()
      if (e) throw e
      setData(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run }
}

/**
 * Hook para mutaciones (insert / update / delete).
 * Retorna { mutate, loading, error }.
 */
export function useMutation(mutateFn) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const mutate = async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutateFn(...args)
      if (result?.error) throw result.error
      return result
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
