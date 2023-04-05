import cac from 'cac'
import { createServer } from 'vite'
import { createDevServer } from './dev'

const cli = cac('island').version('0.0.1').help()
cli.command('dev [root]', 'Start development server').action(async (root = '') => {
  const server = await createDevServer(root)
  await server.listen()
  server.printUrls()
  console.log('dev', root)
})


cli.command('build [root]', 'build in production').action(async (root = '') => {
  console.log('build', root)
})


cli.parse()
