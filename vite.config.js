import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildStructuredData } from './src/data/structuredData.js'

function structuredDataPlugin() {
  return {
    name: 'inject-jsonld-structured-data',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(buildStructuredData()),
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), structuredDataPlugin()],
})