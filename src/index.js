import { appHtml, jsonResponse, response } from '../backend/index.js';
import { FRONTEND_JS } from '../frontend/index.js';

function send(request, res) {
  if (request.method === 'HEAD') {
    return new Response(null, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  }
  return res;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return response('Method not allowed', 'text/plain; charset=utf-8', 405, {
        allow: 'GET, HEAD'
      });
    }

    if (path === '/') {
      return send(request, response(appHtml()));
    }

    if (path === '/frontend/index.js') {
      return send(request, response(FRONTEND_JS, 'application/javascript; charset=utf-8'));
    }

    if (path === '/health') {
      return send(request, jsonResponse({
        ok: true,
        app: 'PDFWriter Legal',
        version: '4.0.0'
      }));
    }

    return send(request, response('Not found', 'text/plain; charset=utf-8', 404));
  }
};
