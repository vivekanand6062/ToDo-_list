import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [name, setName] = useState("");
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  axios.defaults.baseURL = "https://todo-list-77ma.onrender.com"; // 
  axios.defaults.withCredentials = true;

  // Functions ko useCallback mein wrap kiya taaki useEffect warning na de
  const fetchTasks = useCallback(() => {
    axios
      .get("https://todo-list-77ma.onrender.com/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://todo-list-77ma.onrender.com/verify")
      .then((res) => {
        if (res.data.status === "Success") {
          setName(res.data.name);
          fetchTasks();
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate, fetchTasks]); // Dependency array fixed

  const handleAdd = () => {
    if(!task) return alert("Kuch likho!");
    // Check karo ki ye teeno fields yahan se ja rahi hain
    axios.post('https://todo-list-77ma.onrender.com/add', { task, category, dueDate })
    .then(() => {
        setTask('');
        fetchTasks();
    })
    .catch(err => console.log(err));
}

  // ERROR FIXED: handleEdit aur handleDelete define kiye
  const handleEdit = (id) => {
    axios.put('https://todo-list-77ma.onrender.com/update/' + id)
    .then(result => {
        console.log("Status Updated:", result.data);
        // Sabse zaroori: fetchTasks() ko dobara call karo
        fetchTasks(); 
    })
    .catch(err => console.log(err));
  }

  const handleDelete = (id) => {
    axios
      .delete("https://todo-list-77ma.onrender.com/delete/" + id)
      .then(() => fetchTasks())
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    axios
      .post("https://todo-list-77ma.onrender.com/logout")
      .then((res) => {
        if (res.data.status === "Success") navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  // Searching aur Filtering Logic
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.task
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Status check logic
    if (filterStatus === "Done") {
      return matchesSearch && todo.done === true; // Sirf wo jinka checkbox tick hai
    }
    if (filterStatus === "Pending") {
      return matchesSearch && todo.done === false; // Sirf wo jo baaki hain
    }
    return matchesSearch; // 'All' ke liye sab dikhao
  });

  console.log("Current Filter:", filterStatus, "Total Todos:", todos);

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Hi , </h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div
        className="input-group"
        style={{ flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          value={task}
          className="task-input"
          style={{ width: "100%", borderRadius: "8px" }}
          placeholder="Add a new task..."
          onChange={(e) => setTask(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="task-input"
            style={{ width: "50%", borderRadius: "8px" }}
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          <input
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            className="task-input"
            style={{ width: "50%", borderRadius: "8px" }}
          />
        </div>
        <button
          onClick={handleAdd}
          className="add-btn"
          style={{ width: "100%", borderRadius: "8px", marginLeft: "0" }}
        >
          Add Smart Task
        </button>
      </div>

      <div className="filter-group">
        <button
          onClick={() => setFilterStatus("All")}
          style={{ background: filterStatus === "All" ? "#3498db" : "#ccc" }}
          className="filter-btn"
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("Pending")}
          style={{
            background: filterStatus === "Pending" ? "#3498db" : "#ccc",
          }}
          className="filter-btn"
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("Done")}
          style={{ background: filterStatus === "Done" ? "#3498db" : "#ccc" }}
          className="filter-btn"
        >
          Done
        </button>
      </div>

      <div className="task-list">
        {filteredTodos.map((todo) => (
          <div key={todo._id} className="task-card">
            <div className="task-info">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleEdit(todo._id)}
                className="task-checkbox"
              />
              <div
                className="task-details"
                onClick={() => handleEdit(todo._id)}
              >
                <span className={todo.done ? "text-done" : "task-text"}>
                  {todo.task}
                </span>
                <div className="task-meta">
                  <span className="category-tag">{todo.category}</span>
                  {todo.dueDate && (
                    <span className="date-text">📅 {todo.dueDate}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(todo._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;


//  https://todo-list-77ma.onrender.com