// Making changes to this file is **STRICTLY** forbidden.
// Please add your routes in `user-routes.ts` file.
//
// NOTE: Dynamic runtime imports do NOT work in Cloudflare Workers.
// Routes are statically imported but lazily registered.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import type { Env } from './core-utils';
export * from './core-utils';

// ✅ STATIC import (required for Workers bundling)
import { userRoutes } from './user-routes';

let userRoutesLoaded = false;
let userRoutesLoadError: string | null = null;

const loadUserRoutes = (app: Hono<{ Bindings: Env }>) => {
  if (userRoutesLoaded) return;

  try {
    userRoutes(app);
    userRoutesLoaded = true;
    userRoutesLoadError = null;
  } catch (e) {
    userRoutesLoadError = e instanceof Error ? e.message : String(e);
  }
};

export type ClientErrorReport = {
  message: string;
  url: string;
  timestamp: string;
} & Record<string, unknown>;

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/api/health', (c) =>
  c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  }),
);

app.post('/api/client-errors', async (c) => {
  try {
    const e = await c.req.json<ClientErrorReport>();
    console.error(
      '[CLIENT ERROR]',
      JSON.stringify(
        {
          timestamp: e.timestamp || new Date().toISOString(),
          message: e.message,
          url: e.url,
          stack: e.stack,
          componentStack: e.componentStack,
          errorBoundary: e.errorBoundary,
        },
        null,
        2,
      ),
    );
    return c.json({ success: true });
  } catch (error) {
    console.error('[CLIENT ERROR HANDLER] Failed:', error);
    return c.json({ success: false, error: 'Failed to process' }, 500);
  }
});

app.notFound((c) =>
  c.json({ success: false, error: 'Not Found' }, 404),
);

app.onError((err, c) => {
  console.error('[ERROR]', err);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

console.log('Server is running');

export default {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;

    if (
      pathname.startsWith('/api/') &&
      pathname !== '/api/health' &&
      pathname !== '/api/client-errors'
    ) {
      loadUserRoutes(app);

      if (userRoutesLoadError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Worker routes failed to load',
            detail: userRoutesLoadError,
          }),
          {
            status: 500,
            headers: { 'content-type': 'application/json' },
          },
        );
      }
    }

    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
