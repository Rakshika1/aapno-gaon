export function GET() {
  return Response.json({ status: 'ok', service: 'mysociety' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
