import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../components/back-btn";
import GoogleIcon from "../components/google-icon";
import { useGoogleAuth } from "../auth/google-auth-provider";

function Login() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setLocalError("Email login is not available yet. Please use Google login.");
    setLoading(false);
  }

  return (
    <main className="auth-screen">
      <BackBtn></BackBtn>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title font-press-start">Login</h1>

        <label className="auth-label">
          Email
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {localError && <p className="auth-error">{localError}</p>}

        <button className="auth-button font-press-start" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Continue"}
        </button>

        <div className="auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <button
          className="auth-button google-button font-press-start"
          type="button"
          onClick={() => loginWithGoogle()}
        >
          <GoogleIcon />
          Continue With Google
        </button>

        <button
          className="auth-link-button"
          type="button"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
      </form>
    </main>
  );
}

export default Login;
