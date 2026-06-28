import { useState } from "react";
import { useNavigate } from "react-router-dom";
import building from "../assets/purple_building.png";
import BackBtn from "../components/back-btn";

function MultiplayerRoom(){
  const navigate = useNavigate();
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return(
    <section className="multiplayer">
      <div className="grass-tile-top" />

      <img
        className="multiplayer-decor multiplayer-building"
        src={building}
        alt=""
        draggable="false"
      />

      <BackBtn></BackBtn>

      <h2 className="multiplayer-title font-press-start">
        Versus Battle
      </h2>

      <div className="multiplayer-section">
        <div className="multiplayer-actions">
          <button
            className="multiplayer-btn font-press-start"
            onClick={() => navigate("/create-room")}
          >
            Create A Room
          </button>

          <button
            className="multiplayer-btn font-press-start"
            onClick={() => setShowJoinRoom(true)}
          >
            Join A Room
          </button>
        </div>
      </div>

      {showJoinRoom && (
        <div className="join-room-blur">
          <div className="join-room-container">
            <h3 className="join-room-title font-press-start">Join A Room</h3>

            <input className="join-room-input" type="text" />

            <div className="join-room-action">
              <button
                className="join-room-btn font-press-start"
                onClick={() => setShowJoinRoom(false)}
              >
                Cancel
              </button>

              <button
                className="join-room-btn font-press-start"
                type="button"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MultiplayerRoom;
