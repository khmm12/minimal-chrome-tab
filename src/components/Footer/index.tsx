import type { JSX } from 'solid-js'
import { css } from 'styled-system/css'
import Credits from '@/components/Credits'
import SettingsButton from '@/components/SettingsButton'
import * as s from './styles'

interface FooterProps {
  onSettingsRequest?: () => void
}

export default function Footer(props: FooterProps): JSX.Element {
  const handleSettingsClick = (): void => props.onSettingsRequest?.()

  return (
    <footer class={css(s.footer)}>
      <SettingsButton onClick={handleSettingsClick} />
      <Credits />
    </footer>
  )
}
