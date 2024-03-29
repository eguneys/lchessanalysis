import { build } from 'esbuild'

async function main() {
  function options({ dev = true }) {
    return {
      entryPoints: ['src/index.ts'],
      outfile: `dist/${dev ? 'dev' : 'prod'}/index.js`,
      treeShaking: true,
      format: 'esm',
      bundle: true,
      sourcemap: 'inline',
      platform: 'browser',
      target: 'es2019',
      write: true,
      watch: hasArg('-w'),
      minify: !dev,
      define: {
        __DEV__: dev ? 'true':'false'
      }
    }
  }


  await Promise.all([build(options({ dev: true })), build(options({ dev: false }))])
}


function hasArg(arg) {
  return process.argv.includes(arg)
}


main().catch((e) => {
  console.error(e)
  process.exit(1)
})
