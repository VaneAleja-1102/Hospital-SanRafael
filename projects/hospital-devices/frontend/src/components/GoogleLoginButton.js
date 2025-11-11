import React, { useEffect } from 'react';
import { API_BASE } from '../config';

export default function GoogleLoginButton({ onLoginSuccess }) {
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: '815972207565-etag6mup0ekbg4crmfvpauqejb00936e.apps.googleusercontent.com', // define en .env.local
        callback: handleCredentialResponse,
        ux_mode: 'popup'
      });
      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  async function handleCredentialResponse(response) {
    // response.credential is the id_token
    const idToken = response.credential;
    try {
      const res = await fetch(`${API_BASE}api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      const data = await res.json();
      // store JWT
      localStorage.setItem('token', data.token);
      // optional: user data
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      console.error('Login error', err);
      alert('Error al iniciar sesión: ' + err.message);
    }
  }

  return <div id="googleSignInDiv"></div>;
}
