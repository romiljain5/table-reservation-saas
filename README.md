This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Commands and tools
- npx prisma studio
- npx prisma migrate dev --name init -> sync db with schema
- node prisma/seed.js - to run seeder file
- also pls install postgres
- shadcn - used for ui components
- Zustand - for state management
- prisma - ORM
- openssl rand -base64 32 --> to generate NEXTAUTH_SECRET and save in .env

### Dependencies
```bash
✔ Next.js 
✔ Tailwind + ShadCN
✔ Prisma + PostgreSQL
✔ Multi-tenant schema
✔ Reservation API
✔ Deployment pipeline
```

### TODOs
- Full Dashboard UI (Figma + code)
- Restaurant onboarding system
- Booking widget (calendar + time selector)
- Admin real-time tables map (drag & drop)
- API endpoints list (complete documentation)
- POS Integration starter

### Rbac info
```
Role	Permissions
OWNER	Full access
MANAGER	Manage staff, tables, reservations
HOST	Only reservations & seating
WAITER	View reservations only
CUSTOMER	Only booking widget (later)
```