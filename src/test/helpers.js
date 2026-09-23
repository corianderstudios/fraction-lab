import { act } from '@testing-library/react'

/** Change the hash route the same way a link click would. */
export function goTo(path) {
  act(() => {
    window.history.replaceState(null, '', `#${path}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

export function setHash(path) {
  window.history.replaceState(null, '', `#${path}`)
}
