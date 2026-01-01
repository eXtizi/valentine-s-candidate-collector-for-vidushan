import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, CandidateEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Valentine Quest API' }}));
  // CANDIDATES
  app.get('/api/candidates', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await CandidateEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 50);
    return ok(c, page);
  });
  app.post('/api/candidates', async (c) => {
    const body = await c.req.json();
    const { name, instagram, whyMe, dateIdea } = body;
    if (!isStr(name) || !isStr(instagram) || !isStr(whyMe) || !isStr(dateIdea)) {
      return bad(c, 'All fields are required and must be valid strings');
    }
    const candidate = await CandidateEntity.create(c.env, {
      id: crypto.randomUUID(),
      name: name.trim(),
      instagram: instagram.trim(),
      whyMe: whyMe.trim(),
      dateIdea: dateIdea.trim(),
      createdAt: Date.now()
    });
    return ok(c, candidate);
  });
  // CLEANUP (Optional helper for admin)
  app.delete('/api/candidates/:id', async (c) => {
    const id = c.req.param('id');
    return ok(c, { id, deleted: await CandidateEntity.delete(c.env, id) });
  });
  // Legacy demo routes (kept for template consistency)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null);
    return ok(c, page);
  });
}