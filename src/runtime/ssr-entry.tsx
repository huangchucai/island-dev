// 将组件代码渲染成html
import { App } from './App'
import { renderToString } from 'react-dom/server'

export function render() {
  return renderToString(<App/>)
}
