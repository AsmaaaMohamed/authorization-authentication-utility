/**
 * File: vite.config.js
 * Description: Vite build and development configuration integrating React Fast Refresh and Tailwind CSS v4 Vite plugin.
 * 
 * Steps:
 * 1. Imports defineConfig helper from Vite.
 * 2. Imports React plugin (@vitejs/plugin-react) and Tailwind CSS plugin (@tailwindcss/vite).
 * 3. Exports Vite configuration activating both plugins.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
