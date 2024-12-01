import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const tokens = await axios.post("http://localhost:4000/auth/google", {
        code: codeResponse.code,
      });
      console.log(tokens);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>

        <label>Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <button dsiabled={isLoading}>Login</button>
        {error && <div className="error">{error}</div>}
      </form>
      <button
        className="login-with-google-btn"
        onClick={() => handleGoogleLogin()}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
