import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {EnvToken} from '../plugins/env/token';
import { useService } from 'fusion-react';

export default function GoogleLoginButton({ onSuccess, onError }) {
  if (!__BROWSER__) return null; // never render on server

  const env = useService(EnvToken)

  console.log("ENV : ", env.GOOGLE_CLIENT_ID);

  return (
   <GoogleOAuthProvider clientId = {env.GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
}

