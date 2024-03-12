import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

let videoBlob;

function FeedbackPage(){
    const [questions, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [scores, setScores] = useState({});
    const [starFB, setStarFB] = useState('');
    const [relFB, setRelFB] = useState('');
    const [profFB, setProfFB] = useState('');
    const [feedback, setFeedback] = useState('');
    const [popupVisibility, setVisibility] = useState(0);
    const navigate = useNavigate();
    // let responseCopy = ''

    useEffect(() =>{
        const fetchData = async () => {
          try {
            // const questionParam = "DESCRIBE A SITUATION WHERE YOU HAD TO MEET A TIGHT DEADLINE. WHAT STEPS DID YOU TAKE TO ENSURE THE TASK WAS COMPLETED, AND WHAT WAS THE OUTCOME";
            // const answerParam = "WELL, THERE WAS THIS PROJECT AT MY PREVIOUS JOB WHERE WE HAD A REALLY TIGHT DEADLINE. I KIND OF PROCRASTINATED A BIT AND REALIZED I WAS RUNNING OUT OF TIME. SO, I STAYED UP ALL NIGHT BEFORE THE DEADLINE AND FINISHED THE WORK. I DIDN'T REALLY COMMUNICATE MUCH WITH THE TEAM BECAUSE I WANTED TO FOCUS ON GETTING IT DONE QUICKLY. IN THE END, I SUBMITTED IT JUST IN TIME. I THINK THE OUTCOME WAS FINE; THE PROJECT GOT DONE, BUT I WAS REALLY TIRED FOR A FEW DAYS AFTERWARD";
            const response = await axios.get('http://localhost:8000/feedback', {withCredentials: true});
            console.log('Response data:', response.data);
            setQuestion(response.data.Question);
            setAnswer(response.data.Answer);
            setScores(response.data.Scores);
            setStarFB(response.data.STAR);
            setRelFB(response.data.Relevance);
            setProfFB(response.data.Professionalism);
            setFeedback(response.data.Result)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, [])

    return (
        <div className="flex min-h-screen">
                {/*Axios.get the questions, the feedback, and answer*/}
                <div className="w-screen bg-blue-200 text-white bg-pulsating-gradient">
                    <div className="flex-grow overflow-auto p-4 space-y-4 font-merienda">
                        <h1 className='text-center text-black font-bold mb-8' style={{ fontFamily: 'Libre Franklin'}}><span className="glow-effect bloom-effect rounded-full m-2">💡</span>Feedback Page<span className="glow-effect bloom-effect rounded-full m-2" style={{ animationDelay: '0.5s', animationDuration: 'infinite' }}>💡</span></h1>
                        <QuestionBox questions={questions}/>
                        <div className="flex items-center justify-center">
                          <VideoBox answer={answer}/>
                          <Report scores={scores} popupVisibility={popupVisibility} setVisibility={setVisibility} starFB={starFB} relFB={relFB} profFB={profFB} feedback={feedback}/>
                        </div>
                        <button onClick={()=>navigate('/practice')}>Next Question</button>
                    </div>
                </div>
        </div>
    )
}

function QuestionBox({questions}){
  return (
    <div className="flex justify-center items-center">
      <div className="bg-glow bg-black border-black border-solid border-2 rounded-3xl justify-center w-3/4 p-4">
        <div className="font-bold text-3xl text-center" style={{ fontFamily: 'Libre Franklin', textDecoration: 'underline' }}>QUESTION</div> 
        <p className="text-lg p-4 pt-0" style={{ fontFamily: 'Libre Franklin, sans-serif'}}><br/>{questions}</p>
      </div>
    </div>
  );
}

function VideoBox({answer}){
  return (
    <div className="bg-white text-center text-blue-900 font-bold w-7/12 m-16 p-4 rounded shadow-lg">
      Your response: {answer}
      {videoBlob && (
        <video controls>
          <source src={URL.createObjectURL(videoBlob)} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

function Report({scores, popupVisibility, setVisibility, starFB, relFB, profFB, feedback}){
  const mouseOver = (e) => {
    e.target.style.fontSize = '24px';
    e.target.style.color = 'red';
  }
  const mouseOut = (e) => {
    e.target.style.fontSize = '20px';
    e.target.style.color = 'black';
  }

  return (
    <div className="bg-white text-center text-blue-900 font-bold w-1/3 h-96 m-16 rounded-lg shadow-xl border-black border-solid border-4">
      <div className="h-96" style={{ position: 'relative' }}>
        {popupVisibility === 0 && <div className="flex items-center justify-center" style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
          <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: '8px 0' }}>
            <p className="text-xl" onClick={() => setVisibility(1)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`Situation: ${scores.Situation}`}</p>
            <p className="text-xl" onClick={() => setVisibility(2)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nTask: ${scores.Task}`}</p>
            <p className="text-xl" onClick={() => setVisibility(3)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nAction: ${scores.Action}`}</p>
            <p className="text-xl" onClick={() => setVisibility(4)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nResult: ${scores.Result}`}</p>
            <p className="text-xl" onClick={() => setVisibility(5)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nRelevance: ${scores['Answered the question']}`}</p>
            <p className="text-xl" onClick={() => setVisibility(6)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nProfessionalism: ${scores.Professionalism}`}</p>
            <p className="text-xl" onClick={() => setVisibility(7)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>{`\nTotal Score: ${scores['Total Score']}`}</p>
          </div>
        </div>}
        {popupVisibility === 1 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>STAR Feedback</p>
          <p className="text-left p-4">{(starFB === '') ? 'No Feedback' : parseFBString(starFB, 4)}</p>
        </div>}
        {popupVisibility === 2 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>STAR Feedback</p>
          <p className="text-left p-4">{(starFB === '') ? 'No Feedback' : parseFBString(starFB, 4)}</p>
        </div>}
        {popupVisibility === 3 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>STAR Feedback</p>
          <p className="text-left p-4">{(starFB === '') ? 'No Feedback' : parseFBString(starFB, 4)}</p>
        </div>}
        {popupVisibility === 4 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>STAR Feedback</p>
          <p className="text-left p-4">{(starFB === '') ? 'No Feedback' : parseFBString(starFB, 4)}</p>
        </div>}
        {popupVisibility === 5 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>Relevance</p>
          <p className="text-left p-4">{(relFB === '') ? 'No Feedback' : parseFBString(relFB, 1)}</p>
        </div>}
        {popupVisibility === 6 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>Professionalism</p>
          <p className="text-left p-4">{(profFB === '') ? 'No Feedback' : parseFBString(profFB, 1)}</p>
        </div>}
        {popupVisibility === 7 && <div className="overflow-y-auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <XButton changeFcn={() => setVisibility(0)}/>
          <p className="text-xl" style={{ textDecoration: 'underline' }}>Overall Feedback</p>
          <p className="text-left p-4">{feedback}</p>
        </div>}
      </div>
      <p className="p-8 text-2xl text-grey">Click Scores for Feedback!</p>
    </div>
  );
}

function XButton(props){
  return (
    <button onClick={() => {props.changeFcn()}} className="bg-red-500 hover:bg-red-600 text-white font-bold py-0 px-6 m-2 rounded inline-flex items-center border-black border-solid border-2">
      Exit
    </button>
  );
}

function parseFBString(str, num){
  let newStr = str;
  // for(let i = 0; i < num; i++){
  //   let j = 0;
  //   while(newStr[j] !== '\n'){
  //     j++;
  //   }
  //   newStr = newStr.substring(j + 1);
  // }

  return newStr;
}

export default FeedbackPage;