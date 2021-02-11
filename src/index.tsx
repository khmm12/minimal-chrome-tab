import { render } from 'preact'
import Application from '@/components/Application'

const $root = document.querySelector('#root')
if ($root !== null) render(<Application />, $root)
