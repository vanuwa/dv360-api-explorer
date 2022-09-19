const start_date = new Date();
const end_date = new Date();

start_date.setDate(start_date.getDate() + 1);
end_date.setDate(end_date.getDate() + 10);

module.exports = {
  displayName: `Default_${new Date().toISOString()}`,
  entityStatus: 'ENTITY_STATUS_PAUSED', // or maybe ENTITY_STATUS_ACTIVE
  creativeType: 'CREATIVE_TYPE_STANDARD',
  hostingSource: 'HOSTING_SOURCE_THIRD_PARTY',
  dimensions: {
    widthPixels: 728,
    heightPixels: 90
  },
  assets: [],
  exitEvents: [{
    type: 'EXIT_EVENT_TYPE_BACKUP',
    url: 'https://test.com'
  }],
  // appendedTag: '' // Third-party HTML tracking tag to be appended to the creative tag
  thirdPartyTag: '<!-- DSP tag generated by Creator --> <!-- MASS Test Campaign - Inskin Attention Creatives --> <!-- Pageskin Plus Tablet --> <!-- Tablet --> <!-- Size: 728x90 --> <!-- DSP: DV360 --> <script async src="https://cdn.inskinad.com/isfe/tags/dsp.js"></script> <script type="text/javascript"> (function() { var ns = window.inskin = window.inskin || {}; ns.dsp = ns.dsp || []; ns.dsp.push({ uri: "mass://inskin/pageskinplus?eyJwbHJfTWFuaWZlc3RQYXRoIjoicHNfY3JlYXRvcngvZGlzdC82MDgwMWFmNTUzNDk3YTAwMWJiNTJlMjkvbWFuaWZlc3QuanNvbiIsImkiOiJodHRwczovL2Nkbi5pbnNraW5hZC5jb20vQ3JlYXRpdmVTdG9yZS9wc19jcmVhdG9yeC9maWxlcy82MDc5YTE5MTUzNDk3YTAwMWJiNTJlMWRfMTYxOTAxNzYyMzA3NS9pbnNraW5fNzI4eDkwLmpwZyIsImwiOiJodHRwczovL3d3dy5pbnNraW5tZWRpYS5jb20vcG9zdC9hbXBsaWZ5LXBsYW5uaW5nLWZvci1hdHRlbnRpb24iLCJzaXplIjoiNzI4eDkwIiwiZHNwIjoiRFYzNjAiLCJjcmVhdGl2ZV9pZCI6IjUwMDAwMDAxMTEiLCJtYXNzIjp7ImVuZHBvaW50IjoiaHR0cHM6Ly9jZG4uaW5za2luYWQuY29tL2lzZmUvdGFncy9pcHQuanMifX0=&gdpr=${GDPR}&gdpr_consent=${GDPR_CONSENT_150}&c=${CLICK_URL_ENC}&dv_io=${INSERTION_ORDER_ID}&dv_line=${CAMPAIGN_ID}" }); })(); </script>' //  The original third-party tag used for the creative. Required and only valid for third-party tag creatives
};

function formatDate(date) {
  const [year, month, day] = date.toISOString().split('T')[0].split('-');

  return { year, month, day };
}
