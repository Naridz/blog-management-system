import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";
import { Search, Plus, User, Calendar, ArrowRight } from "lucide-react";

interface PostType {
  id: number;
  title: string;
  content: string;
  username: string;
  created_at: string;
}

const Post = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setAllPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } else {
        setError(data.message || "Failed to load posts");
      }
    } catch (error) {
      setError("Error fetching posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase()) ||
          post.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [search, allPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 w-80 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 ease-out focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 hover:border-slate-300 shadow-sm hover:shadow-md"
            />
          </div>
          <Link
            to={"/create"}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Create Post</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <>
            <p className="text-slate-500 text-sm font-medium mb-6">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-400 text-lg font-medium">No posts found</p>
                  <p className="text-slate-400 text-sm mt-2">Try adjusting your search</p>
                </div>
              ) : (
                filteredPosts.map((post: PostType) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group bg-white rounded-2xl p-6 flex flex-col min-h-[320px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 ease-out hover:-translate-y-1"
                  >
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {post.title}
                    </h2>

                    {/* Content Preview */}
                    <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {post.content}
                    </p>

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                          <User className="w-4 h-4" />
                          <span className="font-medium text-slate-700">{post.username}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-sm opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
