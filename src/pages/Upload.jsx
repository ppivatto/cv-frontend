import { useState } from "react";
import Spinner from "../components/Spinner";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  // 🔐 Simulamos un usuario logueado (esto después será dinámico)
  const userId = localStorage.getItem("token") || "anon";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setServerResponse(null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor seleccioná un archivo 🥺");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      setServerResponse(null);

      const res = await fetch("http://localhost:3001/cv/process", {
        method: "POST",
        body: formData,
        headers: {
          "x-user-id": userId, // ❤️ ACÁ SE ENVÍA EL USUARIO
        },
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage("Hubo un error al procesar el CV 😕");
        return;
      }

      setMessage("Procesado con éxito 👍");
      setServerResponse(data);
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 className="text-4xl font-bold mb-6">Subir CV (primer pasito)</h1>

      {/* INPUT FILE */}
      <input
        type="file"
        className="block w-full text-sm text-gray-900 
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
        onChange={handleFileChange}
      />

      {/* BOTÓN */}
      <div className="mt-4">
        <button
          onClick={handleUpload}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
          Subir
        </button>
      </div>

      {/* SPINNER */}
      {loading && (
        <div className="p-6 flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-gray-600 text-sm">Procesando...</p>
        </div>
      )}

      {/* MENSAJE */}
      {!loading && message && (
        <p className="mt-3 text-lg">{message}</p>
      )}

      {/* RESPUESTA DEL BACKEND (DEBUG) */}
      {serverResponse && (
        <pre
          className="mt-6 p-4 text-sm bg-gray-100 rounded overflow-auto"
          style={{ maxHeight: "600px" }}
        >
          {JSON.stringify(serverResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}
