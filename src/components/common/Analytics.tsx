import Script from "next/script";

// Google Analytics 4. Set NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXXXXX") in the
// environment to enable. When it's unset, nothing renders — so local dev and
// preview builds stay clean of analytics hits.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');

          // Conversion tracking: every call/text tap anywhere on the site.
          // A single delegated listener beats instrumenting each component —
          // new tel:/sms: links are tracked automatically. Mark call_click,
          // text_click, and generate_lead as Key Events in GA4 admin.
          document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest && e.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href') || '';
            if (href.indexOf('tel:') === 0) {
              gtag('event', 'call_click', { link_text: (a.textContent || '').trim().slice(0, 50) });
            } else if (href.indexOf('sms:') === 0) {
              gtag('event', 'text_click', { link_text: (a.textContent || '').trim().slice(0, 50) });
            } else if (href.indexOf('/review') !== -1 && href.indexOf('g.page') !== -1) {
              gtag('event', 'review_link_click', {});
            }
          }, true);
        `}
      </Script>
    </>
  );
}
