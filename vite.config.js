import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/** Nome do repositório no GitHub (ex: Card → base /Card/) */
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages && repoName ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [vue(), tailwindcss()],
})
