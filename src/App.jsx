import { useState } from 'react';
import Spinner from './components/Spinner';

function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setFileUrl(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor seleccioná un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setMessage('');
      setFileUrl(null);

      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('Subido con éxito 👍');
        setFileUrl(data.data.publicUrl);
      } else {
        setMessage('Error al subir 😕');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '3rem', color: '#14212b' }}>
        Subir CV (primer pasito)
      </h1>

      <input
        type='file'
        className='block w-full text-sm text-gray-900 
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100
'
        onChange={handleFileChange}
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleUpload}>Subir</button>
      </div>

      {/* SPINNER */}
      {loading && (
        <div className='p-6 flex flex-col items-center gap-3'>
          <Spinner />
          <p className='text-gray-600 text-sm'>Procesando...</p>
        </div>
      )}

      {/* MENSAJE */}
      {!loading && message && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>{message}</p>
      )}

      {/* LINK AL PDF */}
      {!loading && fileUrl && (
        <p style={{ marginTop: '10px' }}>
          Tu archivo está disponible aquí:{' '}
          <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
            Ver PDF
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
