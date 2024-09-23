import { render } from 'solid-js/web'
import 'solid-devtools'
import '@/index.css'
import Application from '@/components/Application'

const $root = document.querySelector('#app')
if ($root != null) render(() => <Application />, $root)
