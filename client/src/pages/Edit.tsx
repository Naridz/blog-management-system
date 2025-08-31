import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  email: string;
  exp: number;
};

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const decoded: DecodedToken = jwtDecode(token!);
  const currentUserId = decoded.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.status === "ok") {
          const post = data.post;
          if (currentUserId !== post.author_id) {
            alert("You are not authorized to edit this post.");
            navigate("/post");
            return;
          }
          setTitle(post.title);
          setContent(post.content);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        setError("Error loading post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post updated successfully!");
        navigate(`/post/${id}`);
      } else {
        setError(data.message || "Failed to update post.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  return (
    <div className="container mx-auto">
      <div className=" flex-grow">
        <div className="container mx-auto shadow-xl my-10 p-8 rounded-xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-block mb-6 px-4 py-3 rounded-full font-medium transition cursor-pointer bg-slate-800 text-white hover:bg-slate-700"
          >
            ← Back
          </button>
          <hr className="my-3" />
          <h3 className="text-xl">Edit post</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2 h-40"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 text-white border py-2 px-5 mt-2 rounded-md text-lg"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
