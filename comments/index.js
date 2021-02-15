const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PostsWithComments = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(PostsWithComments[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const commentToPush = {
    id: commentId,
    content,
    status: "pending",
  };
  const comments = PostsWithComments[req.params.id] || [];

  comments.push(commentToPush);

  PostsWithComments[req.params.id] = comments;

  commentToPush.postId = req.params.id;
  
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: commentToPush,
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log('Event Received:', req.body.type);

  if (type === "CommentModerated") {
    const { postId, status, id, content } = data;
    const comments = PostsWithComments[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("listening on 4001 - Comments service");
});
