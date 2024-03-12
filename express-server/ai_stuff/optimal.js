const axios = require('axios');
require('dotenv').config();

const OpenAI = require("openai") ;

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY});

async function detectStarMethod(question, answer) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: 'Pretend you are an interviewer. Pretend you gave the candidate the behavioral interview question delimited with double quotation marks. Grade the behavioral interview response delimited with triple quotation marks using the following rubric: \n\n Situation: 0/10 if the answer provides no details of the situation. 2/10 if the answer fully details one of the following: who, what, where, and when. 4/10 if the answer fully details two of the following: who, what, where, and when. 6/10 if the answer fully details three of the following: who, what, where, and when. 8/10 if the answer fully details all of the following: who, what, where, and when. 10/10 if the answer is articulate and fully details all of the following: who, what, where, and when. \n Task: 0/5 if the answer does not mention what needs to be accomplished in terms of the purpose, challenge, or goal. 1/5 if the answer somewhat describes one of the following: what needed to be done or why this was the goal. 2/5 if the answer somewhat describes both of the following: what needed to be done or why this was the goal. 3/5 if the answer clearly describes one of the following: what needed to be done or why this was the goal. 4/5 if the answer clearly describes both of the following: what needed to be done or why this was the goal. 5/5 if the answer is articulate and clearly describes both of the following: what needed to be done or why this was the goal. \n Action: 0/20 if the answer does not describe the action taken at all. 3/20 if the answer only partially describes one of the following elements: either what was done or how it was done and uses "we" a lot rather than "I" 5/20 if the answer only fully describes one of the following elements: either what was done or how it was done and uses "we" a lot rather than "I" 7/20 if the answer only fully describes one of the following elements: either what was done or how it was done and uses "we" sometimes 9/20 if the answer only partially describes both of the following elements: either what was done or how it was done and uses "we" sometimes 11/20 if the answer fully describes one of the following elements and partially describes the other: either what was done or how it was done and uses "we" sometimes 13/20 if the answer fully describes both of the following elements: either what was done or how it was done and uses "we" sometimes 15/20 if the answer fully describes both of the following elements: either what was done or how it was done and uses "we" infrequently 17/20 if the answer fully describes both of the following elements: either what was done or how it was done and uses "we" sometimes and highlights the competencies of the interviewee 19/20 if the answer fully describes both of the following elements: either what was done or how it was done and uses "I" only and highlights the competencies of the interviewee 20/20 if the answer fully describes both of the following elements: either what was done or how it was done and uses "I" only and highlights the competencies of the interviewee clearly and articulately \n Result: 0/5 if the answer does not mention the result or outcome 1/5 if the answer does not clearly include the outcome but it is implied 2/5 if the answer does not clearly include the outcome but it is implied but includes one of the following elements: either what was learned or how the competency played into the result 3/5 if the answer includes the outcome and includes one of the following elements: either what was learned or how the competency played into the result. 4/5 if the answer includes the outcome and includes both of the following elements: what was learned or how the competency played into the result. 5/5 if the answer clearly articulates the outcome and includes both of the following elements: what was learned or how the competency played into the result and highlights the interviewees accomplishments and competencies. Your response should be in this exact quoted format: "Situation: -/10 \nTask: -/5 \nAction: -/20 \nResult: -/5 [Feedback on how to improve the professionalism of their response]" \n\n' + '""' + question + '""' + '\n\n' + '"""' + answer + '"""'}],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
    // console.log(completion.choices[0].message.content);
}
  



module.exports = detectStarMethod;