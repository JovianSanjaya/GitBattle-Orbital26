import {useEffect, useState} from "react";
import { playAudio, stopAudio } from "../service/sound-service";    

function SoundBtn(){

    const [soundPlaying, setSoundPlaying] = useState(false);

    useEffect(() => {
        return stopAudio;
    }, []);

    function toggleAudio(){
        if(soundPlaying){
            stopAudio();
            setSoundPlaying(false);
            return;
        }

        playAudio()
            .then(() => setSoundPlaying(true))
            .catch(() => setSoundPlaying(false));
    }

    return(
        <button className="sound-btn" onClick={toggleAudio}>
            {soundPlaying ? "Stop Music" : "Play Music"}
        </button>
    )
}

export default SoundBtn;
