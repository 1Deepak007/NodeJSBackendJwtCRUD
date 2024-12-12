const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

const verifyToken = (req, res, next) => {
  console.log("jwt", process.env.JWT_SECRET);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" }); // 401 : Unauthorized access

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Access Denied" });
    }
    req.user = user;
    next();
  });
};

// Add a todo
router.post("/addtodo", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  const status = "pending";
  const qry =
    "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)";
  try {
    const [result] = await db.execute(qry, [
      req.user.id,
      title,
      description,
      status,
    ]);
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
// testing postman
// get : http://localhost:3746/api/todo/gettodosbyuid/4
// Headers :
//      key : Authorization
//      value : jwt tokn here e.g ->   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyb290QGdtYWlsLmNvbSIsImlhdCI6MTczMzk5MTk4NiwiZXhwIjoxNzMzOTk5MTg2fQ.6-ybolV49QBIZJ9xbQ3VMvjKyo7oAK-EmmaESwbeVKE
router.get(
  "/gettodosbyuid/:user_id",
  // verifyToken,
  async (req, res) => {
    try {
      const { user_id } = req.params;

      const [tasks] = await db.execute(
        "SELECT * FROM tasks WHERE user_id = ?",
        [user_id]
      );

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// update task
// test code at put: http://localhost:3746/api/todo/updatetodo/3         3 todo id      - userid extracted from jwt token
// payload : {  "title": "gym at morning 7",
//   "description": "go to gum at 7 in the morning",
//   "status": "completed" }
router.put("/updatetodo/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  console.log("Request body:", req.body);
  console.log("Updating task with values:", {
    title,
    description,
    status,
    id,
    userId: req.user.id,
  });

  try {
    const [task] = await db.execute(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (task.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or does not belong to user" });
    }

    const [result] = await db.execute(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, status, id, req.user.id]
    );
    console.log("Update result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No task was updated" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
// http://localhost:3746/api/todo/deletetodo/3            3 taskid
router.delete("/deletetodo/:id", verifyToken, async (req, res) => {
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
