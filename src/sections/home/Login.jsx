import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ROUTES } from "../../utils/apiRoutes.js";
import { webAuthnLogin } from "../../utils/webAuth.js";

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
    <section className="section-home">
      <div className="max-w-2xl mx-auto p-4 bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-home-light-foreground dark:text-home-dark-foreground  mb-4">
          Login
        </h2>

        {error && (
          <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
          >
            Login with Password
          </button>
        </form>

        <button
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50 mb-6"
        >
          Login with Passkey
        </button>

        <p className="text-center text-home-light-muted-foreground dark:text-home-dark-muted-foreground ">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-home-light-foreground dark:text-home-dark-foreground  hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
