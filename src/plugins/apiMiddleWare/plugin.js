import { createPlugin } from 'fusion-core';
import { ApiFetchToken } from '../apiFetch/token';

export default createPlugin({
    deps: {
        apiFetch: ApiFetchToken,
    },

    middleware({ apiFetch }) {
        return async (ctx, next) => {
            console.log("[apiMiddleware] Incoming path:", ctx.path);
            console.log("[apiMiddleware] Request method:", ctx.method);

            if (!__NODE__ || (!ctx.path.startsWith('/api') && !ctx.path.startsWith('/auth'))) {
                console.log("[apiMiddleware] Skipping path, calling next()");
                return next();
            }

            console.log("[apiMiddleware] Handling path:", ctx.path);

            // Read raw body from ctx.req
            let rawBody = undefined;
            if (ctx.req && ctx.req.readable) {
                rawBody = await new Promise((resolve, reject) => {
                    let data = '';
                    ctx.req.on('data', chunk => {
                        console.log("[apiMiddleware] Received chunk:", chunk.toString());
                        data += chunk;
                    });
                    ctx.req.on('end', () => {
                        console.log("[apiMiddleware] Completed reading body:", data);
                        resolve(data);
                    });
                    ctx.req.on('error', err => {
                        console.error("[apiMiddleware] Error reading body:", err);
                        reject(err);
                    });
                });
            } else {
                console.log("[apiMiddleware] No readable body found");
            }

            console.log("[apiMiddleware] Forwarding body to backend:", rawBody);

            const cookiesToForward = ctx.headers.cookie || '';
            console.log("[apiMiddleware] Forwarding cookies:", cookiesToForward);

            const res = await apiFetch(ctx, ctx.path, {
                method: ctx.method,
                headers: {
                    'content-type': 'application/json',
                    cookie: cookiesToForward, // forward everything
                },
                body: rawBody,
            });

            console.log("[apiMiddleware] Response from backend:", {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
            });

            try {
                ctx.body = await res.json();
                console.log("[apiMiddleware] Response body parsed:", ctx.body);
            } catch (err) {
                console.warn("[apiMiddleware] Could not parse JSON response:", err);
                ctx.body = await res.text(); // fallback to raw text
            }

            ctx.status = res.status;
            console.log("[apiMiddleware] Setting ctx.status:", ctx.status);
        };
    },
});
