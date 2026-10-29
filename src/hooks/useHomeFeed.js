import { useEffect, useState } from 'react'
import api from '../services/apiClient.js'
import { SAMPLE_FEED } from '../data/sampleFeed.js'

let cache = null
let inflight = null

function load() {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api
      .get('/feed')
      .then((data) => {
        // An empty database still looks broken on a landing page, so only
        // trust the API when it actually has something to show.
        const hasContent = data.jobs?.length || data.scholarships?.length || data.events?.length || data.notices?.length
        cache = hasContent ? { ...data, isSample: false } : SAMPLE_FEED
        return cache
      })
      .catch(() => {
        cache = SAMPLE_FEED
        return cache
      })
  }
  return inflight
}

/** One shared fetch for everything the landing page shows. */
export default function useHomeFeed() {
  const [feed, setFeed] = useState(cache || SAMPLE_FEED)
  const [ready, setReady] = useState(Boolean(cache))

  useEffect(() => {
    let alive = true
    load().then((f) => {
      if (alive) {
        setFeed(f)
        setReady(true)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  return { feed, ready }
}
