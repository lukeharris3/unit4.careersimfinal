const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { createPost, getAllPosts, updatePost, getPostById } = require("../db");

postsRouter.get("/", async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(post => post.active || (req.user && post.author.id === req.user.id));
    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content = "", tags = "" } = req.body;
  const postData = { authorId: req.user.id, title, content, tags: tags.trim().split(/\s+/) };

  try {
    const post = await createPost(postData);
    res.send(post);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;
  const updateFields = { title, content, tags: tags.trim().split(/\s+/) };

  try {
    const originalPost = await getPostById(postId);
    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({ name: "UnauthorizedUserError", message: "You cannot update a post that is not yours" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);

    if (post && post.author.id === req.user.id) {
      await updatePost(postId, { active: false });
      res.send({ message: 'Post successfully deleted' });
    } else {
      next({ name: "UnauthorizedUserError", message: "You cannot delete a post that is not yours" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;