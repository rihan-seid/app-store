import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { blogService } from "../service/blogService";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [newCommentInput, setNewCommentInput] = useState({});
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const scrollRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bk-appstore.victor-door.com";

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogService.getBlogs();
      const data = Array.isArray(response) ? response : response?.ads || [];

      if (Array.isArray(data)) {
        const processedBlogs = data.map((blog) => ({
          ...blog,
          images:
            blog.images?.map((image) => {
              const cleanedImage = image.replace(/^undefined/, "");
              return image.startsWith("http")
                ? image
                : `${API_BASE_URL}${cleanedImage}`;
            }) || [],
          comments:
            blog.comments?.map((comment) => ({
              ...comment,
              id: comment._id || Date.now() + Math.random(),
            })) || [],
        }));

        const commentsInit = {};
        processedBlogs.forEach((blog) => {
          commentsInit[blog._id] = blog.comments || [];
          setNewCommentInput((prev) => ({ ...prev, [blog._id]: "" }));
        });

        setBlogs(processedBlogs);
        setComments(commentsInit);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!scrollRef.current || blogs.length <= 4) return;

    let scrollInterval;
    let scrollCount = 0;
    const maxScrolls = 2;

    scrollInterval = setInterval(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
      scrollCount++;
      if (scrollCount >= maxScrolls) {
        clearInterval(scrollInterval);
        setAutoScroll(false);
      }
    }, 1000);

    return () => clearInterval(scrollInterval);
  }, [blogs.length]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid Date";
    }
  };

  const handleAddComment = async (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAutoScroll(false);

    const commentText = newCommentInput[blogId]?.trim();
    if (!commentText) return;

    const newCommentObj = { text: commentText, author: "" };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/blog/${blogId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCommentObj),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");
      await fetchBlogs();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Try again.");
    }
  };

  const toggleComments = (blogId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };

  return (
    <section className="relative bg-cream py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-4xl font-bold text-yellow-700 mb-4">
          Victor Insights & Updates
        </h2>
        <p className="text-2xl text-yellow-700 max-w-2xl mx-auto">
          Latest news, tutorials and industry perspectives from our team
        </p>
        <p className="text-base text-yellow-600 max-w-3xl mx-auto mb-4">
          Stay informed about door innovations, sustainability practices, and customer success journeys.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : blogs.length > 0 ? (
        <div
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
          ref={scrollRef}
          onClick={() => setAutoScroll(false)}
        >
          <div className="flex gap-6 sm:gap-8 pb-4 px-2 sm:px-4 lg:px-6">
            {blogs.map((blog) => {
              const isExpanded = expandedComments[blog._id];
              const commentCount = comments[blog._id]?.length || 0;

              return (
                <div
                  key={blog._id}
                  className="snap-start w-[90%] sm:w-[400px] md:w-[480px] lg:w-[520px] xl:w-[580px] flex-shrink-0 bg-white rounded-2xl shadow-xl p-4"
                >
                  <div className="relative h-64 sm:h-72 md:h-80 mb-4 rounded-xl overflow-hidden">
                    <img
                      src={blog.images?.[0] || "https://via.placeholder.com/400x200"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">{blog.description}</p>
                  <p className="text-xs text-yellow-500 mb-2">{formatDate(blog.createdAt)}</p>

                  <button
                    className="text-yellow-600 font-semibold mb-2 underline"
                    onClick={() => toggleComments(blog._id)}
                  >
                    {isExpanded
                      ? `Hide Comments (${commentCount})`
                      : `Show Comments (${commentCount})`}
                  </button>

                  {isExpanded && (
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1 mb-3 border-t border-gray-200 pt-2">
                      {commentCount > 0 ? (
                        comments[blog._id].map((comment) => (
                          <div key={comment.id} className="bg-gray-100 p-2 rounded-lg">
                            <div className="text-sm font-medium text-yellow-800">
                              {comment.author && comment.author !== "Anonymous" ? comment.author : ""}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{formatDate(comment.date)}</div>
                            <div className="text-sm text-gray-700">{comment.text}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentInput[blog._id] || ""}
                      onChange={(e) =>
                        setNewCommentInput((prev) => ({ ...prev, [blog._id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment(blog._id, e)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:ring-1 w-full"
                    />
                    <button
                      onClick={(e) => handleAddComment(blog._id, e)}
                      className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 w-full sm:w-auto"
                    >
                      Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No blogs available at the moment. Please check back later.
          </p>
        </div>
      )}
    </section>
  );
};

export default Blogs;
