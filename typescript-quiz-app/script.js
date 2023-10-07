import { config } from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const { Configuration, OpenAIAPi } = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.post("/chat", async (req, res) => {
  console.log(req + " HERE IS THE REQ");
  const { prompt } = req.body;
  const instructions =
    "Keep it short, Generate three incorrect answers for following question: ";

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate four concise distractors, separate by letter and period",
      },
      { role: "user", content: "Answer: " + prompt },
    ],
    temperature: 0.2,
    max_tokens: 100,
  });

  res.send(completion["choices"][0]["message"]["content"]);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
