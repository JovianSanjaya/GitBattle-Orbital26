
import { useNavigate } from "react-router-dom";
import BackBtn from  "../components/back-btn";
import GoogleAuth from "../auth/google-auth";


function SignUp() {
  const navigate = useNavigate();

  return (
    <main className="auth-screen">

      <BackBtn></BackBtn>
      
      <form className="auth-form">

        <h1 className="auth-title font-press-start">Sign Up</h1>

        <label className="auth-label">
          Email
          <input className="auth-input" type="text" />
        </label>

        <label className="auth-label">
          Username
          <input className="auth-input" type="text" />
        </label>

        <label className="auth-label">
          Password
          <input className="auth-input" type="password" />
        </label>

        <button className="auth-button font-press-start" > Create An Account </button>

        <div className="auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <GoogleAuth />

        <button className="auth-link-button" onClick={() => navigate("/login")}>  Already have an account?  </button>
      </form>
    </main>
  );
}

export default SignUp;
