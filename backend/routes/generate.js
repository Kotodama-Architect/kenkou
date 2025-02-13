const express = require('express');
const { tweetsContainer } = require('../config/cosmosConfig');
const { generateArticle } = require('../services/openaiService');

const router = express.Router();

// 🔹 `POST /generate-from-question` - ユーザーの質問を元に記事を生成
router.post('/from-question', async (req, res) => {
    try {
        const userQuestion = req.body.question || "";

        const querySpec = {
            query: "SELECT * FROM c WHERE CONTAINS(c.text, @keyword)",
            parameters: [{ name: "@keyword", value: userQuestion }]
        };

        const { resources: relatedTweets } = await tweetsContainer.items.query(querySpec).fetchAll();

        if (!relatedTweets || relatedTweets.length === 0) {
            return res.status(400).json({ error: "No related tweets found in database" });
        }

        const tweetTexts = relatedTweets.map(tweet => `- ${tweet.text}`).join("\n");

        const prompt = `【ユーザーの質問】\n${userQuestion}\n\n【関連ツイート】\n${tweetTexts}\n\n【記事のフォーマット】\n# 記事タイトル\n\n## 見出し1\n本文...\n\n## 見出し2\n本文...\n\n## まとめ\n本文...`;

        const article = await generateArticle(prompt);

        res.json({ article });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate article" });
    }
});

module.exports = router;