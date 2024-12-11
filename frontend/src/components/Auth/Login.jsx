import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit called");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { id, email, token } = response.data;
      console.log(token);
      if (token) {
        // Store user data in localStorage
        localStorage.setItem("userId", id);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("token", token);

        console.log("Login successful. Token:", token);
        navigate("/todos");
      } else {
        console.log("login error");
        throw new Error("Login failed: Invalid token.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to login. Please try again.";
      setError(errorMessage);
      console.error("Login Error:", errorMessage);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/todos");
    }
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="mb-2">Don't have an account?</p>
        <Link
          to="/register"
          className="text-blue-500 hover:text-blue-700 transition duration-200"
        >
          Register now
        </Link>
      </div>
    </div>
  );
};

export default Login;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState(""); // State for error messages
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     // console.log("handle submit called");
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         formData
//       );

//       const { token } = response.data;
//       console.log("Token : ", token);

//       if (token) {
//         localStorage.setItem("token", token);
//         console.log("Login successful. Token:", token);
//         navigate("/todos");
//       } else {
//         throw new Error("Login failed: Invalid token.");
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.message || "Failed to login. Please try again."
//       );
//       console.error("Login Error:", error);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/todos");
//     }
//   }, [navigate]);

//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       {error && (
//         <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="email" className="block mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block mb-2">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//         >
//           Login
//         </button>
//       </form>
//       <div className="text-center mt-4">
//         <p className="mb-2">Don't have an account?</p>
//         <Link
//           to="/register"
//           className="text-blue-500 hover:text-blue-700 transition duration-200"
//         >
//           Register now
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;
