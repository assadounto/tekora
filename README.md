# Tekora

**Learn. Build. Prove. Work.**

Tekora is an API-first practical learning and professional network for students, skilled professionals, creators, mentors, universities, builders, and industry.

## Vision

Tekora connects:

- interactive learning
- practical labs and real projects
- creator-led courses
- learner communities and study circles
- project teams and future ventures
- research/final-year project guidance
- skill evidence and portfolios
- workshops and mentorship
- internships and industry opportunities
- public APIs, bots, agents, SDKs, and third-party integrations

## Current stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma planned for direct DB access
- Zod validation
- Tailwind/shadcn next
- Auth.js next
- Paystack later
- S3/R2 later
- AI service layer later

## Architecture rule

The web application may access the database through server-side domain services. External clients must use versioned APIs under `/api/v1`.

```text
Web UI -> Server Components / Actions -> Domain services -> DB
Bots / Mobile / Third-party apps -> /api/v1 -> auth/scopes -> Domain services -> DB
```

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Health endpoint: `GET /api/v1/health`

## First build milestones

1. Foundation and design system
2. Authentication and profiles
3. Roles: learner, creator, mentor, professional, employer, admin
4. Programs, skills, courses, modules, lessons
5. Creator studio
6. Enrollments and progress
7. People discovery, connections, circles
8. Labs and projects
9. Skill evidence and portfolios
10. Developer applications, API keys, scopes, webhooks
11. AI tutor and context layer
12. Workshops, research, and careers
