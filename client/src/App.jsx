import "./App.css";
import FeedbackPage from "./feedbackPage";
import HomePage from "./pages/HomePage";
import VideoPage from "./videoPage";
import TextToSpeech from "./textToSpeech";
import axios from "axios";
import Model from "./threeDmodel";
import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import LoadingPage from "./pages/loadingPage";
import React, {useState, useEffect} from 'react';

function App() {
  // axios.defaults.withCredentials = true
  const [vidBlob, setBlob] = useState(null);
  useEffect(() => {
    
  }, []);

  return (
    <div className="bg-gradient-to-tr from-yellow-300 to-green-600">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice" element={<VideoPage vidBlob={vidBlob} setBlob={setBlob}/>} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/feedback" element={<FeedbackPage vidBlob={vidBlob} setBlob={setBlob}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
