import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

let mediaRecorder1, mediaRecorder2;
let audioChunks = [];
let videoChunks = [];


function Video({
  vidBlob,
  setBlob,
  question,
  id,
  setIsLoading,
  setIsSubmitted,
}) {
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [audioURL, setAudioURL] = useState("");
  const [emotions, setEmotions] = useState({});
  // let mediaRecorder;
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);

  const stopVideo = () => {
    setPlaying(false);
    const video = document.getElementById("webcam");
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    const startMediaCapture = async () => {
      try {
        console.log("starting capture");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        if (!recording) {
          mediaRecorder.start();
        } else {
          mediaRecorder.stop();
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startMediaCapture();
  }, [recording]);

  //This starts the recording
  const startVideoRecording = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        mediaRecorder1 = new MediaRecorder(stream);
        mediaRecorder1.ondataavailable = (e) => {
          //    setRecordedChunks(e.data);
          videoChunks.push(e.data);
          console.log(e);
        };
        mediaRecorder1.onstop = () => {
          const blob = new Blob(videoChunks, { type: "video/webm" }); //, { type: "audio/webm; codecs=PCM" }
          // const blob2 = new Blob(chunks, { type: "video/webm"});

          console.log(blob);
          //   const url = URL.createObjectURL(blob);
          //   setAudioURL(url);
          // setRecordedChunks([]);
          videoChunks = [];

          let emotions = sendVideo(blob);
          setEmotions(emotions.message);
          console.log(emotions.message);

          setBlob(blob);
        };
        mediaRecorder1.start(1000);
        setRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const startAudioRecording = async () => {
    console.log("started recording");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder2 = new MediaRecorder(stream);
        mediaRecorder2.ondataavailable = (e) => {
          //    setRecordedChunks(e.data);
          audioChunks.push(e.data);
          console.log(e);
        };
        mediaRecorder2.onstop = async () => {
          const blob = new Blob(audioChunks, { type: "audio/webm" }); //, { type: "audio/webm; codecs=PCM" }
          // const blob2 = new Blob(chunks, { type: "video/webm"});

          console.log(blob);
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          // setRecordedChunks([]);
          audioChunks = [];

          let transcript = await sendAudio(blob);
          //   ==console.log(transcript);

          try {
            setIsLoading(true);
            const response = await axios.get(
              `http://localhost:8000/star/generate?question=${question}&answer=${transcript.message}&emotions=${emotions}`
            );
            console.log(response.data);
            setIsLoading(false);
            setIsSubmitted(true);
          } catch (err) {
            console.log(err);
          }
          //   setAnswer(transcript);
          // sendVideo(blob2);

          //sendVideo(blob2);
          // let transcription = await sendAudio(blob);

          // navigate('/loading');
          // try {
          //     const response = await axios.post(`http://localhost:8000/star/generate?question=${question}&answer=${transcript}`);
          //     console.log(response.data);
          //     // navigate('/feedback');
          // } catch (err) {
          //     console.log(err);
          // }
        };
        mediaRecorder2.start(1000);
        setRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const startRecording = () => {
    startAudioRecording();
    startVideoRecording();
  };

  const stopRecording = async () => {
    // if(mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder1.stop();
    mediaRecorder2.stop();
    setRecording(false);
    // navigate('/loading');
    // try {
    //     await axios.post(`http://localhost:8000/questions/generate?title=${inputValue}`);
    //     navigate('/practice');
    // } catch (err) {
    // console.log(err);
    // }
    // }
    // mediaRecorderRef.current.stop();
  };

  //This sends the audio to parse the audio
  const sendAudio = async (blob) => {
    console.log("sending recording");
    const formData = new FormData();
    formData.append("audio", blob);

    try {
      const response = await axios.post(
        `http://localhost:5000/audio-parse?qID=${id}`,
        formData
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error: ", err);
    }
    // axios
    //   .post(`http://localhost:5000/audio-parse?qID=${id}`, formData)
    //   .then((response) => {
    //     console.log(response)
    //     return response
    // })
    //   .catch((err) => {
    //     console.error("Error: ", err);
    //   });
  };

  {
    /* This will download the video Recording*/
  }
  const sendVideo = async (blob) => {
    console.log("in download");
    // const blob2 = new Blob(recordedChunks,{ type: "audio/webm;codecs=opus"});
    // const url = URL.createObjectURL(blob2);
    // setaudioURL(blob2);
    // setRecordedChunks([]);
    // sendAudio(blob2);

    const formData = new FormData();
    formData.append("file", blob);
    try {
      const response = await axios.post(
        `http://localhost:5000/uploadresponse?qID=${id}`,
        formData
      );
      console.log("uploaded");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(`Video upload failed: ${error}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={downloadRecording}>Download</button>
      )}

      <video
        id="webcam"
        ref={videoRef}
        className="w-full transform scale-x-[-1]"
        muted
        autoPlay
        playsInline
      >
        {" "}
      </video>

      <div>
        {/* {playing ? (<button onClick={stopVideo}>Hide</button>) : (
                <button onClick={startVideo}>Show</button>)} */}
      </div>
    </div>
  );
}

export default Video;
