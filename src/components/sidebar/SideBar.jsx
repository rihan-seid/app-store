import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaBloggerB, FaEye, FaUsers, FaUserPlus, FaSignOutAlt, FaUserCircle, FaStore } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { authService } from '../../service/auth';

const SideBar = ({ sidebarData }) => {
  const [open, setOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768);
    };

    const fetchUserName = () => {
      const userData = authService.getUserALL();
      if (userData) {
        const name = userData.firstname || userData.email || 'User';
        setUserName(name);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    fetchUserName();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    authService.logOut();
    navigate('/login');
    window.location.reload();
  };

  const isActive = (link) => {
    return location.pathname === link;
  };

  return (
    <section className="flex m-0">
      <div
        className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen
          ${open ? "w-60" : "w-16"} duration-300 text-gray-100 px-3 flex flex-col
          shadow-lg border-r border-gray-700`}
      >

        
        {/* Store Header */}
        <div className="py-12 mb-5 flex items-center justify-between border-b border-gray-700">
          {open ? (
            <div className="flex items-center gap-4 text-yellow-400 font-bold">
              <FaStore size={50} />
              <span>Victor Store</span>
            </div>
          ) : (
            <FaStore size={20} className="text-yellow-400 mx-auto" />
          )}
        
        </div>


        {/* Menu Items (compact) */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {sidebarData?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={`flex items-center text-sm gap-4 p-2 mx-1 my-0.5 rounded
                hover:bg-yellow-600 hover:text-gray-900 transition-colors
                ${isActive(menu.link) ? "bg-yellow-600 text-gray-900 font-medium" : "text-gray-300"}`}
            >
              <div className="flex-shrink-0">
                {React.createElement(menu?.icon, { size: 16 })}
              </div>
              {open && (
                <span className="whitespace-nowrap truncate">
                  {menu?.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer (compact) */}
        <div className="border-t border-gray-700 pt-1 pb-2">
          {open && userName && (
            <div className="px-1 py-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <FaUserCircle size={14} />
                <span>Welcome back, {userName}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-xl w-full p-2 mx-1 rounded 
              bg-gray-800 hover:bg-yellow-600 hover:text-gray-900 transition-colors"
          >
            <FaSignOutAlt size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>
    </section>
  );
};

SideBar.propTypes = {
  sidebarData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
};

export default SideBar;