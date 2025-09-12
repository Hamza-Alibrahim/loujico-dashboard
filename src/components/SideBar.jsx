// src/components/SideBar.jsx
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  FaUserAlt,
  FaProjectDiagram,
  FaFileInvoiceDollar,
  FaHome,
  FaHandshake,
  FaUserTie,
  FaFolder,
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import { IoSettings, IoClose } from "react-icons/io5";
import { AuthContext } from "../Context/AuthContext";
import { FaChevronDown } from "react-icons/fa";

const SideBar = ({ isOpen, onClose }) => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  // const { user } = useContext(AuthContext);

  const sideBarItems = [
    { name: t("sideBar.dashboard"), path: "/dashboard", icon: <FaHome /> },
    { name: t("sideBar.users"), path: "/users", icon: <FaUserAlt /> },
    { name: t("sideBar.customers"), path: "/customers", icon: <FaHandshake /> },
    { name: t("sideBar.employees"), path: "/employees", icon: <FaUserTie /> },
    {
      name: t("sideBar.projects"),
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: t("sideBar.invoices"),
      path: "/invoices",
      icon: <FaFileInvoiceDollar />,
    },
    { name: t("sideBar.products"), path: "/products", icon: <AiFillProduct /> },
    { name: t("sideBar.logs"), path: "/logs", icon: <HiDocumentText /> },
  ];

  // if (!user) {
  //     return null;
  // }

  // تحديد اتجاه السايد بار بناءً على اللغة
  const isRTL = language === "ar";

  return (
    <div
      className={`
        side-bar w-[260px] min-h-screen h-full flex flex-col items-center
        bg-white transform transition-transform duration-300 ease-in-out
        fixed top-0 z-50 lg:relative lg:translate-x-0 shrink-0
        ${isRTL ? "right-0" : "left-0"}
        ${
          isOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        }
      `}
    >
      <div
        className={`flex justify-between items-center w-full pt-10 lg:hidden gap-10 px-5 ${
          isRTL ? "" : "flex-row-reverse"
        }`}
      >
        <img
          src="/public/assets/image/logo.png"
          alt={t("logoAlt")}
          className="w-[150px]"
        />
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <IoClose size={24} />
        </button>
      </div>

      <img
        src="/public/assets/image/logo.png"
        alt={t("logoAlt")}
        className="w-[200px] my-10 hidden lg:block"
      />

      <ul className="w-full">
        {sideBarItems.map((item, index) => {
          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--sub-color-lighter)]"
                  : "bg-white text-[var(--text-color)]"
              }
            >
              {/* التصحيح هنا: عكس ترتيب flex-row-reverse */}
              <li
                className={`flex items-center py-[18px] hover:bg-gray-200 w-full px-10 duration-300 font-bold justify-between ${
                  isRTL ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* التصحيح هنا: تغيير ترتيب العناصر */}
                {isRTL ? (
                  <>
                    <span>{item.name}</span>
                    <div>{item.icon}</div>
                  </>
                ) : (
                  <>
                    <div>{item.icon}</div>
                    <span>{item.name}</span>
                  </>
                )}
              </li>
            </NavLink>
          );
        })}
        <li
          onClick={onClose}
          className={`group flex items-center py-[18px] hover:bg-gray-200 w-full px-10 duration-300 font-bold justify-between ${
            isRTL ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="relative text-[var(--text-color)] w-full">
            <div className="text-lg transition duration-300 font-bold flex justify-between items-center cursor-pointer">
              <span>{language === "en" ? "English" : "العربية"}</span>
              <FaChevronDown className="ml-1 text-sm group-hover:rotate-180 transition-transform duration-300" />
            </div>
            <div
              className="absolute w-full bottom-full left-1/2 -translate-x-1/2
              bg-white shadow-lg rounded-md cursor-pointer
              opacity-0 group-hover:opacity-100
              group-hover:visible invisible
              transition-opacity duration-300 transform scale-95 group-hover:scale-100"
            >
              <span
                onClick={() => {
                  changeLanguage(language === "ar" ? "en" : "ar");
                }}
                className="block px-6 py-3 whitespace-nowrap hover:bg-[#7899B2] hover:text-white transition duration-300 rounded-md"
              >
                {language === "ar" ? "الانجليزية" : "Arabic"}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
