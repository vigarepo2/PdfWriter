import { appHtml, response } from '../backend/index.js';
import { FRONTEND_JS } from '../frontend/index.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname: path } = url;

    if (path === '/health')
      return Response.json({ ok: true, app: 'PdfWriter', version: '4.0.0', ts: Date.now() });

    if (path === '/frontend/index.js')
      return response(FRONTEND_JS, 'application/javascript; charset=utf-8');

    if (path === '/')
      return response(appHtml());

    return response('404 Not Found', 'text/plain; charset=utf-8', 404);
  }
};
