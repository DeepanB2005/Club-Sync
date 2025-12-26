// googleOauth.jsx
import { GoogleLogin } from '@react-oauth/google';

const GoogleOauth = ({ onLogin }) => (
  <GoogleLogin
    onSuccess={credentialResponse => {
      fetch('https://club-events-1.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
        .then(res => res.json())
        .then(data => {
          if (onLogin) onLogin(data.user);
        });
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  />
);

export default GoogleOauth;
