const axios = require('axios');
require('dotenv').config();

const OpenAI = require("openai") ;

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY});

async function finalFeedbackMethod(question, answer, feedback) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: 'Pretend you are an interviewer. Pretend you gave the candidate the behavioral interview question delimited with double quotation marks. Pretend the interviewee responds with the behavioral interview response delimited with triple quotation marks. Pretend your feedback for the response is delimited with quadruple quotation marks. Summarize the feedback and pretend you are talking to the interviewee and trying to help them improve their response. \n\n' + '""' + question + '""' + '\n\n' + '"""' + answer + '"""' + '\n\n' + '""""' + feedback + '""""'}],

        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
    // console.log(completion.choices[0].message.content);
}

async function findScores(feedback) {
    const regex = /(\b(?:Situation|Task|Action|Result|Answered the question|Professionalism): (\d+\/\d+))/g;
    const matches = feedback.match(regex);

    if (!matches) {
        return null;
    }

    const scores = {};
    let totalScore = 0;
    let maximumScore = 0;

    matches.forEach(match => {
        const [key, value] = match.split(': ');
        scores[key.trim()] = value.trim();
        const [currentScore, maxScore] = value.split('/').map(Number);
        totalScore += currentScore;
        maximumScore += maxScore;
    });

    scores['Total_Score'] = `${totalScore}/${maximumScore}`;

    return scores;
}
  
console.log(findScores("\"Situation: 10/10 \nTask: 5/5 \nAction: 19/20 \nResult: 5/5 \n\nOverall, your response was well-structured and detailed. You effectively conveyed the challenging situation you faced, the task at hand, the actions you took to address the challenges, and the positive results that were achieved. To improve the professionalism of your response, consider using more concise language and avoiding unnecessary repetition. Additionally, focusing on quantifiable outcomes or specific metrics to measure success could further enhance your response.\"Answered the question: 30/30 \nThe candidate provided a detailed and relevant response to the question about facing a challenging scenario. They described a specific situation from their past and discussed the challenges they encountered, the actions they took to overcome them, and the positive outcome of their efforts. Additionally, they reflected on the experience and highlighted the lessons they learned, showing growth and self-awareness. This response effectively addresses the question and demonstrates the candidate's ability to handle difficult situations.Professionalism: 15/15 This response is incredibly professional, using articulate language and demonstrating a high level of professionalism throughout. The candidate effectively describes a challenging scenario they faced, detailing the difficulties encountered and the actions taken to overcome them. They also reflect on the experience and highlight the lessons learned, showcasing their growth and dedication to their field. Well done!"))

module.exports = {findScores, finalFeedbackMethod};