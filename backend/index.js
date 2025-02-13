const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// 🔹 ルートの設定
app.use('/tweets', require('./routes/tweets'));
app.use('/payments', require('./routes/payments'));
app.use('/line', require('./routes/line'));
app.use('/generate', require('./routes/generate'));

// 🔹 サーバーを起動
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});