import type { Window } from 'happy-dom'

window.resizeTo = function resizeTo(width, height) {
  ;(window as unknown as Window).happyDOM.setViewport({ width, height })
}
