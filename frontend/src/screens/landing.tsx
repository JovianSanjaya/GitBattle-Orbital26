import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bench from "../assets/bench.png";
import bus from "../assets/bus.png";
import cloudLeft from "../assets/cloud_left.png";
import cloudRight from "../assets/cloud_right.png";
import logo from "../assets/gitbattle-logo.png";
import tree from "../assets/tree.png";

import { useGoogleAuth } from "../auth/google-auth-provider";
import ProfilePicture from "../components/profile-picture";

function Landing() {
  const navigate = useNavigate();

  const { user, logout } = useGoogleAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profilePicture = user?.picture || user?.pict || "";

  function signOut() {
    logout();
    setShowProfile(false);
  }

  function goToMode() {
    document.getElementById("choose-mode")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="landing">
        <header className="landing-header">

          <button className="logo-title" type="button">
            <img className="landing-logo" src={logo} alt="GitBattle Logo" />
            <span className="landing-title font-press-start">GitBattle</span>
          </button>

          {user ? (

            <div className="header-profile">

              <button
                className="header-profile-button"
                type="button"
                onClick={() => setShowProfile((isOpen) => !isOpen)}
              >
                <ProfilePicture src={profilePicture} name={user.name} />
              </button>

              {showProfile && (

                <div className="header-profile-menu">
                  <ProfilePicture src={profilePicture} name={user.name} />

                  <strong>{user.name}</strong>

                  <span>{user.email}</span>

                  <button className="font-press-start" type="button" onClick={signOut}>
                    Sign Out
                  </button>
                </div>

              )}
            </div>

          ) : (

            <div className="header-actions">
              <button className="header-btn font-press-start" type="button" onClick={() => navigate("/signup")}>
                Sign Up
              </button>

              <button className="header-btn font-press-start" type="button" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>

          )}
        </header>

        <div className="header-divider" />

        <div className="landing-intro-hero">

          <h1 className="hero-title font-press-start">
            Build Real Git Intuition
            <br />
            Through A Game
          </h1>

          <p className="hero-subtitle font-press-start">By Jovian And Pinchu</p>

          <button className="header-btn font-press-start" type="button" onClick={goToMode}>
            Explore
          </button>

        </div>

        <img className="landing-decor landing-bench" src={bench} alt="" draggable="false" />
        <img className="landing-decor landing-tree" src={tree} alt="" draggable="false" />

        <div className="grass-tile" />
      </section>

      <section className="landing" id="choose-mode">
        <div className="grass-tile-top" />

        <div className="mode-section">

          <div className="mode-actions">
            <button className="mode-btn font-press-start" type="button" onClick={() => navigate("/puzzle")}>
              Singleplayer
            </button>

            <button className="mode-btn font-press-start" type="button" onClick={() => navigate("/multiplayer-room")}>
              Multiplayer
            </button>
          </div>

          <h2 className="mode-title font-press-start">
            Choose The
            <br />
            Mode
          </h2>
        </div>

        <img className="mode-decor mode-bus" src={bus} alt="" draggable="false" />
        <img className="mode-decor mode-cloud-left" src={cloudLeft} alt="" draggable="false" />
        <img className="mode-decor mode-cloud-right" src={cloudRight} alt="" draggable="false" />

        <div className="grass-tile" />
      </section>
    </>
  );
}

export default Landing;
