import { appHtml,response } from '../backend/index.js';
import { FRONTEND_JS } from '../frontend/index.js';
const VERSION='5.0.0';
export default{async fetch(request,env){const url=new URL(request.url);if(request.method!=='GET'&&request.method!=='HEAD')return response('Method Not Allowed','text/plain; charset=utf-8',405,{allow:'GET, HEAD'});if(url.pathname==='/health')return Response.json({ok:true,app:'PDFWriter',version:env?.APP_VERSION||VERSION,worker:true});if(url.pathname==='/frontend/index.js')return response(FRONTEND_JS,'application/javascript; charset=utf-8');if(url.pathname==='/'||url.pathname==='/index.html')return response(appHtml());return response('404 Not Found','text/plain; charset=utf-8',404)}};
