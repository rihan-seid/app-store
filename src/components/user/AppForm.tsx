import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';
import { applicationService } from '../../service/appService';
import SideBar from '../sidebar/SideBar';
import { sidebarData } from '../sidebar/sidebardata';

interface ApplicationFormData {
  title: string;
  description: string;
  link: string;
  images: File[];
}

const ApplicationForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ApplicationFormData>({
    title: '',
    description: '',
    link: '',
    images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length + formData.images.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    const validImages = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImages.length !== files.length) {
      toast.error('Only image files under 5MB are allowed');
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.link) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await applicationService.createApplication(formData);
      toast.success('Application created successfully!');
      navigate('/applications');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar sidebarData={sidebarData} />
      
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Create New Application</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Title*</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter application title"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your application in detail"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Link*</label>
              <input
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Images (Maximum 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="h-40 w-full object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer h-40 hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiPlus size={28} className="text-gray-400 mb-2" />
                    <span className="text-base text-gray-500">Add Image</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/applications')}
                className="px-6 py-3 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;