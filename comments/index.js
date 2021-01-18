const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PostsWithComments = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(PostsWithComments[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = PostsWithComments[req.params.id] || [];
  comments.push({ id: commentId, content });
  PostsWithComments[req.params.id] = comments;
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("listening on 4001");
});
