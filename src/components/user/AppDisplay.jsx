import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import SideBar from '../sidebar/SideBar';
import { sidebarData } from '../sidebar/sidebardata';
import { applicationService } from '../../service/appService'; // Ensure this service exists

const ApplicationDisplay = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 10;
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bk-appstore.victor-door.com';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getApplications(); // Adjust this if different
        const data = Array.isArray(response) ? response : response?.applications || [];

        const processedApps = data.map(app => ({
          ...app,
          title: app.title === 'undefined' ? '' : app.title,
          description: app.description === 'undefined' ? '' : app.description,
          link: app.link === 'undefined' ? '' : app.link,
          images: app.images?.map(image =>
            image.startsWith('http') ? image : `${API_BASE_URL}${image.replace(/^undefined/, '')}`
          ) || []
        }));

        setApplications(processedApps);
      } catch (error) {
        console.error('Error loading applications:', error);
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(id);
        setApplications(prev => prev.filter(app => app._id !== id));
        toast.success('Application deleted');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Could not delete application');
      }
    }
  };

  const indexOfLast = currentPage * appsPerPage;
  const indexOfFirst = indexOfLast - appsPerPage;
  const currentApps = applications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(applications.length / appsPerPage);

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">All Applications</h1>
          <button
            onClick={() => navigate('/app/form')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" /> Create New Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No applications found. Upload your first application!</p>
            <button
              onClick={() => navigate('/applications/create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mx-auto"
            >
              <FiPlus className="mr-2" /> Upload Application
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Images</th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentApps.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{app.title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-base text-gray-500 line-clamp-2">{app.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {app.images.slice(0, 3).map((img, i) => (
                            <div key={i} className="h-10 w-10 rounded-md overflow-hidden border border-gray-200">
                              <img
                                src={img}
                                alt={`Image ${i}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/40';
                                }}
                              />
                            </div>
                          ))}
                          {app.images.length > 3 && (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xs border border-gray-200">
                              +{app.images.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/app/edit/${app._id}`)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLast, applications.length)}</span> of{' '}
                  <span className="font-medium">{applications.length}</span> results
                </div>
                <nav className="inline-flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => paginate(num)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        currentPage === num
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDisplay;
