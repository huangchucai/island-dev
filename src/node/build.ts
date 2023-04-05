// 1. 代码打包 - 客户端 + 服务端
// 2. 引入server-entry模块
// 3. 服务端渲染, 产出html
import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constans'
import * as path from 'path'
import * as fs from 'fs-extra'
import type { RollupOutput } from 'rollup'

export async function bundle(root: string) {
  try {
    console.log('-hcc-Building client + server bundles...')
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      }
    }
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false))
    }
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true))
    }
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log('-hcc-bundle-', e)
  }
}

export async function renderPage(
    render: () => string,
    root: string,
    clientBundle: RollupOutput
) {
  const appHtml = render()
  const clientChunk = clientBundle.output.find(chunk => {
    return chunk.type === 'chunk' && chunk.isEntry
  })
  const html = `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    </head>
    <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk.fileName}"></script>
    </body>
    </html>
  `.trim()
  await fs.writeFile(path.join(root, 'build', 'index.html'), html)
  await fs.remove(path.join(root, '.temp'))
}
export async function build(root: string) {
  // 1. 代码打包 - 客户端 + 服务端
  const [clientBundle] = await bundle(root)
  // 2. 引入server-entry模块
  debugger
  const serverEntryPath = path.join(root, '.temp/ssr-entry.js')
  console.log('-hcc-root-',root)
  // 3. 服务端渲染, 产出html
  const {render} = require(serverEntryPath)
  console.log('-hcc-render-', render)
  await renderPage(render, root, clientBundle)
}
