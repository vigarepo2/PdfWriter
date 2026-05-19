export function response(body, type = 'text/html; charset=utf-8', status = 200) {
  return new Response(body, {
    status,
    headers: {
      'content-type': type,
      'cache-control': 'no-store, no-cache, must-revalidate',
      'x-content-type-options': 'nosniff'
    }
  });
}

export function appHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#ffffff">
  <title>PdfWriter | Exemption Application</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/frontend/index.js"></script>
</body>
</html>`;
}
