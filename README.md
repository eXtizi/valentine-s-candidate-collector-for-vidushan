# Cloudflare Workers Full-Stack React Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/eXtizi/valentine-s-candidate-collector-for-vidushan)

A production-ready full-stack application template powered by Cloudflare Workers, featuring a React frontend with Vite, Hono backend, and Durable Objects for scalable stateful entities. This template includes a demo chat application with users, chat boards, and real-time messaging, demonstrating entity-based storage, indexing, and API routes.

## 🚀 Key Features

- **Full-Stack Architecture**: React 18 frontend with Tailwind CSS & Shadcn UI, Hono backend on Cloudflare Workers.
- **Stateful Durable Objects**: Per-entity Durable Objects (Users, Chats) with automatic indexing for listing/pagination.
- **Type-Safe APIs**: Shared TypeScript types between frontend and worker, with comprehensive error handling.
- **Modern UI/UX**: Dark/light theme support, responsive design, animations, and shadcn components.
- **Data Fetching**: Tanstack Query for optimistic updates, caching, and infinite queries.
- **Development Workflow**: Hot reload, TypeScript strict mode, Vite bundling, and Bun scripts.
- **Scalable Storage**: Global Durable Object acting as KV-like storage with CAS for concurrency.
- **Demo Entities**: Users, ChatBoards (with embedded messages), seed data, CRUD operations.
- **Production-Ready**: CORS, logging, health checks, client error reporting, SPA routing.

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons, Tanstack Query, React Router, Framer Motion, Sonner |
| **Backend** | Hono, Cloudflare Workers, Durable Objects |
| **State/UI** | Zustand, Immer, Headless UI, Radix UI |
| **Dev Tools** | Bun, ESLint, Wrangler, Cloudflare Vite Plugin |
| **Utilities** | Zod, Date-fns, UUID, Class Variance Authority |

## ⚡ Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`).
   - [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest` or global install).

2. **Clone & Install**:
   ```bash
   git clone <your-repo>
   cd <project>
   bun install
   ```

3. **Development**:
   ```bash
   bun dev
   ```
   - Frontend: http://localhost:3000 (Vite dev server).
   - Backend APIs: Handled by Workers (proxied via Vite).

4. **Type Generation** (for Worker bindings):
   ```bash
   bun run cf-typegen
   ```

## 🧪 Usage Examples

### API Endpoints (under `/api/*`)
- `GET /api/users` - List users (paginated).
- `POST /api/users` - Create user `{ "name": "Alice" }`.
- `GET /api/chats` - List chats.
- `POST /api/chats` - Create chat `{ "title": "My Chat" }`.
- `POST /api/chats/:chatId/messages` - Send message `{ "userId": "u1", "text": "Hello" }`.

### Frontend Integration
- Uses `apiClient.ts` for type-safe fetches: `api<User[]>('/api/users')`.
- HomePage demo shows template UI; extend with pages/routes.
- Entities auto-seed on first list (via `ensureSeed`).

### Custom Entities
1. Define in `worker/entities.ts` (extend `IndexedEntity`).
2. Add routes in `worker/user-routes.ts`.
3. Restart dev server (dynamic module loading).

## 🔄 Development Workflow

- **Hot Reload**: Frontend auto-reloads; Worker routes hot-reload via dynamic import.
- **Linting**: `bun lint`.
- **Build**: `bun build` (generates `./dist` for deployment).
- **Preview**: `bun preview`.
- **Worker Types**: Run `bun run cf-typegen` after `wrangler deploy`.
- **Seed Data**: Edit `shared/mock-data.ts`; auto-populates on list.
- **Sidebar/UI**: Customize `src/components/app-sidebar.tsx` and `AppLayout.tsx`.
- **Theme**: Toggle via `ThemeToggle`; persists in localStorage.

## ☁️ Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

1. **Login**: `wrangler login`.
2. **Configure**: Edit `wrangler.jsonc` (name, bindings).
3. **Deploy**: `bun run deploy` (builds frontend + deploys Worker).
4. **Custom Domain**: `wrangler deploy --env production`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/eXtizi/valentine-s-candidate-collector-for-vidushan)

**Notes**:
- Assets served as SPA (single-page application).
- Durable Objects use SQLite storage (migrations auto-applied).
- Free tier supports unlimited requests.

## 📚 Project Structure

```
├── src/              # React frontend (Vite)
├── worker/           # Hono + Durable Objects backend
├── shared/           # Shared TS types + mocks
├── tailwind.config.js # UI theming
└── wrangler.jsonc    # Worker config
```

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. Make changes, `bun lint`.
4. Test locally: `bun dev`.
5. PR with description.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Docs](https://hono.dev/)
- [Shadcn UI](https://ui.shadcn.com/)

Built with ❤️ for Cloudflare Developers.