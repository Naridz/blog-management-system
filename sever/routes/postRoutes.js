const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, postController.createPost);
router.get("/", authMiddleware , postController.getAllPosts);
router.get('/search/q', authMiddleware, postController.searchPosts);
router.get("/:id", authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;