import type { JSX } from 'solid-js'
import SettingsButton from '@/components/SettingsButton'
import Credits from '@/components/Credits'
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
