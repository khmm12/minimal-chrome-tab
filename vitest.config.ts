import { resolve as resolvePath } from 'path'
import { defineConfig, configDefaults } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'
import babelPlugin from 'vite-plugin-babel'

export default defineConfig({
  test: {
    setupFiles: ['test-support/setup.ts'],
    watch: false,
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/.[jt]sx?/],
    },
    deps: {
      // We need browser variants
      inline: [/solid-js/, '@felte/solid', 'solid-transition-group'],
    },
    coverage: {
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test-support/**', ...(configDefaults.coverage.exclude ?? [])],
    },
  },
  plugins: [
    solidPlugin({
      hot: false,
      babel: {
        // Handle linaria in tsx
        presets: ['@linaria/babel-preset'],
      },
    }),
    // Handle linaria in other extensions
    babelPlugin({
      filter: /\.[cm]?[jt]s$/,
      babelConfig: {
        plugins: ['@babel/plugin-syntax-typescript'],
        presets: ['@linaria/babel-preset'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolvePath(__dirname, './src'),
      '@test': resolvePath(__dirname, './test-support'),
    },
    conditions: ['development', 'browser'],
  },
})
