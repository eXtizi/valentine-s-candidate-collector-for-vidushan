import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, CandidateEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Valentine Quest API' }}));
  // CANDIDATES
  app.get('/api/candidates', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await CandidateEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 100);
    return ok(c, page);
  });
  app.post('/api/candidates', async (c) => {
    const body = await c.req.json();
    const { 
      name, email, phone, instagram, 
      linkedIn, resumeUrl, experienceLevel, 
      motivation, dateIdea, availability 
    } = body;
    // Validate essential fields
    if (!isStr(name) || !isStr(email) || !isStr(instagram) || !isStr(motivation)) {
      return bad(c, 'Essential fields (name, email, handle, and motivation) are required');
    }
    const candidate = await CandidateEntity.create(c.env, {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      instagram: instagram.trim(),
      linkedIn: (linkedIn || '').trim(),
      resumeUrl: (resumeUrl || '').trim(),
      experienceLevel: (experienceLevel || '').trim(),
      motivation: motivation.trim(),
      dateIdea: (dateIdea || '').trim(),
      availability: (availability || '').trim(),
      createdAt: Date.now()
    });
    return ok(c, candidate);
  });
  app.delete('/api/candidates/:id', async (c) => {
    const id = c.req.param('id');
    return ok(c, { id, deleted: await CandidateEntity.delete(c.env, id) });
  });
  // Demo cleanup
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null);
    return ok(c, page);
  });
}