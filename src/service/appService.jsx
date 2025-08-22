import axios from 'axios';
import { authService } from './auth'; // Ensure this is implemented

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api/v1/applications';

export const applicationService = {
  // CREATE
  createApplication: async (appData) => {
    try {
      const formData = new FormData();
      formData.append('title', appData.title);
      formData.append('description', appData.description);
      formData.append('link', appData.link);

      appData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authService.getAuthHeader()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Application creation error:', error);
      throw new Error(error.response?.data?.error || 'Failed to create application');
    }
  },

  // GET ALL
 
  getApplications: async (search = "") => {
    try {
      const res = await axios.get(API_URL, { params: { search } });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    }
  },


  // GET BY ID
  getApplicationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch application');
    }
  },

  // UPDATE
  updateApplication: async (id, appData) => {
    try {
      const formData = new FormData();
      formData.append('title', appData.title);
      formData.append('description', appData.description);
      formData.append('link', appData.link);

      appData.images.forEach((image) => {
        if (typeof image !== 'string') {
          formData.append('images', image); // Only upload new File objects
        }
      });

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authService.getAuthHeader()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Application update error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update application');
    }
  },

  // DELETE
  deleteApplication: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Application deletion error:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete application');
    }
  },

  // GET BY USER
  getApplicationsByUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: authService.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching applications by user:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch your applications');
    }
  }
  
};


