import type { Accessor } from 'solid-js'

type DoneFn = () => void
type Hook = (_el: Element, done: DoneFn) => void

const EnterDuration = 150
const ExitDuration = 150

export default function buildModalAnimation(dialog: Accessor<Element | undefined>): { onEnter: Hook; onExit: Hook } {
  return {
    onEnter(overlay, done) {
      void animate('ease-out', EnterDuration, [
        [overlay, { opacity: [0.3, 1] }],
        [dialog(), { transform: ['scale(0.6)', 'scale(1.0)'] }],
      ]).finally(done)
    },
    onExit(overlay, done) {
      void animate('ease-in', ExitDuration, [
        [overlay, { opacity: [1, 0.3] }],
        [dialog(), { transform: ['scale(1.0)', 'scale(0.6)'] }],
      ]).finally(done)
    },
  }
}

async function animate(
  easing: string,
  duration: number,
  els: Array<[Element | undefined, PropertyIndexedKeyframes]>,
): Promise<void> {
  if (typeof Element.prototype.animate === 'undefined') {
    await new Promise((resolve) => setTimeout(resolve, duration))
    return
  }

  await Promise.allSettled(
    els.map(async ([el, frames]) => await el?.animate({ easing, ...frames }, { duration }).finished),
  )
}
