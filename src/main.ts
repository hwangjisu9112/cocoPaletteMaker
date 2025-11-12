import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

/**
 * 루트 Svelte 컴포넌트를 DOM에 마운트합니다.
 */
const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
