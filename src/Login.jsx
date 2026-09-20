import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ROUTES } from "./utils/apiRoutes.js";
import { webAuthnLogin } from "./utils/webAuth.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.PASSWORD_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "true");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Login failed");
    }
    setLoading(false);
  }

  async function handlePasskeyLogin() {
    setError("");
    setLoading(true);
    try {
      const credentialId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSKEY_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: credentialId }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "true");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Passkey login failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Login
      </h2>

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      <form onSubmit={handlePasswordLogin} className="space-y-4 mb-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black disabled:opacity-50"
        >
          Login with Password
        </button>
      </form>

      <button
        onClick={handlePasskeyLogin}
        disabled={loading}
        className="w-full bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black disabled:opacity-50 mb-6"
      >
        Login with Passkey
      </button>

      <p className="text-center text-gray-700 dark:text-gray-300">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-cyan-500 dark:text-blue-400 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
