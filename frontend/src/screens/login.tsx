
import { useNavigate } from "react-router-dom";
import BackBtn from  "../components/back-btn";
import GoogleAuth from "../auth/google-auth";

function Login() {
  const navigate = useNavigate();

  return (
    <main className="auth-screen">
      
      <BackBtn></BackBtn>

      <form className="auth-form">

        <h1 className="auth-title font-press-start">Login</h1>

        <label className="auth-label">
          Email
          <input className="auth-input" type="text" />
        </label>

        <label className="auth-label">
          Password
          <input className="auth-input" type="password" />
        </label>

        <button className="auth-button font-press-start" > Continue </button>

        <div className="auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <GoogleAuth/>

        <button className="auth-link-button" onClick={() => navigate("/signup")}>  Create an account </button>
      </form>
    </main>
  );
}

export default Login;
