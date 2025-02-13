const express = require('express');
const { tweetsContainer } = require('../config/cosmosConfig');
const { generateEmbedding } = require('../services/openaiService');

const router = express.Router();

// 🔹 `GET /tweets` - CosmosDB からツイートデータを取得
router.get('/', async (req, res) => {
    try {
        const { resources: tweets } = await tweetsContainer.items.readAll().fetchAll();
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tweets" });
    }
});

// 🔹 `POST /tweets/add-batch` - `tweets` をバッチで追加
router.post('/add-batch', async (req, res) => {
    try {
        const tweets = req.body.tweets || [];

        for (let tweet of tweets) {
            tweet.embedding = await generateEmbedding(tweet.text);
        }

        const batchId = `batch_${Date.now()}`;
        const newBatch = { id: batchId, tweets, created_at: new Date().toISOString() };

        await tweetsContainer.items.create(newBatch);
        res.json({ message: "Batch added successfully", batch: newBatch });
    } catch (error) {
        res.status(500).json({ error: "Failed to add batch" });
    }
});

module.exports = router;