const db = require("../config/db");

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const author_id = req.user.id;

  db.execute(
    "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
    [title, content, author_id],
    (err, result) => {
      if (err) return res.status(500).json({ status: "error", message: err });
      res.json({ status: "ok", message: "Post created" });
    }
  );
};

exports.getAllPosts = (req, res) => {
  db.execute(`
  SELECT posts.*, users.username 
  FROM posts 
  JOIN users ON posts.author_id = users.id 
  ORDER BY posts.created_at DESC
`, [], (err, posts) => {
    if (err) return res.status(500).json({ status: "error", message: err });
    res.json({ status: "ok", posts });
  });
};

exports.getPostById = (req, res) => {
  const { id } = req.params;
  db.execute(`SELECT posts.*, users.username 
  FROM posts 
  JOIN users ON posts.author_id = users.id 
  WHERE posts.id = ?`, [id], (err, posts) => {
    if (err) return res.status(500).json({ status: "error", message: err });
    if (posts.length === 0)
      return res.status(404).json({ status: "error", message: "Post not found" });
    res.json({ status: "ok", post: posts[0] });
  });
};

exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  db.execute(
    "SELECT * FROM posts WHERE id = ? AND author_id = ?",
    [id, userId],
    (err, result) => {
      if (result.length === 0) {
        return res.status(403).json({ message: "Forbidden" });
      }
      db.execute(
        "UPDATE posts SET title = ?, content = ? WHERE id = ?",
        [title, content, id],
        (err, result) => {
          res.json({ message: "Post updated" });
        }
      );
    }
  );
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  db.execute(
    'SELECT * FROM posts WHERE id = ? AND author_id = ?',
    [postId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      if (results.length === 0) {
        return res.status(403).json({ message: 'You are not authorized to delete this post' });
      }

      db.execute('DELETE FROM posts WHERE id = ?', [postId], (err, deleteResult) => {
        if (err) return res.status(500).json({ message: 'Delete Failed', error: err });
        res.json({ message: 'Post deleted successfully' });
      });
    }
  );
};

exports.searchPosts = (req, res) => {
  const keyword = `%${req.query.q || ''}%`;
  db.execute(
    `SELECT posts.*, users.username 
     FROM posts 
     JOIN users ON posts.author_id = users.id 
     WHERE posts.title LIKE ? OR posts.content LIKE ? 
     ORDER BY posts.created_at DESC`,
    [keyword, keyword],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error searching posts', error: err });
      res.json({ posts: results });
    }
  );
};