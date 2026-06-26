import GoogleIcon from "../components/google-icon";
import { useGoogleAuth } from "./google-auth-provider";

function GoogleAuth(){
  const { loginWithGoogle } = useGoogleAuth();

  return (
    <button
      className="auth-button google-button font-press-start"
      type="button"
      onClick={() => loginWithGoogle()}
    >
      <GoogleIcon />
      Continue With Google
    </button>
  );
}

export default GoogleAuth;
