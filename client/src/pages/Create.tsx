import { Link, Navigate } from "react-router-dom"
import { isLogin } from "../utils/auth"
import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link 
          to={'/post'} 
          className="group inline-flex items-center gap-2 mb-8 text-slate-600 font-medium transition-all duration-300 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Posts</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
              <input
                type="text"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Content</label>
              <textarea
                placeholder="Write your story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 focus:bg-white h-48 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create