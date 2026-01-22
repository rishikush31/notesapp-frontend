import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  if (!__BROWSER__) return null; // never render on server

  return (
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    
  );
}

