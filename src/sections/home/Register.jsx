import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ROUTES } from "../../utils/apiRoutes.js";
import { webAuthnLogin } from "../../utils/webAuth.js";

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
    <section className="section-home">
      <div className="max-w-2xl mx-auto p-4 bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-home-light-foreground dark:text-home-dark-foreground  mb-4">
          Create Account
        </h2>

        {error && (
          <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
          />

          <label className="flex items-center space-x-2 text-home-light-muted-foreground dark:text-home-dark-muted-foreground ">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded-sm"
            />
            <span>
              I agree to the{" "}
              <Link
                to="/tos"
                className="text-home-light-foreground dark:text-home-dark-foreground  hover:underline"
                target="_blank"
              >
                Terms of Service
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-home-light-border dark:border-home-dark-border "></div>
          <span className="px-4 text-home-light-muted-foreground dark:text-home-dark-muted-foreground  text-sm">
            or
          </span>
          <div className="flex-1 border-t border-home-light-border dark:border-home-dark-border "></div>
        </div>

        <button
          onClick={handlePasskeyRegister}
          disabled={loading}
          className="w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50 mb-6"
        >
          Register with Passkey
        </button>

        <p className="text-center text-home-light-muted-foreground dark:text-home-dark-muted-foreground ">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-home-light-foreground dark:text-home-dark-foreground  hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
