import { useEffect, useState } from 'react'
import { loadXml } from '../utils/xml.js'

// useXmlConfig — load one XML config file and map it to data with a parser fn.
// Returns { data, loading, error } so components can render gracefully.
export function useXmlConfig(name, parser) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    loadXml(name)
      .then((doc) => alive && setState({ data: parser(doc), loading: false, error: null }))
      .catch((err) => alive && setState({ data: null, loading: false, error: err.message }))
    return () => {
      alive = false
    }
    // parser is defined per-section module and is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  return state
}
