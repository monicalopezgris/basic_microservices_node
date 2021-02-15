const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const handleEvent = (data, type) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  await handleEvent(data, type);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening 4002 - Query service");
  const res = await axios
    .get("http://localhost:4005/events")
    .catch((error) => {});
  for (let event in res) {
    try {
      await handleEvent(event.data, event.type);
    } catch (error) {
      console.log("asasasassssaas", error);
    }
  }
});
