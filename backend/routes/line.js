const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const router = express.Router();

const lineClient = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// 🔹 `POST /line/webhook` - LINE からのメッセージを受け取る
router.post('/webhook', async (req, res) => {
    const events = req.body.events;

    for (let event of events) {
        if (event.type === "message" && event.message.type === "text") {
            const userMessage = event.message.text;

            const response = await axios.post("http://localhost:3000/generate/from-question", {
                question: userMessage
            });

            const article = response.data.article;

            await lineClient.replyMessage(event.replyToken, {
                type: "text",
                text: `📝 記事が完成しました！\n\n${article}`
            });
        }
    }

    res.json({ message: "Webhook processed" });
});

module.exports = router;