import { useState } from 'react';
import { authService } from '../service/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await authService.login({ email, password });
      const { token, error } = response.data;

      if (error) {
        toast.error(error);
      } else if (token) {
        authService.setToken(token);
        toast.success("Login successful!");
        navigate('/blogs');
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
  <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-indigo-50">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-10">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
      <p className="text-gray-500">Enter your credentials to access your account</p>
    </div>

    <form onSubmit={loginUser} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email ID</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
            Forgot Password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 transition-all font-medium shadow-md"
      >
        LOGIN
      </button>
    </form>

  </div>
</section>
  );
}