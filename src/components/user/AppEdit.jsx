import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';
import SideBar from '../sidebar/SideBar';
import { sidebarData } from '../sidebar/sidebardata';
import { applicationService } from '../../service/appService';

const ApplicationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [appData, setAppData] = useState({
    title: '',
    description: '',
    link: '',
    images: []
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await applicationService.getApplicationById(id);
        const processedImages = data.images?.map(img =>
          img.startsWith('http') ? img : `https://bk-appstore.victor-door.com${img}`
        ) || [];

        setAppData({
          title: data.title || '',
          description: data.description || '',
          link: data.link || '',
          images: processedImages
        });
      } catch (error) {
        toast.error(error.message || 'Failed to load application');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + appData.images.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    const validImages = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImages.length !== files.length) {
      toast.error('Only images under 5MB are allowed');
    }

    setAppData(prev => ({
      ...prev,
      images: [...prev.images, ...validImages]
    }));
  };

  const removeImage = (index) => {
    setAppData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!appData.title.trim() || !appData.description.trim() || !appData.link.trim()) {
      toast.error('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      await applicationService.updateApplication(id, appData);
      toast.success('Application updated successfully!');
      navigate('/applications');
    } catch (error) {
      toast.error(error.message || 'Failed to update application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <SideBar sidebarData={sidebarData} />
        <div className="flex-1 flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar sidebarData={sidebarData} />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Title*</label>
            <input
              id="title"
              name="title"
              value={appData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-1 font-medium text-gray-700">Description*</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={appData.description}
              onChange={handleChange}
              placeholder="Write your description..."
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="link" className="block mb-1 font-medium text-gray-700">Link*</label>
            <input
              id="link"
              name="link"
              type="url"
              value={appData.link}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Images (Max 5)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {appData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    className="h-32 w-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              {appData.images.length < 5 && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer h-32"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiPlus size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationEdit;
