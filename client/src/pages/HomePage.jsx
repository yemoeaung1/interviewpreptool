import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import VideoPage from "../videoPage";

export default function HomePage() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen border-2 border-black">
      <h1 className="text-black rounded-lg text-6xl mb-36"  style={{ fontFamily: 'Libre Franklin'}}> Interview Prep Tool </h1>
      <div className="my-2 flex flex-row gap-2 my-4">
        
      </div>
      <div className="text-center">
        <h2 className="text-black text-3xl inline-block mr-4 w-fit inline-block" style={{ fontFamily: 'Libre Franklin' }}>
          I am interviewing for a position as a
        </h2>
        <InputPosition role={role} setRole={setRole} navigate={navigate}/>
      </div>
    </div>
  );
}

function InputPosition({ role, setRole, navigate }) {
  const [inputValue, setInputValue] = useState(""); // State to track input value

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the input value is not empty before navigating
    if (inputValue.trim() !== "") {
      setRole(inputValue);
      navigate('/loading');
      try {
        await axios.post(`http://localhost:8000/questions/generate?title=${inputValue}`);
        navigate('/practice');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="inline-block">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input
            type="text"
            className="text-center input input-bordered w-full max-w-xs border-2 bg-transparent border-red-100 text-black text-3xl focus:border-green"
            style={{ fontFamily: 'Libre Franklin' }}
            onChange={handleChange}
            placeholder="Enter your role"
          />
          <div>
            <button
              className={`btn btn-ghost text-black w-fit ${
                inputValue.trim() !== "" ? "bg-green-600" : "" // Apply background color if input is not empty
              }`}
              style={{ fontFamily: 'Libre Franklin' }}
              disabled={inputValue.trim() === ""} // Disable button if input is empty
            >
              Enter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
