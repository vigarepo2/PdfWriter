export function response(body, type = 'text/html; charset=utf-8', status = 200) {
  return new Response(body, {
    status,
    headers: {
      'content-type': type,
      'cache-control': 'no-store, no-cache, must-revalidate',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
  });
}

export function appHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#1a1a2e">
  <meta name="description" content="PDFWriter Legal - Professional Exemption Application Generator for LADC Fazilka">
  <meta name="robots" content="noindex,nofollow">
  <title>PDFWriter Legal | Exemption Application Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;background:#f0f2f5}
    #app{min-height:100dvh;display:flex;flex-direction:column}
    .app-shell-loader{position:fixed;inset:0;background:#f0f2f5;display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity .3s}
    .app-shell-loader svg{animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
  <div class="app-shell-loader" id="loader" aria-hidden="true">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b6fce" stroke-width="2.5" stroke-linecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  </div>
  <div id="app" role="main"></div>
  <script type="module" src="/frontend/index.js"></script>
</body>
</html>`;
}
