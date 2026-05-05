import { render } from '@solidjs/web'
import Application from '@/components/Application'

const $root = document.querySelector('#app')
if ($root != null) render(() => <Application />, $root)
