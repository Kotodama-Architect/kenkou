const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// CosmosDB の接続情報
const client = new CosmosClient({ endpoint: process.env.COSMOSDB_ENDPOINT, key: process.env.COSMOSDB_KEY });
const container = client.database(process.env.DATABASE_ID).container(process.env.CONTAINER_ID);

// 記事を取得するAPI
app.get('/tweets', async (req, res) => {
    try {
        const { resources } = await container.items.readAll().fetchAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});