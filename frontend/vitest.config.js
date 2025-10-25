import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**'
      ]
    }
  }
})