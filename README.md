# mySociety

A neighborhood issue register for residents to report local needs and for staff to track them through resolution.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 and check http://localhost:3000/api/health. The homepage and health endpoint work without a database. Report submission requires the setup below.

## Report intake

Apply the SQL migration in `supabase/migrations/` to a development PostgreSQL or Supabase database. Apply `supabase/seed.sql` for three sample wards. Copy `.env.example` to `.env.local`, then set `DATABASE_URL` and generate `RECEIPT_SECRET` using `openssl rand -hex 32`. Keep the secret stable across deployments because pending retries use it to reproduce the private receipt. Use a server-only database connection with TLS for hosted Supabase.

```sh
KEY=$(uuidgen)
curl -i http://localhost:3000/api/reports \
  -H "Idempotency-Key: $KEY" \
  -H "Content-Type: application/json" \
  -d '{"wardId":1,"category":"streetlights","landmark":"Near the bus stop","description":"The streetlight is out."}'
```

The first request returns HTTP 201 and a ticket. Repeat the same command with the same key and payload within 24 hours to get HTTP 200 and the same receipt. Reusing the key for different data or after the 24-hour replay window returns HTTP 409. Optional `location` has `latitude`, `longitude`, `source` (`device` or `manual`), and optional device `accuracyM`. Open the receipt URL to track the report. Use /report to submit through the website and /register to browse approved reports. Staff moderation and production traffic controls are planned before deployment.

## Docker

```sh
docker build -t mysociety .
docker run --rm -p 3000:3000 mysociety
```

## Architecture and delivery

Next.js and TypeScript serve the website and HTTP endpoints. Mantine provides the UI components. Supabase PostgreSQL provides durable reports, and Supabase Auth is planned for invited staff access. GitHub Actions checks types, builds the Docker image, and smoke-checks its HTTP endpoints on pushes and pull requests. The team checks the resident and staff workflows manually. Vercel will deploy the reviewed production branch.

Live Vercel URL will be added after deployment.

## Contributing

Check that CI passes before merging changes.
