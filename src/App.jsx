import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import {  Navbar, Works, StarsCanvas } from "./components";
import Blogs from "./components/Blogs";
import Register from "./components/user/Register";
import Login from "./components/login";
import BlogForm from "./components/user/BlogForm";
import AppForm from "./components/user/AppForm";
import BlogDisplay from "./components/user/BlogDisplay";
import BlogEdit from "./components/user/BlogEdit";
import UserDisplay from "./components/user/UserDisplay";
import ApplicationDisplay from "./components/user/AppDisplay";
import AppEdit from "./components/user/AppEdit";
const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0  overflow-hidden text-gray-200  bg-gradient-to-br from-white-100 via-slate-50 to-slate-300'>
        <Navbar />
                <Toaster position="top-right" />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className='w-full '>
                  {/* <Hero /> */}
                    <Works />

                </div>
                <div className="w-full ">

                <Blogs /></div>
                <div className='relative z-0'>
                  <StarsCanvas />
                </div>
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs/form" element={<BlogForm />} />
           <Route path="/app/form" element={<AppForm />} />

            <Route path="/applications" element={<ApplicationDisplay />} />
             <Route path="/app/edit/:id" element={<AppEdit />} />

          <Route path="/blogs" element={<BlogDisplay />} />
          <Route path="/blogs/edit/:id" element={<BlogEdit  />} />
          <Route path="/user" element={<UserDisplay  />} />

          {/* Add more routes as  needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
