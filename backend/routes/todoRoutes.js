const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });  // 401 : Unauthorized access

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Granted" });
    req.user = user;
    next();
  });
};

// create a todo
router.post("/addtodo", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  qry = "INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)";
  try {
    const [result] = await db.execute(qry, [req.user.id, title, description]);
    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all todos from table
router.get("/getalltodos", async (req, res) => {
  try {
    const [tasks] = await db.execute("SELECT * FROM tasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====> Get all todos related to a user ID
router.get("/gettodosbyuid/:user_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    const [tasks] = await db.execute("SELECT * FROM tasks WHERE user_id = ?", [
      user_id,
    ]);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update task
router.put("/updatetodo:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await db.execute(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description, id, req.user.id]
    );
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
router.delete("/deletetodo:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
