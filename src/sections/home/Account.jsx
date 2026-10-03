import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../utils/apiRoutes.js";
import { webAuthnLogin } from "../../utils/webAuth.js";
import ReactModal from "react-modal";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch(API_ROUTES.ME);
      const data = await res.json();
      if (data.success) {
        setUser(data);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }

  function openModal(name) {
    setError("");
    setModal(name);
    setNewUsername("");
    setCurrentPassword("");
    setNewPassword("");
    setEmail("");
    setPassword("");
    setConfirmText("");
  }

  async function handleChangeUsername(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_ROUTES.CHANGE_USERNAME, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
        fetchUser();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to change username");
    }
    setLoading(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_ROUTES.PASSWORD_CHANGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to change password");
    }
    setLoading(false);
  }

  async function handleChangePasskey() {
    setLoading(true);
    setError("");
    try {
      const deviceId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSKEY_CHANGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
        fetchUser();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Passkey registration failed");
    }
    setLoading(false);
  }

  async function handleAddPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const deviceId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSKEY_ADD_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
        fetchUser();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to add password");
    }
    setLoading(false);
  }

  async function handleAddPasskey(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const deviceId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSWORD_ADD_PASSKEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, password }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
        fetchUser();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to add passkey");
    }
    setLoading(false);
  }

  async function handleDeleteAccount(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let body;
      if (user.hasPassword && user.hasPasskey) {
        const deviceId = await webAuthnLogin();
        body = { password, deviceId };
      } else if (user.hasPassword) {
        body = { password };
      } else {
        const deviceId = await webAuthnLogin();
        body = { deviceId };
      }
      const res = await fetch(API_ROUTES.DELETE_ACCOUNT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "false");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete account");
    }
    setLoading(false);
  }

  async function handleLogout() {
    try {
      await fetch(API_ROUTES.LOGOUT, { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.setItem("loggedIn", "false");
    navigate("/");
  }
  async function handleDeletePasskey() {
    setLoading(true);
    setError("");
    try {
      const deviceId = await webAuthnLogin();
      const res = await fetch(API_ROUTES.PASSKEY_DELETE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        setModal(null);
        fetchUser();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Passkey registration failed");
    }
    setLoading(false);
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  rounded-lg shadow-md mt-8">
        <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground ">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <section className="section-home">
      <div className="max-w-2xl mx-auto p-4 bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-home-light-foreground dark:text-home-dark-foreground  mb-4">
          Account
        </h2>
        <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-2">
          Username: <strong>{user.username}</strong>
        </p>
        <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-6">
          Auth methods:{" "}
          {[user.hasPassword && "Password", user.hasPasskey && "Passkey"]
            .filter(Boolean)
            .join(", ") || "None"}
        </p>

        {error && (
          <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => openModal("changeUsername")}
            className="block w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  text-center"
          >
            Change Username
          </button>

          {user.hasPassword && (
            <button
              onClick={() => openModal("changePassword")}
              className="block w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  text-center"
            >
              Change Password
            </button>
          )}

          {user.hasPasskey && (
            <button
              onClick={() => openModal("changePasskey")}
              className="block w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  text-center"
            >
              Change Passkey
            </button>
          )}

          {user.hasPasskey && !user.hasPassword && (
            <button
              onClick={() => openModal("addPassword")}
              className="block w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  text-center"
            >
              Add Password
            </button>
          )}

          {user.hasPassword && !user.hasPasskey && (
            <button
              onClick={() => openModal("addPasskey")}
              className="block w-full bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  text-center"
            >
              Add Passkey
            </button>
          )}
          {user.hasPasskey && (
            <button
              onClick={() => openModal("deletePasskey")}
              className="block w-full bg-home-light-destructive dark:bg-home-dark-destructive py-2 px-4 rounded-md shadow-lg hover:bg-home-light-destructive dark:hover:bg-home-dark-destructive   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground text-center"
            >
              Delete Passkey
            </button>
          )}

          <button
            onClick={() => openModal("deleteAccount")}
            className="block w-full bg-home-light-destructive dark:bg-home-dark-destructive py-2 px-4 rounded-md shadow-lg hover:bg-home-light-destructive dark:hover:bg-home-dark-destructive   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground text-center"
          >
            Delete Account
          </button>

          <button
            onClick={handleLogout}
            className="block w-full bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted  text-center"
          >
            Log Out
          </button>
        </div>

        {/* Change Username Modal */}
        <ReactModal
          isOpen={modal === "changeUsername"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Change Username
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <form onSubmit={handleChangeUsername}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground  mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </ReactModal>

        {/* Change Password Modal */}
        <ReactModal
          isOpen={modal === "changePassword"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Change Password
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </ReactModal>

        {/* Change Passkey Modal */}
        <ReactModal
          isOpen={modal === "changePasskey"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Change Passkey
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-4">
              Click below to register a new passkey. Your browser will prompt
              you to use your security key or biometric.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
              >
                Cancel
              </button>
              <button
                onClick={handleChangePasskey}
                disabled={loading}
                className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register New Passkey"}
              </button>
            </div>
          </div>
        </ReactModal>

        {/* Delete Passkey Modal */}
        <ReactModal
          isOpen={modal === "deletePasskey"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Delete Passkey
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-4">
              Click below to delete your current passkey. Your browser will
              prompt you to use your security key or biometric.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePasskey}
                disabled={loading}
                className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Passkey"}
              </button>
            </div>
          </div>
        </ReactModal>

        {/* Add Password Modal */}
        <ReactModal
          isOpen={modal === "addPassword"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Add Password
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-4">
              First, register a passkey for identity verification. Then set your
              email and password.
            </p>
            <form onSubmit={handleAddPassword} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
                >
                  {loading
                    ? "Registering passkey..."
                    : "Register Passkey & Add Password"}
                </button>
              </div>
            </form>
          </div>
        </ReactModal>

        {/* Add Passkey Modal */}
        <ReactModal
          isOpen={modal === "addPasskey"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-foreground dark:text-home-dark-foreground ">
              Add Passkey
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <form onSubmit={handleAddPasskey} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Current password"
                className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-home-light-primary dark:bg-home-dark-primary text-home-light-primary-foreground dark:text-home-dark-primary-foreground py-2 px-4 rounded-md hover:bg-home-light-accent dark:hover:bg-home-dark-accent   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground  disabled:opacity-50"
                >
                  {loading
                    ? "Registering passkey..."
                    : "Verify & Register Passkey"}
                </button>
              </div>
            </form>
          </div>
        </ReactModal>

        {/* Delete Account Modal */}
        <ReactModal
          isOpen={modal === "deleteAccount"}
          onRequestClose={() => setModal(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-home-light-destructive dark:text-home-dark-destructive ">
              Delete Account
            </h3>
            {error && (
              <p className="text-home-light-destructive dark:text-home-dark-destructive  mb-4">
                {error}
              </p>
            )}
            <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground  mb-4">
              This action is permanent and cannot be undone. All your data,
              including comments, will be deleted.
            </p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {user.hasPassword ? (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  className="w-full p-2 border border-home-light-border dark:border-home-dark-border  rounded-md focus:outline-hidden focus:ring-2 focus:ring-home-light-ring dark:focus:ring-home-dark-ring  bg-inherit text-home-light-foreground dark:text-home-dark-foreground "
                />
              ) : (
                <p className="text-home-light-muted-foreground dark:text-home-dark-muted-foreground ">
                  Click below to verify with your passkey.
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mr-2 bg-home-light-muted dark:bg-home-dark-muted  text-home-light-foreground dark:text-home-dark-foreground  py-2 px-4 rounded-md hover:bg-home-light-muted dark:hover:bg-home-dark-muted "
                >
                  Cancel
                </button>
                {user.hasPassword ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-home-light-destructive dark:bg-home-dark-destructive py-2 px-4 rounded-md hover:bg-home-light-destructive dark:hover:bg-home-dark-destructive   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="bg-home-light-destructive dark:bg-home-dark-destructive py-2 px-4 rounded-md hover:bg-home-light-destructive dark:hover:bg-home-dark-destructive   hover:text-home-light-accent-foreground dark:hover:text-home-dark-accent-foreground disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </ReactModal>
      </div>
    </section>
  );
}
