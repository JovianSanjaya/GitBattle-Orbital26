import logo from "../assets/gitbattle-logo.png";

function Landing(){
    return (
        <div className="landing">

            {/* landing intro */}
            <section className="landing">
                <header className="landing-header">
                    
                    <button className="logo-title">
                        <img className="landing-logo" src={logo} alt="GitBattle Logo" />
                        <span className="landing-title font-press-start">GitBattle</span>
                    </button>

                    <div className="header-actions">
                        <button className="header-btn font-press-start">Sign Up</button>
                        <button className="header-btn font-press-start">Login</button>
                    </div>


                </header>
                
                <div className="header-divider" />

                <div className="landing-intro-hero">
                    <h1 className="hero-title font-press-start">
                        Build Real Git Intuition<br />
                        Through A Game
                    </h1>
                    <p className="hero-subtitle font-press-start">By Jovian And Pinchu</p>
                    <button className="header-btn font-press-start">Explore</button>
                </div>

            </section>


            {/* landing mode */}
            <section className="landing">
                <div className="mode-section">
                    <div className="mode-actions">
                        <button className="mode-btn font-press-start">Singleplayer</button>
                        <button className="mode-btn font-press-start">Multiplayer</button>
                    </div>
                    <h2 className="mode-title font-press-start">
                        Choose The <br /> 
                        Mode
                    </h2>
                </div>
            </section>
        </div>
    );


}

export default Landing;