import { useEffect, useState } from 'react'
import api from '../services/apiClient.js'

/**
 * Loads `path` from the API and pulls the list out with `pick(data)`.
 * If the request fails or the list is empty, returns `sample` instead and
 * sets `isSample` so the page can say so.
 */
export default function useApiOrSample(path, pick, sample) {
  const [state, setState] = useState({ data: [], loading: true, isSample: false })

  useEffect(() => {
    let alive = true
    api
      .get(path)
      .then((res) => {
        const list = pick(res) || []
        if (!alive) return
        setState(list.length ? { data: list, loading: false, isSample: false } : { data: sample, loading: false, isSample: true })
      })
      .catch(() => alive && setState({ data: sample, loading: false, isSample: true }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return state
}
