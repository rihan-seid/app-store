// Same imports as before
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import SideBar from '../sidebar/SideBar';
import { sidebarData } from '../sidebar/sidebardata';
import { blogService } from '../../service/blogService';
import { motion } from 'framer-motion';

const BlogDisplay = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState({});
  const blogsPerPage = 10;
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bk-appstore.victor-door.com';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getBlogs();
        const data = Array.isArray(response) ? response : response?.ads || [];

        if (Array.isArray(data)) {
          const processedBlogs = data.map(blog => {
            const cleanedImages = blog.images?.map(image => {
              const cleaned = image.replace(/^undefined/, '');
              return image.startsWith('http') ? image : `${API_BASE_URL}${cleaned}`;
            }) || [];

            return {
              ...blog,
              images: cleanedImages,
            };
          });

          setBlogs(processedBlogs);

          const commentsObj = {};
          processedBlogs.forEach(blog => {
            commentsObj[blog._id] = Array.isArray(blog.comments) ? blog.comments : [];
          });

          setCommentsMap(commentsObj);
        } else {
          toast.error('Invalid data format received');
          setBlogs([]);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
        setLoadingComments(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete blog');
      }
    }
  };

  const toggleComments = (blogId) => {
    setExpandedComments(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex">
        <SideBar sidebarData={sidebarData} />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideBar sidebarData={sidebarData} />

      <div className="flex-1 p-4 md:p-8 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">All Blog Posts</h1>
          <button
            onClick={() => navigate('/blogs/form')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" /> Create New Blog
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBlogs.map(blog => (
                  <React.Fragment key={blog._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{blog.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1">
                          {blog.images?.slice(0, 3).map((image, index) => (
                            <div key={index} className="h-10 w-10 rounded-md overflow-hidden border">
                              <img src={image} alt="" className="object-cover h-full w-full" />
                            </div>
                          ))}
                          {blog.images?.length > 3 && (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xs border">
                              +{blog.images.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <FiTrash2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleComments(blog._id)}
                            className="text-yellow-600 p-1"
                            title="Toggle Comments"
                          >
                            <FiMessageSquare /> Comment
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedComments[blog._id] && (
                      <tr>
                        <td colSpan="5" className="px-6 pb-4 pt-0" style={{ backgroundColor: '#f9fafb' }}>
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 text-sm text-gray-800 space-y-2"
                          >
                            {loadingComments ? (
                              <p className="text-gray-500">Loading comments...</p>
                            ) : commentsMap[blog._id] && commentsMap[blog._id].length > 0 ? (
                              commentsMap[blog._id].map((comment, i) => (
                                <div key={comment._id || i} className="whitespace-normal border-b pb-2">
                                  <p className="font-semibold text-gray-700">{comment.author || 'Anonymous'}:</p>
                                  <p className="text-gray-700">{comment.text}</p>
                                  <p className="text-gray-400 text-xs">{new Date(comment.date).toLocaleDateString()}</p>
                                </div>
                              ))
                            ) : (
                              <p className="italic text-gray-400">No comments yet</p>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstBlog + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastBlog, blogs.length)}</span> of{' '}
                  <span className="font-medium">{blogs.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-2 border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 border text-sm font-medium ${currentPage === number
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-2 border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDisplay;
