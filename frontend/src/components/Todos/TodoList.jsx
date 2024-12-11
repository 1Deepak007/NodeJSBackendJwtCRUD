import { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTodos = async () => {
    const userid = localStorage.getItem("userId");
    try {
      // /gettodosbyuid/:user_id
      const { data } = await axios.get(
        `http://localhost:5100/api/todo/gettodosbyuid/${userid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/todo/addtodo", newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTodo({ title: "", description: "" });
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Update existing todo
  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/todo/${editingTodo.id}`,
        editingTodo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchTodos();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>

      <div className="flex end-0">
        <button onClick={logout}>Logout</button>
      </div>

      {/* Add or Edit Todo Form */}
      <form
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        className="mb-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Title"
            value={editingTodo ? editingTodo.title : newTodo.title}
            onChange={(e) =>
              editingTodo
                ? setEditingTodo({ ...editingTodo, title: e.target.value })
                : setNewTodo({ ...newTodo, title: e.target.value })
            }
            className="p-2 border rounded flex-grow"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={editingTodo ? editingTodo.description : newTodo.description}
            onChange={(e) =>
              editingTodo
                ? setEditingTodo({
                    ...editingTodo,
                    description: e.target.value,
                  })
                : setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="p-2 border rounded flex-grow"
            required
          />
          <button
            type="submit"
            className={`${
              editingTodo ? "bg-yellow-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded`}
          >
            {editingTodo ? "Update Todo" : "Add Todo"}
          </button>
        </div>
      </form>

      {/* Todo List */}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{todo.title}</h3>
            <p>{todo.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditingTodo(todo)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
