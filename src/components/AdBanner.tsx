'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  adType: 'adsense' | 'medianet' | 'propeller';
  position: 'top' | 'bottom' | 'sidebar';
  className?: string;
  // AdSense props
  clientId?: string;
  slotId?: string;
  // Media.net props
  cid?: string;
  crid?: string;
  // Propeller props
  zoneId?: string;
}

export default function AdBanner({ adType, position, className = '', clientId, slotId, cid, crid, zoneId }: AdBannerProps) {
  const adId = `ad-${adType}-${position}-${Math.random().toString(36).substring(2, 7)}`;

  useEffect(() => {
    if (adType === 'adsense' && clientId) {
      try {
        // Push AdSense ad slot
        ((window as unknown as Record<string, unknown[]>).adsbygoogle = (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
      } catch {
        // Silently fail
      }
    } else if (adType === 'medianet' && cid && crid) {
      try {
        const medianetScript = document.createElement('script');
        medianetScript.src = `https://contextual.media.net/dmedianet.js?cid=${cid}&crid=${crid}`;
        medianetScript.async = true;
        const container = document.getElementById(adId);
        if (container) container.appendChild(medianetScript);
      } catch {
        // Silently fail
      }
    } else if (adType === 'propeller' && zoneId) {
      try {
        const propellerScript = document.createElement('script');
        propellerScript.src = `//ad.propellerads.com/v1code.aspx?zoneid=${zoneId}`;
        propellerScript.async = true;
        const container = document.getElementById(adId);
        if (container) container.appendChild(propellerScript);
      } catch {
        // Silently fail
      }
    }
  }, [adType, clientId, slotId, cid, crid, zoneId, adId]);

  if (adType === 'adsense' && clientId) {
    return (
      <div className={`ad-container ${className}`} id={adId}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId || 'auto'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (adType === 'medianet' && cid && crid) {
    return (
      <div className={`ad-container ${className}`} id={adId}>
        <div id={`medianet-${adId}`}>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `try{window._mNHandle.queue.push(function(){window._mNDetails.loadTag("${adId}","300x250","${cid}");});}catch(e){}`
            }}
          />
        </div>
      </div>
    );
  }

  if (adType === 'propeller' && zoneId) {
    return (
      <div className={`ad-container ${className}`} id={adId}>
        <div id={`propeller-${adId}`} />
      </div>
    );
  }

  // Placeholder when no ad is configured
  return (
    <div className={`ad-container flex items-center justify-center py-3 px-4 text-xs text-gray-600 border border-dashed border-gray-800 rounded-lg ${className}`}>
      <span>Ad Space ({position})</span>
    </div>
  );
}
