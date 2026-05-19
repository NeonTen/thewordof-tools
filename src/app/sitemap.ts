import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thewordof.com'
  
  // All public pages on the site
  const routes = [
    '',
    '/tools',
    '/tools/calculators',
    '/tools/caption-generator',
    '/tools/code-minifier',
    '/tools/cv-builder',
    '/tools/image-converter',
    '/tools/invoice-generator',
    '/tools/llms-txt',
    '/tools/prompt-generator',
    '/tools/schema-generator',
    '/tools/seo-generator',
    '/tools/svg-compressor',
    '/tools/text-diff',
    '/pricing',
    '/login',
    '/register',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/tools/') ? 0.8 : 0.6,
  }))

  return [...routes]
}

