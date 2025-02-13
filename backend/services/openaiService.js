const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });

    return response.data[0].embedding;
}

async function generateArticle(prompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000
    });

    return response.choices[0].message.content;
}

module.exports = { generateEmbedding, generateArticle };