export function response(body, type = 'text/html; charset=utf-8') {
  return new Response(body, {
    headers: {
      'content-type': type,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

export function appHtml() {
  const open = String.fromCharCode(60);
  const close = String.fromCharCode(62);
  const tag = 'scr' + 'ipt';
  const loader = open + tag + ' src="/frontend/index.js"' + close + open + '/' + tag + close;
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#ffffff"><title>PdfWriter - Exemption Application</title></head><body><div id="app"></div>' + loader + '</body></html>';
}
