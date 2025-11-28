import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.success) {
        setError("Email o contraseña incorrectos");
        return;
      }

      // guardamos el token (userId)
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch (err) {
      setError("Error de conexión con el servidor: ", err);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

      <input
        type="text"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        Entrar
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
