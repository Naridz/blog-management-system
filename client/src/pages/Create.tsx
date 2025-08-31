import { Link, Navigate } from "react-router-dom"
import { isLogin } from "../utils/auth"
import { useState } from "react";

const Create = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    if (!isLogin()) {
		return <Navigate to="/login" replace />;
	}

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all inputs");
      setSuccess("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        setSuccess("Post Created Successfully!");
        setError("");
        setTitle("");
        setContent("");
      } else {
        setError(data.message || "Failed to create post.");
        setSuccess("");
      }
    } catch (err) {
      console.log(err)
    }
  };
  return (
    <div className="container mx-auto p-8">
        <Link to={'/post'} className="inline-block mb-6 px-4 py-3 rounded-full font-medium transition cursor-pointer bg-slate-800 text-white hover:bg-slate-700">
        ← Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-600 text-white py-2 px-4 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-600 text-white py-2 px-4 rounded mb-4">{success}</div>
        )}

        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4"
        />

        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded py-2 px-3 h-40 mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Create
        </button>
      </form>
    </div>
  )
}

export default Create