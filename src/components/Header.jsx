// src/components/Header.jsx
import { useContext } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

const Header = ({ onToggleSidebar }) => {
  const {
    user: { username, role },
  } = useContext(AuthContext);

  return (
    <nav
      className={`h-20 bg-white p-4 px-4 lg:px-12 flex items-center justify-between lg:justify-end w-full`}
    >
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
      >
        <FaBars size={24} />
      </button>

      <div className={`flex items-center gap-6 cursor-pointer`}>
        {/* عرض حالة التحميل أو الخطأ أو البيانات */}
        <FaUserCircle size={40} className="text-gray-400" />

        <div
          className={`
              } whitespace-nowrap`}
        >
          <span className="font-bold text-gray-700  block text-[16px]">
            {username || "user name "}
          </span>
          <span className="text-[14px]">{role || "role"}</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
