import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: 'inline',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lchessanalysis',
      fileName: 'lchessanalysis'
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true
  }
})
