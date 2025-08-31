import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Edit from "./pages/Edit";
import Create from "./pages/Create";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/post" element={<Post/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/edit/:id" element={<Edit/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/post/:id" element={<PostDetail/>} />
      </Routes>
    </div>
  );
}

export default App;
