
// Logic Flow
// 1. User press button
// 2. Google pop up and user approves
// 3. Google send access token and the access token sent to backend to show that user has approved
// 4. backend send result
// 5. if success continue, if error handle


import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import GoogleIcon from "../components/google-icon";
import type { GoogleAuthResponse } from "../types/google-auth";


function GoogleAuth(){

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      const login = await axios.post<GoogleAuthResponse>(`${import.meta.env.VITE_API_URL}/auth/google`,{
          acc_token : tokenResponse.access_token,
      });

      const res = login.data;

      if(res.success && res.user != null && res.token != null){

          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          alert("Google Successful");

      }else{

        alert(res.err);

      }

    },
    onError: (error) => console.log('Login Failed:', error),

  });


  return (

    <button className="auth-button google-button font-press-start" type="button" onClick={() => login()} >

      <GoogleIcon />
      
      Continue With Google

    </button>
    
  );

}

export default GoogleAuth;






