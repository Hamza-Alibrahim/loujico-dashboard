// src/components/Header.jsx

import React, { useContext } from "react";
import { FaBell, FaEnvelope, FaSearch, FaBars } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

// تمت إضافة prop جديدة `onToggleSidebar`
const Header = ({ onToggleSidebar }) => {
  // const { user } = useContext(AuthContext);

  // if (!user) {
  //     return null;
  // }

  return (
    <nav
      className={`h-20 bg-white p-4 px-4 lg:px-12 flex items-center justify-between lg:justify-end w-full `}
    >
      {/* زر القائمة للشاشات الصغيرة */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
      >
        <FaBars size={24} />
      </button>

      {/* شريط البحث */}
      {/* <div className="relative flex-1 max-w-sm hidden sm:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] bg-gray-100"
                />
            </div> */}

      {/* الأيقونات وملف المستخدم */}
      <div className="flex items-center space-x-6 mr-4">
        {/* <div className="flex space-x-4">
                    <div className="relative p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                        <FaBell className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </div>
                    <div className="relative p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                        <FaEnvelope className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-white"></span>
                    </div>
                </div> */}
        <div className="flex items-center space-x-6 cursor-pointer">
          <img
            src="/public/assets/image/avatar-04.png"
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <span className="font-bold text-gray-700  block text-[16px]">
              مكين خواجكيه
            </span>
            <span className="text-[14px]">مدير</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
