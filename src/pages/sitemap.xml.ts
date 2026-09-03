import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://uwinfloortech.com';

  const astroModules = import.meta.glob('./**/*.astro');
  const mdModules = import.meta.glob('./**/*.md');
  const allModules = { ...astroModules, ...mdModules };
  
  const urls: string[] = [];

  for (const path in allModules) {
    // Ignore private files/templates starting with _ (e.g. _template.md)
    if (path.includes('/_') || path.startsWith('./_')) {
      continue;
    }

    // Clean up path
    let route = path
      .replace(/^\.\//, '')
      .replace(/\.(astro|md)$/, '');

    if (route === '404' || route.includes('[')) {
      continue;
    }

    if (route === 'index') {
      route = '';
    } else if (route.endsWith('/index')) {
      route = route.replace(/\/index$/, '');
    }

    const url = route ? `${baseUrl}/${route}/` : `${baseUrl}/`;
    urls.push(url);
  }

  // Sort URLs for consistent output
  urls.sort();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

