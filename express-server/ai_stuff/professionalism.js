const axios = require('axios');
require('dotenv').config();

const OpenAI = require("openai") ;

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY});

async function detectProfessionalismMethod(question, answer) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: 'Pretend you are an interviewer. Pretend you gave the candidate the behavioral interview question delimited with double quotation marks. Pretend the interviewee responds with the behavioral interview response delimited with triple quotation marks. Grade the behavioral interview response based on how professional the response is based on the following rubric: 0/15 if the response contains any swear words or insults 2/15 if the response contains any slang with a negative context 4/15 if the response contains any slang with a neutral context 6/15 if the response contains any slang with a positive context 8/15 if the response contains familiar language, such as referring to the interviewer as dude or man 10/15 if the response doesn’t contain familiar language or slang 12/15 if the response doesn’t contain familiar language or slang and uses professional pronouns, such as sir 14/15 if the response doesn’t contain familiar language or slang and uses professional pronouns, such as sir, and uses generally professional vocabulary 15/15 if the response doesn’t contain familiar language or slang and uses professional pronouns, such as sir, and uses very professional vocabulary. You may use some discretion with how articulate the answer was to assign points in between the rubric. Your response should be in this quoted format: "Professionalism: -/15 \n[Feedback on how to improve the professionalism of their response]" \n\n' + '""' + question + '""' + '\n\n' + '"""' + answer + '"""'}],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
    // console.log(completion.choices[0].message.content);
}
  



module.exports = detectProfessionalismMethod;