
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../components/google-icon";
import BackBtn from  "../components/back-btn";


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

        <button className="auth-button google-button font-press-start" >
          <GoogleIcon />
          Continue With Google
        </button>

        <button className="auth-link-button" onClick={() => navigate("/login")}>  Already have an account?  </button>
      </form>
    </main>
  );
}

export default SignUp;
