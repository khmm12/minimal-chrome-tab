import { onCleanup, onMount } from 'solid-js'

const DurationInSeconds = (1 / 60) * 6 // 6 frames or 100 ms

export default function useMountEffect(): void {
  onMount(() => {
    const $root: HTMLElement | null = document.querySelector('#app')
    if ($root != null) {
      const dispose = animate($root, DurationInSeconds)
      onCleanup(dispose)
    }
  })
}

function animate($el: HTMLElement, durationInSeconds: number): () => void {
  if (typeof TransitionEvent === 'undefined') {
    window.requestAnimationFrame(() => {
      $el.style.opacity = ''
    })
    return () => {}
  }

  const teardown = (): void => {
    $el.removeEventListener('transitionend', teardown)
    $el.removeEventListener('transitioncancel', teardown)

    window.requestAnimationFrame(() => {
      $el.style.transition = ''
      $el.style.opacity = ''
    })
  }

  $el.addEventListener('transitionend', teardown)
  $el.addEventListener('transitioncancel', teardown)

  const rafId = window.requestAnimationFrame(() => {
    // Start of transition
    $el.style.opacity = '0'

    // Reflow DOM to start transition
    triggerReflow($el)

    // End of transition
    $el.style.transition = `opacity ${durationInSeconds}s ease-out`
    $el.style.opacity = '1'
  })

  return () => {
    cancelAnimationFrame(rafId)
    teardown()
  }
}

function triggerReflow($el: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- side effect in the getter
  $el.scrollTop
}
