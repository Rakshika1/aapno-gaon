import { getWards } from '../../lib/report-store';
import ReportForm from './report-form';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
  const wards = await getWards().catch(() => null);
  return (
    <main className="content">
      <a href="/">mySociety</a>
      <h1>Report an issue</h1>
      {wards?.length ? <ReportForm wards={wards} /> : <p>Reporting is currently unavailable. Please try again later.</p>}
    </main>
  );
}
