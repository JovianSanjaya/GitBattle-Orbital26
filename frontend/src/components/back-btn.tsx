
import { useNavigate } from "react-router-dom";

function BackBtn(){
    
    const navigate = useNavigate();

    return(
    <button className="back-btn" onClick={() => navigate("/")}>
          <span className="back-arrow">←</span>
          <span>Back</span>
      </button>
    );
}

export default BackBtn;