import qna from "@tensorflow-models/qna";
import express from "express";
import "@tensorflow/tfjs-backend-cpu";
import cors from "cors";
import "dotenv/config";

let model;
qna.load().then((m) => (model = m));

const app = express();

app.use(cors());
app.use(express.json({ type: "*/*", limit: "10kb" }));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(
    `Tensorflow NLP question and answer API:\n\nCreated by @Explosion-Scratch, hosted by @Jeffalo.\n\nUsage:\n\tPOST\t/answer\t\tSet "query" and "text" to search text for query using NLP.`
  );
});

app.get("/answer", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(404);
  res.send("This route only accepts POST requests (See / for details)");
});

app.post("/answer", async (req, res) => {
  if (!model) {
    res.status(500);
    return res.json({ error: true, message: "Model not loaded yet" });
  }
  if (
    !(
      req.body.text &&
      req.body.query &&
      typeof req.body.text === "string" &&
      typeof req.body.query === "string"
    )
  ) {
    res.status(400);
    return res.json({
      error: true,
      code: "QUERY_AND_TEXT_REQUIRED",
    });
  }
  res.status(200);
  return res.json({
    error: false,
    answers: await model.findAnswers(req.body.query, req.body.text),
  });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Tensorflow NLP API running on port ${PORT}`);
});

export default app;