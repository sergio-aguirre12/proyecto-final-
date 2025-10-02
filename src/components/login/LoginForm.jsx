import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../login/login.css"; 
import { loginUsuario } from '../../services/Api.jsx';

const LoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const data = await loginUsuario(usuario, password);

      if (data.length === 1) {
        const user = data[0];
        localStorage.setItem('usuario', JSON.stringify(user));
        if (user.rol === 'admin') navigate('/admin/dashboard');
        else if (user.rol === 'guardia') navigate('/guardia/entrada');
        else setError('Rol no reconocido.');
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card2">
          <form onSubmit={handleSubmit} className="form" noValidate>
            <h1 id="heading1">security app</h1>
            <p id="heading">LOGIN</p>

            {error && <p className="error">{error}</p>}

            <div className="field">
              <input
                className="input-field"
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <input
                className="input-field"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="btn">
              <button type="submit" className="button2">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;