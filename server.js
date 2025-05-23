// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { history } = req.body;

  const messages = [
    {
      role: "system",
      content:
        "あなたはユーザーに料理をおすすめするアシスタントです。ユーザーが「はい」「いいえ」で答えられるような質問を1つずつしながら、最終的に50種類以上の中から料理を1つ提案してください。最後には『おすすめ料理は〇〇です』と答えてください。",
    },
    ...history,
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
    });

    const reply = response.data.choices[0].message;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI APIエラー" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
