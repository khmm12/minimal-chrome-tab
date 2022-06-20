import { Accessor, createMemo } from 'solid-js'
import createSubscription from './createSubscription'

type MediaQuery = Accessor<boolean> & {
  readonly query: boolean
}

export default function createMediaQuery(query: string): MediaQuery {
  const mediaQueryList = createMemo(() => window.matchMedia(query))

  const val = createSubscription({
    getCurrentValue: () => mediaQueryList().matches,
    subscribe(fn) {
      const mq = mediaQueryList()
      mq.addEventListener('change', fn)
      return () => mq.removeEventListener('change', fn)
    },
  })

  const value = (() => val()) as MediaQuery
  Object.defineProperty(value, 'query', {
    get() {
      return mediaQueryList().media
    },
  })

  return value
}
