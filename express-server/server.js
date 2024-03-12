const express = require('express');
const app = express();
const port = 8000;
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
// const apiKey = process.env.GPT_API_KEY;
// const apiUrl = 'https://api.openai.com/v1/completions';
const detectStarMethod = require("./ai_stuff/optimal.js")
const detectAnswerRelevance = require("./ai_stuff/relevance.js")
const detectAnswerProfessionalism = require("./ai_stuff/professionalism.js")
const {finalFeedbackMethod, findScores} = require("./ai_stuff/final_feedback.js")
const generate_questions = require("./ai_stuff/generate_qs.js")

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH'],
    credentials: true,
  }))

app.listen(port, () => { console.log(`App listening on port ${port}`) });

let mongoose = require('mongoose');
const dataURL = process.env.ATLAS_URI;

const Questions = require('./models/questions');
// const questions = require('./models/questions');
const Feedback = require('./models/feedback');

mongoose.connect(dataURL, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB' + error);
    });

process.on('SIGINT', async () => {
    try{
      await mongoose.connection.close(); 
      console.log('Server closed. Database instance disconnected');
      process.exit(0);
    }   
    catch(error){
      console.error('Error closing the database connection:', error);
      process.exit(1);
    }   
    
})

app.get('/suer', (req, res) => {
    res.send("HI");
});

app.get('/star', (req, res) => {
    res.send('Please provide your text as a query parameter, e.g., /star?text=YourTextHere');
  });
  
app.get('/star/generate', async (req, res) => {
try {
    await Feedback.findOneAndDelete();

    const interviewQuestion = req.query.question;
    const userAnswer = req.query.answer;
    const userEmotions = req.query.emotions;

    console.log(interviewQuestion)
    console.log(userAnswer);
    console.log(userEmotions['happy'])
    
    if (!interviewQuestion || !userAnswer) {
    return res.status(400).json({ error: 'Question and answer parameter is required.' });
    }

    const star = await detectStarMethod(interviewQuestion, userAnswer);
    const relevance = await detectAnswerRelevance(interviewQuestion, userAnswer);
    const professionalism = await detectAnswerProfessionalism(interviewQuestion, userAnswer);
    const feedback = star + relevance + professionalism
    const scores = await findScores(feedback)
    const final_feedback = await finalFeedbackMethod(interviewQuestion, userAnswer, feedback);

    const jsonResponse = new Feedback({
        "Question": interviewQuestion,
        "Answer": userAnswer,
        "STAR": star,
        "Relevance": relevance,
        "Professionalism": professionalism,
        "Total_Feedback": feedback,
        "Scores": scores,
        "Result": final_feedback
      });  

    await jsonResponse.save();

    // res.send(`<pre>${jsonResponse}</pre>`);
    return res.status(200).json(jsonResponse);
    
} catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
}
});

app.post('/questions/generate', async (req, res) => {
    try {
        const job_title = req.query.title;
        let questions = [] 
        questions = await generate_questions(job_title)
                    .then(questions => {
                    return questions;
                    })
                    .catch(error => {
                    console.error('Error:', error.message);
                    });
        
      
        if(questions !== null && questions !== undefined && Array.isArray(questions)){
            for(let i = 0; i < questions.length; i++){
                await Questions.create({
                    text: questions[i],
                });
            }
        }

        const jsonResponse = JSON.stringify({
            "Questions": questions
        }, null, 2);
        
        for (const element of questions) {
            console.log(element);
        }

        res.send(`<pre>${jsonResponse}</pre>`);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

app.post('/questions/clear', async (req, res) => {
    try{
        await Questions.deleteMany({});
        res.send("Success");
    } catch (error) {
        res.error(error);
    }
})

app.get('/questions/retrieve', async (req, res) => {
    try{
        const questions = [];
        const quantity = req.query.quantity;
        for(let i = 0; i < quantity; i++){
            const question = await Questions.findOneAndDelete();
            if(question === undefined || question === null)
                break;
            questions.push(question);
        }
        res.send(questions);
    }
    catch(error){
        console.error("Internal Error");
    }
});


app.get('/add-answer', async (req, res) => {
    const { qID, answer } = req.query;

  // Check if qID and answer are provided
  if (!qID || !answer) {
    return res.status(400).json({ message: 'Both qID and answer parameters are required' });
  }

  try {
    // Update the question document with the provided answer
    const updatedQuestion = await Questions.findByIdAndUpdate(
      qID,
      { "answer": answer }
    );

    // Check if the question was found and updated
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Respond with the updated question
    return res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }



  
  
})

app.get('/feedback', async (req, res) => {
    try{
        let feedback = await Feedback.findOne();
        res.send(feedback);
    } catch (error) {
        console.error("Internal Error");
    }
})
