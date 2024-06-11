const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/", async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.send({ tags });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  let { tagName } = req.params;
  tagName = decodeURIComponent(tagName);

  try {
    const allPosts = await getPostsByTagName(tagName);
    const posts = allPosts.filter(post => post.active || (req.user && req.user.id === post.author.id));
    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;