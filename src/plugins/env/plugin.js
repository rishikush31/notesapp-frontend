import {createPlugin} from 'fusion-core';

export default createPlugin({
  provides: () => {
    if (!__NODE__) {
      return {};
    }
    require('dotenv').config();
    return {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    };
  },
});
