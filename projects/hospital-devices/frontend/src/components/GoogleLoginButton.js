import React, { useEffect } from "react";
import { API_BASE } from "../config";

export default function GoogleLoginButton({ onLoginSuccess }) {

  // 🔧 mover aquí la función para usarla en dependencias
  async function handleCredentialResponse(response) {
    const idToken = response.credential;

    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error en el inicio de sesión");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);

    } catch (err) {
      console.error("Login error:", err);
      alert("Error al iniciar sesión: " + err.message);
    }
  }

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "815972207565-etag6mup0ekbg4crmfvpauqejb00936e.apps.googleusercontent.com",
        callback: handleCredentialResponse, // ahora válido
        ux_mode: "popup",
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [handleCredentialResponse]); // 🔧 agregar dependencia

  return <div id="googleSignInDiv"></div>;
}
