const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const OpenAI = require("openai");  // OpenAI の埋め込みモデルを使用

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// 🔹 CosmosDB の接続情報
const client = new CosmosClient({ endpoint: process.env.COSMOSDB_ENDPOINT, key: process.env.COSMOSDB_KEY });
const container = client.database(process.env.DATABASE_ID).container(process.env.CONTAINER_ID);

// 🔹 OpenAI API のクライアント
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 🔹 `GET /tweets` - CosmosDB からツイートデータを取得
app.get('/tweets', async (req, res) => {
    try {
        console.log("🔍 Fetching tweets from CosmosDB...");
        const { resources: tweets } = await container.items.readAll().fetchAll();
        console.log("✅ Tweets fetched:", tweets);

        res.json(tweets);
    } catch (error) {
        console.error("❌ Error fetching tweets:", error);
        res.status(500).json({ error: "Failed to fetch tweets" });
    }
});

// 🔹 `POST /add-tweet` - `tweets` コンテナにデータを追加
app.post('/add-tweet', async (req, res) => {
    try {
        const text = req.body.text || "No content";
        const urls = req.body.urls || [];

        console.log("📝 Generating embedding for:", text);

        // 🔹 OpenAI API を使って埋め込みを生成
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text
        });

        const embedding = embeddingResponse.data[0].embedding;

        console.log("✅ Embedding generated:", embedding.slice(0, 5), "...");

        // 🔹 キーワード抽出（簡易版）
        const keywords = text.match(/\b\w{2,}\b/g).slice(0, 5);  // 2文字以上の単語を抽出

        const newTweet = {
            id: Date.now().toString(),
            text: text,
            urls: urls,
            embedding: embedding,
            keywords: keywords,
            created_at: new Date().toISOString()
        };

        console.log("📝 Adding new tweet:", newTweet);

        const { resource } = await container.items.create(newTweet);

        res.json({ message: "Tweet added successfully", tweet: resource });
    } catch (error) {
        console.error("❌ Error adding tweet:", error);
        res.status(500).json({ error: "Failed to add tweet" });
    }
});

// 🔹 `POST /generate-from-question` - ユーザーの質問を元に `tweets` コンテナのデータを検索し、記事を生成
app.post('/generate-from-question', async (req, res) => {
    try {
        const userQuestion = req.body.question || "";
        console.log("🔍 Searching tweets related to:", userQuestion);

        // 🔹 OpenAI API を使って質問の埋め込みを生成
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: userQuestion
        });

        const questionEmbedding = embeddingResponse.data[0].embedding;

        console.log("✅ Question embedding generated:", questionEmbedding.slice(0, 5), "...");

        // 🔹 CosmosDB から類似ツイートを検索
        const querySpec = {
            query: "SELECT * FROM c WHERE ARRAY_CONTAINS(c.embedding, @questionEmbedding, true)",
            parameters: [{ name: "@questionEmbedding", value: questionEmbedding }]
        };

        const { resources: relatedTweets } = await container.items.query(querySpec).fetchAll();

        console.log("✅ Related tweets found:", relatedTweets);

        if (!relatedTweets || relatedTweets.length === 0) {
            console.error("❌ No related tweets found.");
            return res.status(400).json({ error: "No related tweets found in database" });
        }

        // 🔹 ツイートの内容を整形
        const tweetTexts = relatedTweets.map(tweet => `- ${tweet.text}`).join("\n");

        console.log("📝 Constructed prompt:", tweetTexts);

        // 🔹 OpenAI API にリクエストを送信
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "あなたはプロのライターです。以下のツイートを元に、4000文字程度の記事を作成してください。" },
                    { role: "user", content: `【ユーザーの質問】\n${userQuestion}\n\n【関連ツイート】\n${tweetTexts}\n\n【記事の要件】\n- ユーザーが読みやすいように、適切な見出しをつける\n- ツイートの内容を元に、追加の情報を補足する\n- 文章の流れが自然になるように構成する\n- 読者が興味を持つようなタイトルをつける\n\n【記事のフォーマット】\n# 記事タイトル\n\n## 見出し1\n本文...\n\n## 見出し2\n本文...\n\n## まとめ\n本文...` }
                ],
                max_tokens: 4000
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        console.log("✅ Article generated:", response.data.choices[0].message.content);

        res.json({ article: response.data.choices[0].message.content });
    } catch (error) {
        console.error("❌ Error generating article:", error.response ? error.response.data : error);
        res.status(500).json({ error: "Failed to generate article" });
    }
});

// 🔹 サーバーを起動
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});