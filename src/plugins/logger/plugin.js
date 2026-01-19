// plugins/logger/plugin.js
import { LoggerToken } from './token';
import { createPlugin } from 'fusion-core';

export default createPlugin({

  provides() {
    return {
      log({ message, meta = {}, level = 'info' }) {
        const env = __NODE__ ? 'SERVER' : 'CLIENT';
        const prefix = `[${env}]`;
        if (level === 'error') console.error(prefix, message, meta);
        else console.log(prefix, message, meta);
      },
    };
  },

  middleware() {
    return async (ctx, next) => {
      if(__NODE__)
        console.log(`[SERVER-MW] Request for: ${ctx.path}`);
      await next();
    };
  },
});
