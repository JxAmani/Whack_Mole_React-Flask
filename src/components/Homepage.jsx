import { Link } from "react-router-dom";
import "./Homepage.css";

 function HomePage() {
  return (
    <>
      <div className="container">
        <div className="instructions">
          🛠️ <strong>Instructions:</strong> Click <em>"Register"</em> to create an account. If you already have one, click <em>"Login"</em> to continue.
        </div>

        <div className="card-box">
          <h1>Welcome to Whack-a-Mole</h1>
          <div className="button-group">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
            <Link to="/game">
              <button>Play Game</button>
            </Link>
          </div>
        </div>

        {/* How to Play Section  */}
        <div className="how-to-play">
          <h2>How to Play</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-title">Click Start</div>
              <p>Begin the game and watch for moles popping up</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-title">Whack Moles</div>
              <p>Click on moles quickly to score points</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-title">Beat Records</div>
              <p>Try to beat your high score </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-title">Celebrate Victory</div>
              <p>Enjoy the game!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;