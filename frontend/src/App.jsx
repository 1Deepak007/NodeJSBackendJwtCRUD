import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import TodoList from "./components/Todos/TodoList";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          {token ? (
            <Route path="/todos" element={<TodoList />} />
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
