20:00:14.018 Running build in Washington, D.C., USA (East) – iad1
20:00:14.019 Build machine configuration: 2 cores, 8 GB
20:00:14.162 Cloning github.com/akmc1990/akmcnz-website (Branch: main, Commit: b1c6ba8)
20:00:14.380 Cloning completed: 218.000ms
20:00:15.538 Restored build cache from previous deployment (5XuJJohc6Auj6JNCSW2Zux4ezVXc)
20:00:15.856 Running "vercel build"
20:00:15.878 Vercel CLI 53.3.2
20:00:16.093 Installing dependencies...
20:00:19.530 
20:00:19.531 up to date in 3s
20:00:19.532 
20:00:19.533 156 packages are looking for funding
20:00:19.533   run `npm fund` for details
20:00:19.562 Detected Next.js version: 14.2.3
20:00:19.568 Running "npm run build"
20:00:19.675 
20:00:19.676 > akmcnz-website@1.0.0 build
20:00:19.676 > next build
20:00:19.676 
20:00:20.383   ▲ Next.js 14.2.3
20:00:20.384 
20:00:20.402    Creating an optimized production build ...
20:00:30.353  ✓ Compiled successfully
20:00:30.354    Skipping validation of types
20:00:30.354    Skipping linting
20:00:30.624    Collecting page data ...
20:00:32.266    Generating static pages (0/21) ...
20:00:32.601    Generating static pages (5/21) 
20:00:32.620 Error fetching photos: q [Error]: Dynamic server usage: Route /api/photos couldn't be rendered statically because it accessed `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
20:00:32.621     at Object.get (/vercel/path0/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:37835)
20:00:32.621     at n (/vercel/path0/.next/server/app/api/photos/route.js:1:859)
20:00:32.621     at /vercel/path0/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:34672
20:00:32.622     at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:140:36
20:00:32.622     at NoopContextManager.with (/vercel/path0/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
20:00:32.622     at ContextAPI.with (/vercel/path0/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
20:00:32.623     at NoopTracer.startActiveSpan (/vercel/path0/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
20:00:32.623     at ProxyTracer.startActiveSpan (/vercel/path0/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854)
20:00:32.624     at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:122:103
20:00:32.624     at NoopContextManager.with (/vercel/path0/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062) {
20:00:32.624   description: "Route /api/photos couldn't be rendered statically because it accessed `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
20:00:32.625   digest: 'DYNAMIC_SERVER_USAGE'
20:00:32.625 }
20:00:32.974    Generating static pages (10/21) 
20:00:33.422    Generating static pages (15/21) 
20:00:33.577 Error: Unsupported Server Component type: Module
20:00:33.577     at e (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138095)
20:00:33.578     at ek (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
20:00:33.578     at Array.toJSON (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
20:00:33.578     at stringify (<anonymous>)
20:00:33.578     at eR (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142219)
20:00:33.578     at eE (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142698)
20:00:33.578     at AsyncLocalStorage.run (node:internal/async_local_storage/async_context_frame:63:14)
20:00:33.578     at Timeout._onTimeout (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:150397)
20:00:33.578     at listOnTimeout (node:internal/timers:605:17)
20:00:33.579     at process.processTimers (node:internal/timers:541:7) {
20:00:33.579   digest: '3542599787'
20:00:33.579 }
20:00:33.579 Error: Unsupported Server Component type: Module
20:00:33.579     at e (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138095)
20:00:33.579     at ek (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
20:00:33.579     at Array.toJSON (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
20:00:33.579     at stringify (<anonymous>)
20:00:33.579     at eR (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142219)
20:00:33.579     at eE (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142698)
20:00:33.579     at Timeout._onTimeout (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135475)
20:00:33.580     at listOnTimeout (node:internal/timers:605:17)
20:00:33.580     at process.processTimers (node:internal/timers:541:7) {
20:00:33.580   digest: '1936364707'
20:00:33.580 }
20:00:33.580 Error: Unsupported Server Component type: Module
20:00:33.580     at e (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138095)
20:00:33.580     at ek (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
20:00:33.580     at Array.toJSON (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
20:00:33.580     at stringify (<anonymous>)
20:00:33.581     at eR (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142219)
20:00:33.581     at eE (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142698)
20:00:33.581     at Timeout._onTimeout (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135475)
20:00:33.581     at listOnTimeout (node:internal/timers:605:17)
20:00:33.581     at process.processTimers (node:internal/timers:541:7) {
20:00:33.581   digest: '1936364707'
20:00:33.581 }
20:00:33.661 
20:00:33.662 Error occurred prerendering page "/worship/news". Read more: https://nextjs.org/docs/messages/prerender-error
20:00:33.662 
20:00:33.662 Error: Unsupported Server Component type: Module
20:00:33.662     at e (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138095)
20:00:33.662     at ek (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
20:00:33.662     at Array.toJSON (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
20:00:33.662     at stringify (<anonymous>)
20:00:33.662     at eR (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142219)
20:00:33.662     at eE (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142698)
20:00:33.662     at AsyncLocalStorage.run (node:internal/async_local_storage/async_context_frame:63:14)
20:00:33.662     at Timeout._onTimeout (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:150397)
20:00:33.662     at listOnTimeout (node:internal/timers:605:17)
20:00:33.662     at process.processTimers (node:internal/timers:541:7)
20:00:33.793  ✓ Generating static pages (21/21)
20:00:33.801 
20:00:33.803 > Export encountered errors on following paths:
20:00:33.803 	/worship/news/page: /worship/news
20:00:33.852 Error: Command "npm run build" exited with 1
