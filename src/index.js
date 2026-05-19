import { appHtml, response } from '../backend/index.js';
import { FRONTEND_JS } from '../frontend/index.js';

export default {
  async fetch(request) {
    const path = new URL(request.url).pathname;
    const assetPath = '/' + 'frontend' + '/index.js';
    if (path === '/health') return Response.json({ ok: true, app: 'PdfWriter', version: '2.1.0' });
    if (path === assetPath) return response(FRONTEND_JS, 'application/javascript; charset=utf-8');
    if (path === '/') return response(appHtml());
    return response('Not found', 'text/plain; charset=utf-8');
  }
};
