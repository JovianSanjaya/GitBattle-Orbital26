import Landing  from "./screens/landing";
import SignUp from "./screens/sign-up";
import Login from "./screens/login";
import Puzzle from "./screens/puzzle";
import MultiplayerRoom from "./screens/multiplayer-room"; 
import CreateRoom from "./screens/create-room";
import SoundBtn from "./components/sound-btn";
import { BrowserRouter, Route, Routes} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <SoundBtn />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/multiplayer-room" element={<MultiplayerRoom />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
