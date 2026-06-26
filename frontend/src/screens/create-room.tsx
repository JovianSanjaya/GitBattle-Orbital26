import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../auth/google-auth-provider";
import BackBtn from "../components/back-btn";
import ProfilePicture from "../components/profile-picture";

function CreateRoom() {
  const navigate = useNavigate();
  const { user } = useGoogleAuth();

  const [roomCode] = useState(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  });

  const playerName = user?.name || "Player";
  const playerPicture = user?.picture || user?.pict || "";

  function leaveCurrentRoom() {
    navigate("/multiplayer-room");
  }

  return (
    <main className="room-page">
      <BackBtn />

      <section className="room-card">
        <p className="room-status font-press-start">Room ready.</p>

        <h1 className="font-press-start">Room Code</h1>

        <p className="room-code-display font-press-start">
          {roomCode}
        </p>

        <div className="room-player-list" aria-label="Players in room">
          <div className="room-player">
            <span className="room-player-identity">
              <ProfilePicture src={playerPicture} name={playerName} />

              <span className="room-player-name font-press-start">
                {playerName}
              </span>
            </span>

            <span className="room-player-role">Host</span>
          </div>
        </div>

        <div className="room-actions">
          <button
            className="room-action-btn font-press-start"
            type="button"
          >
            Ready
          </button>

          <button
            className="room-action-btn font-press-start"
            type="button"
          >
            Start
          </button>

          <button
            className="room-action-btn font-press-start"
            type="button"
            onClick={leaveCurrentRoom}
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
}

export default CreateRoom;
