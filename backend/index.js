const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};

export function response(body, type = 'text/html; charset=utf-8', status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      'content-type': type,
      'cache-control': 'no-store, no-cache, must-revalidate',
      ...SECURITY_HEADERS,
      ...headers
    }
  });
}

export function jsonResponse(data, status = 200) {
  return response(JSON.stringify(data), 'application/json; charset=utf-8', status);
}

export function appHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f7f8fb">
  <meta name="description" content="Premium legal-size exemption application PDF generator.">
  <title>PDFWriter Legal</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23635bff'/%3E%3Cpath d='M20 14h18l8 8v28H20z' fill='white'/%3E%3Cpath d='M38 14v10h8' fill='%23dfe3ff'/%3E%3Cpath d='M26 32h12M26 38h12M26 44h8' stroke='%23635bff' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/frontend/index.js"></script>
</body>
</html>`;
}
