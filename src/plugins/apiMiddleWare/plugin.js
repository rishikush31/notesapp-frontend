import { createPlugin } from 'fusion-core';
import fetch from 'node-fetch';
import { useSelector } from 'react-redux';
import {useService} from 'fusion-react';
import {EnvToken} from '../env/token';

export default createPlugin({
  deps: {
    env: EnvToken,
  },
  middleware({env}) {
    return async (ctx, next) => {
      // Only proxy API / Auth routes
      if (!__NODE__ || (!ctx.path.startsWith('/api') && !ctx.path.startsWith('/auth'))) {
        return next();
      }

      console.log("Getting Request")

      console.log("ENV : ", env);

      console.log("Not forward")
      // Read body (if any)
      let body;
      if (ctx.req && ctx.req.readable) {
        body = await new Promise((resolve) => {
          let data = '';
          ctx.req.on('data', chunk => (data += chunk));
          ctx.req.on('end', () => resolve(data));
        });
      }

      // Forward request to backend
      console.log("BACKEND_BASE_URL : ",env.BACKEND_BASE_URL);
      const res = await fetch(`${env.BACKEND_BASE_URL}${ctx.path}`, {
        method: ctx.method,
        headers: {
          'content-type': ctx.headers['content-type'] || 'application/json',
          cookie: ctx.headers.cookie || '',
        },
        body: body || undefined,
      });

      console.log("[apiMiddleware] Request : ", ctx.url, ctx.method)
      console.log("[apiMiddleware] Response : ", res)

      // Forward status
      ctx.status = res.status;

      // Forward Set-Cookie headers
      const setCookie = res.headers.raw()['set-cookie'];
      if (setCookie) {
        ctx.set('set-cookie', setCookie);
      }

      // Forward response body
      const text = await res.text();
      console.log("[apiMiddleware] Response Text: ", text, JSON.parse(text))
      try {
        ctx.body = JSON.parse(text) || {} ;
      } catch {
        ctx.body = text;
      }
    };
  },
});
