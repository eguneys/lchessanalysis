import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __DEV__: 'true'
  },
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true
  }
})
