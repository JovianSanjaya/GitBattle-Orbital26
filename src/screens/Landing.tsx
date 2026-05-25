import logo from "../assets/gitbattle-logo.png";
import { useNavigate } from 'react-router-dom';


function Landing(){
    
    const navigate = useNavigate();

    return (
        <>

            {/* landing intro */}
            <section className="landing">
                <header className="landing-header">
                    
                    <button className="logo-title" type="button">
                        <img className="landing-logo" src={logo} alt="GitBattle Logo" />
                        <span className="landing-title font-press-start">GitBattle</span>
                    </button>

                    <div className="header-actions">
                        <button className="header-btn font-press-start" onClick={() => navigate('/signup')}>Sign Up</button>
                        <button className="header-btn font-press-start" onClick={() => navigate('/login')}>Login</button>
                    </div>


                </header>
                
                <div className="header-divider" />

                <div className="landing-intro-hero">
                    <h1 className="hero-title font-press-start" >
                        Build Real Git Intuition<br />
                        Through A Game
                    </h1>
                    <p className="hero-subtitle font-press-start">By Jovian And Pinchu</p>
                    <button className="header-btn font-press-start"  onClick={() => navigate('/signup')}>Explore</button>
                </div>


            </section>


            {/* landing mode */}
            <section className="landing">
                <div className="grass-tile-top"></div>

                <div className="mode-section">

                    <div className="mode-actions">
                        <button className="mode-btn font-press-start" onClick={() => navigate('/puzzle')}>Singleplayer</button>
                        <button className="mode-btn font-press-start" onClick={() => navigate('/multiplayer-room')}>Multiplayer</button>
                    </div>

                    <h2 className="mode-title font-press-start">
                        Choose The <br /> 
                        Mode
                    </h2>
                </div>

                <div className="grass-tile"></div>

            </section>
        </>
    );


}

export default Landing;
