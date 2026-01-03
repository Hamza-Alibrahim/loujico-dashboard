// src/components/SideBar.jsx
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaProjectDiagram,
  FaHome,
  FaHandshake,
  FaUserTie,
  FaIndustry,
  FaBalanceScale,
  FaAddressBook,
  FaTasks,
  FaGlobeAmericas,
  FaMap,
  FaCity,
  FaSignOutAlt,
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

const SideBar = ({ isOpen, onClose }) => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const [openAccordions, setOpenAccordions] = useState({});
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const {
    user: { role },
    logout,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleAccordion = (accordionName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [accordionName]: !prev[accordionName],
    }));
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();

    navigate("/");

    if (onClose) {
      onClose();
    }
  };

  const isRTL = language === "ar";

  // Define your sidebar items with accordion structure
  const sideBarItems = [
    {
      type: "single",
      name: t("sideBar.dashboard"),
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      type: "single",
      name: t("sideBar.users"),
      path: "/users",
      icon: <FaUserAlt />,
    },
    {
      type: "single",
      name: t("sideBar.companies"),
      path: "/companies",
      icon: <FaHandshake />,
    },
    {
      type: "single",
      name: t("sideBar.employees"),
      path: "/employees",
      icon: <FaUserTie />,
    },
    {
      type: "single",
      name: t("sideBar.projects"),
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      type: "single",
      name: t("sideBar.products"),
      path: "/products",
      icon: <AiFillProduct />,
    },
    {
      type: "single",
      name: t("sideBar.logs"),
      path: "/logs",
      icon: <HiDocumentText />,
    },
    {
      type: "accordion",
      title: t("sideBar.settings"),
      children: [
        {
          name: t("sideBar.industries"),
          path: "/settings/industries",
          icon: <FaIndustry />,
        },
        {
          name: t("sideBar.legals"),
          path: "/settings/legals",
          icon: <FaBalanceScale />,
        },
        {
          name: t("sideBar.contacts"),
          path: "/settings/contacts",
          icon: <FaAddressBook />,
        },
        {
          name: t("sideBar.activities"),
          path: "/settings/activities",
          icon: <FaTasks />,
        },
      ],
    },
    {
      type: "accordion",
      title: t("sideBar.locations"),
      children: [
        {
          name: t("sideBar.countries"),
          path: "/Location/countries",
          icon: <FaGlobeAmericas />,
        },
        {
          name: t("sideBar.states"),
          path: "/Location/states",
          icon: <FaMap />,
        },
        {
          name: t("sideBar.cities"),
          path: "/Location/cities",
          icon: <FaCity />,
        },
      ],
    },
  ];

  const renderSingleItem = (item) => (
    <NavLink
      key={item.name}
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        isActive
          ? "text-[var(--sub-color)]"
          : "bg-white text-[var(--text-color)]"
      }
    >
      <li
        className={`flex items-center py-[18px] hover:bg-gray-200 w-full px-10 duration-300 font-bold justify-between ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
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

  const renderAccordion = (item) => {
    const isAccordionOpen = openAccordions[item.title] || false;
    const AccordionChevron = isAccordionOpen ? FaChevronDown : FaChevronRight;

    return (
      <div
        key={item.name}
        className="cursor-pointer bg-white text-[var(--text-color)]"
      >
        <div
          className={`flex items-center py-[18px] hover:bg-gray-200 w-full px-10 duration-300 font-bold justify-between ${
            isRTL ? "flex-row" : "flex-row-reverse"
          }`}
          onClick={() => toggleAccordion(item.title)}
        >
          {isRTL ? (
            <>
              <span>{item.title}</span>
              <AccordionChevron
                className={`text-sm dir-ltr transition-transform duration-300 ${
                  isAccordionOpen
                    ? "rotate-0"
                    : isRTL
                    ? "-rotate-90"
                    : "rotate-90"
                }`}
              />
            </>
          ) : (
            <>
              <AccordionChevron
                className={`text-sm transition-transform duration-300 ${
                  isAccordionOpen
                    ? "rotate-0"
                    : isRTL
                    ? "rotate-90"
                    : "-rotate-90"
                }`}
              />
              <span>{item.title}</span>
            </>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isAccordionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children.map((child) => (
            <NavLink
              key={child.name}
              to={child.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--sub-color)] bg-gray-100"
                  : "bg-white text-[var(--text-color)]"
              }
            >
              <li
                className={`flex items-center py-3 hover:bg-gray-200 w-full px-14 duration-300 font-medium justify-between ${
                  isRTL ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="text-sm">{child.name}</span>
                    <div>{child.icon}</div>
                  </>
                ) : (
                  <>
                    <div>{child.icon}</div>
                    <span className="text-sm">{child.name}</span>
                  </>
                )}
              </li>
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  const LanguageChevron = showLanguageDropdown ? FaChevronDown : FaChevronRight;

  return (
    <div
      className={`
        side-bar w-[260px] min-h-screen h-full flex flex-col items-center
        bg-white transform transition-transform duration-300 ease-in-out
        fixed top-0 overflow-y-scroll z-50 lg:relative lg:translate-x-0 shrink-0
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
      <div className={`flex items-center w-full pt-10 lg:hidden gap-2 px-5`}>
        <img
          src="/public/assets/image/logo.png"
          alt={t("logoAlt")}
          className="w-[150px] mt-2 flex-1"
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
        className="w-[200px] my-2 mb-10 hidden lg:block"
      />

      <ul className="w-full flex-1">
        {sideBarItems.map((item, index) => {
          if (role === "Admin") {
            if (item.type === "accordion") {
              return renderAccordion(item, index);
            } else {
              return renderSingleItem(item, index);
            }
          } else {
            if (item.path === "/projects") {
              return renderSingleItem(item, index);
            }
          }
        })}

        {/* Language Selector - Using the same style as accordion */}
        <li className="bg-white text-[var(--text-color)]">
          <div
            className={`flex items-center py-[18px] hover:bg-gray-200 w-full px-10 duration-300 font-bold justify-between cursor-pointer ${
              isRTL ? "flex-row" : "flex-row-reverse"
            }`}
            onClick={toggleLanguageDropdown}
          >
            {isRTL ? (
              <>
                <span>{t("sideBar.language")}</span>
                <LanguageChevron
                  className={`text-sm transition-transform duration-300 ${
                    showLanguageDropdown
                      ? "rotate-0"
                      : isRTL
                      ? "-rotate-90"
                      : "rotate-90"
                  }`}
                />
              </>
            ) : (
              <>
                <LanguageChevron
                  className={`text-sm transition-transform duration-300 ${
                    showLanguageDropdown
                      ? "rotate-0"
                      : isRTL
                      ? "rotate-90"
                      : "-rotate-90"
                  }`}
                />
                <span>{t("sideBar.language")}</span>
              </>
            )}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              showLanguageDropdown
                ? "max-h-32 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className="py-2 px-14 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                changeLanguage("en");
                setShowLanguageDropdown(false);
                onClose();
              }}
            >
              <span
                className={`text-sm font-medium ${
                  language === "en"
                    ? "text-[var(--sub-color)]"
                    : "text-[var(--text-color)]"
                }`}
              >
                English
              </span>
            </div>
            <div
              className="py-2 px-14 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                changeLanguage("ar");
                setShowLanguageDropdown(false);
                onClose();
              }}
            >
              <span
                className={`text-sm font-medium ${
                  language === "ar"
                    ? "text-[var(--sub-color)]"
                    : "text-[var(--text-color)]"
                }`}
              >
                العربية
              </span>
            </div>
          </div>
        </li>
      </ul>

      {/* Logout Button - Added as the last child of the sidebar */}
      <div className="w-full p-4">
        <button
          onClick={handleLogout}
          className={`
            flex items-center justify-center w-full py-3 px-10
            duration-300 font-bold rounded-md
            bg-red-500 hover:bg-red-600 active:bg-red-700
            text-white cursor-pointer gap-2 
          `}
        >
          <span>{t("sideBar.logout") || "Logout"}</span>
          <FaSignOutAlt className={`${isRTL ? "rotate-y-180" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
