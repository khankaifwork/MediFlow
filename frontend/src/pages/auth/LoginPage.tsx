import { useState } from "react";
import { login } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    const data = await login(username, password);

    loginUser(data.access_token);

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Invalid username or password");
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          MediFlow Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="mb-4 w-full rounded-lg border p-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;