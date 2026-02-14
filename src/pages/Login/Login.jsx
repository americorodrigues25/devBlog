// css
import styles from "./Login.module.css";

import { useState, useEffect } from "react";

// hooks
import { useAuthentication } from "../../hooks/useAuthentication";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);

    setEmail("");
    setPassword("");
  };


  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça o logni para poder utilizar o sistema</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password">
          Senha:
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {authError && <p className="error">{authError}</p>}
        {!loading && (
          <button type="submit" className="btn">
            Entrar
          </button>
        )}

        {loading && (
          <button type="submit" className="btn" disabled>
            Aguarde...
          </button>
        )}
      </form>
    </div>
  )
};

export default Login;
