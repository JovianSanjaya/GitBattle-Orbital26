import Landing from "./screens/landing";
import SignUp from "./screens/sign-up";
import Login from "./screens/login";
import Puzzle from "./screens/puzzle";
import Game from "./screens/game";
import MultiplayerRoom from "./screens/multiplayer-room";
import CreateRoom from "./screens/create-room";
import SoundBtn from "./components/sound-btn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAuthProvider } from "./auth/google-auth-provider";
import DocumentationPanel from "./screens/documentation_panel_front";
import DocumentationDetail from "./screens/documentation_panel_details";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleAuthProvider>
        <BrowserRouter>
          <SoundBtn />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/puzzle/:id" element={<Game />} />
            <Route path="/multiplayer-room" element={<MultiplayerRoom />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/documentation" element={<DocumentationPanel />} />
            <Route path="/documentation/:commandId" element={<DocumentationDetail />} />
          </Routes>
        </BrowserRouter>
      </GoogleAuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
