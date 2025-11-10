// src/components/Header.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { FaBars, FaChevronDown, FaUserCircle, FaSpinner } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-i18next";

const Header = ({ onToggleSidebar }) => {
  const {
    i18n: { language },
  } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // افترض أن لديك endpoint API لجلب بيانات المستخدم
        // يمكنك استخدام التوكن من السياق إذا لزم الأمر
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          "http://192.168.1.105:8080/api/Account/header",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات المستخدم");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authContext.token]);

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
        {loading ? (
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin" size={20} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <>
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={40} className="text-gray-400" />
            )}

            <div
              className={`
              } whitespace-nowrap`}
            >
              <span className="font-bold text-gray-700  block text-[16px]">
                {userData?.username || "user name "}
              </span>
              <span className="text-[14px]">{userData?.role || "role"}</span>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
