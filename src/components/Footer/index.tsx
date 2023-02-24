import type { JSX } from 'solid-js'
import Credits from '@/components/Credits'
import SettingsButton from '@/components/SettingsButton'
import * as css from './styles'

interface FooterProps {
  onSettingsRequest?: () => void
}

export default function Footer(props: FooterProps): JSX.Element {
  const handleSettingsClick = (): void => props.onSettingsRequest?.()

  return (
    <footer class={css.footer}>
      <SettingsButton onClick={handleSettingsClick} />
      <Credits />
    </footer>
  )
}
