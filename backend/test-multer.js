import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/test", upload.single("image"), (req, res) => {
  console.log("Req Body:", req.body);
  console.log("Req File:", req.file);
  res.json({ body: req.body, file: req.file });
});

const server = app.listen(5001, async () => {
  console.log("Test server running on port 5001");
  try {
    const form = new FormData();
    form.append("title", "Test Title");
    form.append("description", "Test Description");

    const res = await axios.post("http://localhost:5001/test", form, {
      headers: form.getHeaders(),
    });

    console.log("Success! Body received:", res.data.body);
  } catch (error) {
    console.error("Failed:", error.message);
  } finally {
    server.close();
  }
});
