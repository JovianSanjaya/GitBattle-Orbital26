import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../components/back-btn";
import GoogleIcon from "../components/google-icon";
import { useGoogleAuth } from "../auth/google-auth-provider";

function SignUp() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError("");

    if (!email.trim() || !username.trim() || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setLocalError("Email sign up is not available yet. Please use Google login.");
    setLoading(false);
  }

  return (
    <main className="auth-screen">
      <BackBtn></BackBtn>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title font-press-start">Sign Up</h1>

        <div className="auth-avatar-row">
          <button
            className="auth-avatar-btn"
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Upload profile picture"
          >
            {avatarPreview ? (
              <img className="auth-avatar-img" src={avatarPreview} alt="Preview" />
            ) : (
              <span className="auth-avatar-placeholder">+</span>
            )}
          </button>

          <span className="auth-avatar-hint">Profile picture optional</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

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
          Username
          <input
            className="auth-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
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
            autoComplete="new-password"
            required
          />
        </label>

        {localError && <p className="auth-error">{localError}</p>}

        <button className="auth-button font-press-start" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create An Account"}
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
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </button>
      </form>
    </main>
  );
}

export default SignUp;
