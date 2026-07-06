'use client'

import { useEffect } from 'react'
import { analytics, siteUrl } from '@/config/seo'

/**
 * Injects third-party analytics & verification scripts into <head>.
 *
 * All IDs are read from src/config/seo.ts which sources them from
 * environment variables. Leave the env var empty ("") to disable
 * any service.
 *
 * Services:
 *  - Google Analytics 4 (gtag.js)
 *  - Google Search Console (meta verification)
 *  - Microsoft Clarity
 *  - Google Tag Manager (optional, mutually exclusive with GA4)
 */
export default function AnalyticsScripts() {
  useEffect(() => {
    // ── Google Tag Manager (if enabled, skip GA4) ──────────────
    if (analytics.gtmId) {
      // GTM script tag
      const gtmScript = document.createElement('script')
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${analytics.gtmId}');
      `
      document.head.appendChild(gtmScript)
      return
    }

    // ── Google Analytics 4 ─────────────────────────────────────
    if (analytics.ga4Id) {
      // Load gtag.js
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}`
      document.head.appendChild(gaScript)

      // Configure
      const gaConfig = document.createElement('script')
      gaConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analytics.ga4Id}', {
          page_path: window.location.pathname,
        });
      `
      document.head.appendChild(gaConfig)
    }

    // ── Microsoft Clarity ──────────────────────────────────────
    if (analytics.clarityId) {
      const clarityScript = document.createElement('script')
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","${analytics.clarityId}");
      `
      document.head.appendChild(clarityScript)
    }

    // ── Google Search Console verification ─────────────────────
    if (analytics.gscVerification) {
      const gscMeta = document.createElement('meta')
      gscMeta.name = 'google-site-verification'
      gscMeta.content = analytics.gscVerification
      document.head.appendChild(gscMeta)
    }
  }, [])

  return null
}