// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export const config = {
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Languages your app serves
  locales: ['en', 'pt-BR', 'es'],
  defaultLocale: 'en',

  // Keeps “/” un-prefixed for the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match every pathname except:
  //   • /api/*, /trpc/*
  //   • Next.js & Vercel internals
  //   • Any file with an extension (e.g. favicon.ico, robots.txt, .png)
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};