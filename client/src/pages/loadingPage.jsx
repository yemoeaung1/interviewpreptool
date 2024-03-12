import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoadingPage() {
  const loadingMessages = [
    'Remember to smile!',
    'Believe in yourself!',
    'You got this!',
    'On your way to success...',
  ];

  // State to manage the currently displayed loading message
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  // Effect to change the loading message periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Rotate through loading messages
      const nextIndex = (loadingMessages.indexOf(currentMessage) + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[nextIndex]);
    }, 4000); // Change message every 4 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentMessage, loadingMessages]);

// Generate a dynamic gradient color based on the current time
const dynamicGradient = `linear-gradient(to right, 
    #ff6b6b 0%,   
    #ffcc00 100%)`; // Dodger Blue or a shade of blue
  
return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ background: dynamicGradient, animation: 'fadeInOut 4s infinite' }}>
      <span className="loading loading-dots loading-lg text-accent w-20 mb-4"></span>
      <p style={{ fontSize: '2rem', fontFamily: 'Libre Franklin', color: 'white' }}>{currentMessage}</p>
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 1; }
          25%, 75% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LoadingPage;
