import React, { useState, useEffect } from "react";
import './App.css'
import { useSpeechSynthesis } from 'react-speech-kit';
import axios from "axios";
import sound from "/sound.png"

function TextToSpeech({Question}){
    const [text, setText] = useState('');
    const {speak, voices} = useSpeechSynthesis();

    const voice = voices.find(voice => voice.lang.startsWith('en')); // This selects the first English voice. Adjust as necessary.

    const handleOnClick = () => {
      if (voice) {
        speak({ text: Question, voice : voices[6] });
      } else {
        speak({ text: text }); // Fallback to default voice
      }
      }
    
    // useEffect(() =>{
    //   const fetchData = async () => {
    //     try {
    //       const questionParam = "DESCRIBE A SITUATION WHERE YOU HAD TO MEET A TIGHT DEADLINE. WHAT STEPS DID YOU TAKE TO ENSURE THE TASK WAS COMPLETED, AND WHAT WAS THE OUTCOME";
    //       const answerParam = "WELL, THERE WAS THIS PROJECT AT MY PREVIOUS JOB WHERE WE HAD A REALLY TIGHT DEADLINE. I KIND OF PROCRASTINATED A BIT AND REALIZED I WAS RUNNING OUT OF TIME. SO, I STAYED UP ALL NIGHT BEFORE THE DEADLINE AND FINISHED THE WORK. I DIDN'T REALLY COMMUNICATE MUCH WITH THE TEAM BECAUSE I WANTED TO FOCUS ON GETTING IT DONE QUICKLY. IN THE END, I SUBMITTED IT JUST IN TIME. I THINK THE OUTCOME WAS FINE; THE PROJECT GOT DONE, BUT I WAS REALLY TIRED FOR A FEW DAYS AFTERWARD";
    //       const response = await axios.get(`http://localhost:8000/star/generate?question=${encodeURIComponent(questionParam)}&answer=${encodeURIComponent(answerParam)}`, {withCredientials: true});
    //       console.log('Response data:', response.data);
    //       setText(response.data.Question)
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   };
    //   fetchData();
    // }, [])

    return(
    <div>
      <a className= "cursor-pointer"onClick={handleOnClick}>
        <img className="w-6" src={sound} alt="Image" />
       </a>
     </div>
    )
}

export default TextToSpeech;