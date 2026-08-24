import { readFileSync } from 'node:fs'
import { personal } from './content.js'

const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf-8')

function metaContent(name) {
  const m = indexHtml.match(new RegExp(`<meta\\s+name="${name}"[^>]*content="([^"]*)"`))
  return m ? m[1] : null
}

function ogContent(prop) {
  const m = indexHtml.match(new RegExp(`<meta\\s+property="og:${prop}"[^>]*content="([^"]*)"`))
  return m ? m[1] : null
}

const siteUrl = ogContent('url')
const siteDescription = metaContent('description')

export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}#person`,
        name: personal.name,
        jobTitle: personal.title,
        email: `mailto:${personal.email}`,
        address: personal.location,
        url: siteUrl,
        sameAs: [personal.social.github, personal.social.linkedin, personal.social.facebook],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: personal.name,
        description: siteDescription,
      },
    ],
  }
}