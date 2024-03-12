const axios = require('axios');
require('dotenv').config();

const OpenAI = require("openai") ;

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY});

async function detectAnswerRelevance(question, answer) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: 'Pretend you are an interviewer. Pretend you gave the candidate the behavioral interview question delimited with double quotation marks. Pretend the interviewee responds with the behavioral interview response delimited with triple quotation marks. Grade the behavioral interview response on how relevant the answer is to the question using the following guidelines: 0/30 if the answer is not relevant to the question at all 4/30 if the answer is slightly relevant but does not answer the question 8/30  if the answer is mostly relevant but does not answer the question 12/30 if the answer is relevant but does not answer the question 16/30 if the answer is relevant and somewhat answers the question 20/30 if the answer is relevant and somewhat and articulately answers the question 24/30 if the answer is relevant and mostly answers the question 28/30 if the answer is relevant and mostly and articulately answers the question 30/30 if the answer is relevant and completely answers the question. You may use some discretion with how relevant the answer was to assign points in between the guidelines. Your response should be in this quoted format: "Answered the question: -/30 \n[Feedback on how to improve the professionalism of their response]" \n\n' + '""' + question + '""' + '\n\n' + '"""' + answer + '"""'}],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
    // console.log(completion.choices[0].message.content);
}
  



module.exports = detectAnswerRelevance;