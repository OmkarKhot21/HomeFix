import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/userAuth';
import {
  getProfessional,
  getActiveJobForPro,
  listOpenRequestsForPro,
  getProEarnings,
  expireStaleBookings,
} from '@/lib/liveDb';
import { getRoute } from '@/lib/routing';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

// Polled every few seconds by the professional dashboard.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: noStore });

  try {
    const pro = await getProfessional(user.uid);
    if (!pro) return NextResponse.json({ error: 'not_professional' }, { status: 404, headers: noStore });
    if (pro.status !== 'approved') {
      return NextResponse.json({ pro: { status: pro.status, isOnline: false } }, { headers: noStore });
    }

    await expireStaleBookings();
    const activeJob = await getActiveJobForPro(pro.uid);
    const requests = pro.isOnline && !activeJob ? await listOpenRequestsForPro(pro) : [];
    const earnings = await getProEarnings(pro.uid);

    // Road route to the customer while heading there.
    let activeRoute = null;
    if (activeJob && activeJob.status === 'accepted' && pro.lat !== null && pro.lng !== null) {
      const r = await getRoute({ lat: pro.lat, lng: pro.lng }, { lat: activeJob.lat, lng: activeJob.lng });
      activeRoute = { minutes: r.minutes, km: r.km, byRoad: r.source === 'road', path: r.path };
    }

    return NextResponse.json(
      {
        pro: {
          status: pro.status,
          isOnline: pro.isOnline,
          hasLocation: pro.lat !== null && pro.lng !== null,
          lat: pro.lat,
          lng: pro.lng,
        },
        activeJob,
        activeRoute,
        requests,
        earnings,
        serverTime: new Date().toISOString(),
      },
      { headers: noStore }
    );
  } catch (err) {
    console.error('[DATABASE ERROR in /api/pro/feed]:', err);
    return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  }
}
