import lofi_sound from "../assets/lofi.mp3";

const sound_src = lofi_sound;
const volume = 0.25;

let audio: HTMLAudioElement | null = null;

function getAudio(){
    
    if(!audio){
        audio = new Audio(sound_src);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = volume;
    }

    return audio;
}

export async function playAudio(){
    const audio = getAudio();

    await audio.play();

}

export function stopAudio(){

    if(!audio){
        return;
    }

    audio.pause();
    audio.currentTime = 0;

}