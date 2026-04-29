import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: 'global' } });
    }
    // Return only public-facing settings
    return Response.json({
      proEnabled: settings.proEnabled,
      proPrice: settings.proPrice,
      enterprisePrice: settings.enterprisePrice,
      freeDailyLimit: settings.freeDailyLimit,
      adsenseEnabled: settings.adsenseEnabled,
      adsenseClientId: settings.adsenseClientId,
      adsenseSlotId: settings.adsenseSlotId,
      adsenseAutoAds: settings.adsenseAutoAds,
      mediaNetEnabled: settings.mediaNetEnabled,
      mediaNetCid: settings.mediaNetCid,
      mediaNetCrid: settings.mediaNetCrid,
      propellerEnabled: settings.propellerEnabled,
      propellerZoneId: settings.propellerZoneId,
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      maintenanceMode: settings.maintenanceMode,
      adPosition: settings.adPosition,
      adFrequency: settings.adFrequency,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
