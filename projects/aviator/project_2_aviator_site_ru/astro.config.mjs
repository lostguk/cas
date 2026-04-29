import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://aviator-site.ru',
	vite: {
		plugins: [tailwindcss()],
		build: { cssMinify: true },
	},
	integrations: [
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
	],
	compressHTML: true,
	build: { inlineStylesheets: 'auto' },
	prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
})
