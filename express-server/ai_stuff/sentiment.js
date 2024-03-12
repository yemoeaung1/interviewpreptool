require('dotenv').config();

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY });

const axios = require('axios');

async function retrieveSentiment(text){
    try {
        const prompt = `This is a sentiment analysis task. Analyze the sentiment of the following in 1 word:\n"${text}"`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            stop: '\n'
        });

        return completion.choices[0];
    } catch (error) {
        return error;
    }
}

async function retrieveRating(text){
    
    try {
        const prompt = `Rate the interview appropriateness of the following text out of 5 (Explain if < 4):\n"${text}"`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 10,
            stop: '\n'
        });

        return completion.choices[0];
    } catch (error) {
        return error;
    }
}

async function retrieveSentimentFeedback(text){
    let sentiment = await retrieveSentiment(text);
    let rating = await retrieveRating(text);
    return {Sentiment: sentiment, Rating: rating};
}

function presetResponse(sentiment){
    switch(sentiment){
        case 'positive': break;
        case 'negative': break;
        case '': break;
        case '': break;
        case '': break;
    }
}

retrieveSentimentFeedback("In a project, we faced unexpected technical issues. We reorganized tasks, used team strengths, and communicated openly. This helped us overcome challenges and deliver on time, teaching me about adaptability, teamwork, and communication.")
    .then((value) => {
        console.log("Sentiment: " + value.Sentiment.message.content.toLowerCase());
        console.log("Rating: " + value.Rating.message.content.toLowerCase());
    })
    .catch((error) => {
        console.log("Error: " + error);
    });