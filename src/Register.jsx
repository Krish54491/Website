import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ROUTES } from "./utils/apiRoutes.js";
import { webAuthnLogin } from "./utils/webAuth.js";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Service");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.PASSWORD_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "true");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Registration failed");
    }
    setLoading(false);
  }

  async function handlePasskeyRegister() {
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Service");
      return;
    }

    setLoading(true);
    try {
      const credentialId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSKEY_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: credentialId, username }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "true");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Passkey registration failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Create Account
      </h2>

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit text-gray-900 dark:text-gray-100"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit text-gray-900 dark:text-gray-100"
        />

        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded"
          />
          <span>
            I agree to the{" "}
            <Link
              to="/tos"
              className="text-cyan-500 dark:text-blue-400 hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black disabled:opacity-50"
        >
          Create Account
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">
          or
        </span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
      </div>

      <button
        onClick={handlePasskeyRegister}
        disabled={loading}
        className="w-full bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black disabled:opacity-50 mb-6"
      >
        Register with Passkey
      </button>

      <p className="text-center text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-cyan-500 dark:text-blue-400 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
