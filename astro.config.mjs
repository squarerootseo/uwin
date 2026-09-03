import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://uwinfloortech.com',
  redirects: {
    '/ar/pages/about': '/about',
    '/es/pages/about': '/about',
    '/ru/pages/privacy-policy': '/privacy-policy',
    '/pages/about': '/about',
    '/pages/privacy-policy': '/privacy-policy',
    '/pages/contact': '/contact',
    '/pages/terms-and-conditions': '/terms-and-conditions',
    '/pages/why-uwin': '/why-uwin'
  }
});
