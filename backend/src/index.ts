import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import axios from "axios";


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true });
});


app.post("/auth/google", async (req, res) => {

  try{
     const token = req.body.acc_token;
    
    if(!token){
      console.log("access token empty");
      res.status(400).json({ success: false, error: "access token empty" });
      return;
    }
    
    // Google endpoint to get user info for OAuth
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
      headers: {
         Authorization: `Bearer ${token}`,
      }
    });

    const user = response.data;

   res.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        pict: user.pict,
      },
    });


  }catch(e){
    res.status(500).json({ success: false, error: "Google login failed" });
    console.log(e);
  }
    
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
