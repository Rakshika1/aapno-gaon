import { notFound } from 'next/navigation';
import { getReceipt } from '../../../lib/report-store';

export const dynamic = 'force-dynamic';

export default async function TrackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  const receipt = await getReceipt(token);
  if (!receipt) notFound();
  const statuses: Record<string, string> = { SUBMITTED: 'Submitted', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved' };
  return <main className="content"><a href="/">mySociety</a><h1>Track your report</h1>
    <p>Ticket <strong>{receipt.ticket_code}</strong></p>
    <p>Status: {statuses[receipt.status]}</p>
    {receipt.visibility === 'PENDING_REVIEW' && <p>Waiting for staff review.</p>}
    {receipt.visibility === 'REJECTED' && <p>This report was declined during review.</p>}
  </main>;
}
