import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  if (!__BROWSER__) return null; // never render on server

  return (
   <GoogleOAuthProvider clientId = "425113939071-v6t72sp3bgrbem2ts51cfidp8dh4o8nh.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
}

