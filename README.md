# mySociety

A neighborhood issue register for residents to report local needs and for staff to track them through resolution.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 and check http://localhost:3000/api/health. The initial build provides the application shell and health endpoint.

## Docker

```sh
docker build -t mysociety .
docker run --rm -p 3000:3000 mysociety
```

## Architecture and delivery

Next.js and TypeScript serve the website and HTTP endpoints. Mantine provides the UI components. Supabase PostgreSQL and Auth will provide durable reports and invited staff access. GitHub Actions checks types, builds the Docker image, and smoke-checks its HTTP endpoints on pushes and pull requests. The team checks the resident and staff workflows manually. Vercel will deploy the reviewed production branch.

Live Vercel URL will be added after deployment.

## Contributing

Open a pull request from a task branch. Have another team member review the change and check that CI passes before merging.
