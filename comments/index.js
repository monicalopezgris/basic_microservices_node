const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PostsWithComments = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(PostsWithComments[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = PostsWithComments[req.params.id] || [];
  comments.push({ id: commentId, content });
  PostsWithComments[req.params.id] = comments;

  await axios.post("http://localhost:4006/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Event received", req.body.type);
  res.send({})
});

app.listen(4001, () => {
  console.log("listening on 4001");
});
