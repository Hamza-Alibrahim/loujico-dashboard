import { useState, useEffect, useRef, useContext } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import PopUp from "./PopUp";
import axios from "axios";
import { useTranslation } from "react-i18next";
import DetailView from "./DetailView";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

// API base URL should be configured globally, not hardcoded
const API_BASE_URL = "http://loujico.somee.com/Api";

const DashTable = ({
  title,
  searchPlaceHolder,
  name,
  url,
  loading,
  fields,
  data,
  popUpFields = [],
  setRefresh,
  setRefreshTotal = () => {},
  total = undefined,
  page,
  count,
  search,
  setPage,
  setCount,
  setSearch,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [checkedFields, setCheckedFields] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [hoveredTh, setHoveredTh] = useState(null);
  const [thPosition, setThPosition] = useState({});
  const tableRef = useRef(null);
  const {
    user: { token, role },
  } = useContext(AuthContext);

  // Calculate pagination values
  const totalItems = total || data.length;
  const totalPages = Math.ceil(totalItems / count);
  const startIndex = (page - 1) * count;
  const endIndex = Math.min(startIndex + count, totalItems);
  const currentData = data.slice(0, count);

  // Reset to first page when items per page changes
  useEffect(() => {
    setPage(1);
  }, [count, setPage]);

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setHoveredTh(null);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const updateThPosition = (fieldName, element) => {
    if (element && tableRef.current) {
      const rect = element.getBoundingClientRect();
      const tableRect = tableRef.current.getBoundingClientRect();

      setThPosition({
        left: rect.left,
        top: rect.bottom,
        width: rect.width,
        fieldName: fieldName,
      });
      setHoveredTh(fieldName);
    }
  };

  const handleApiError = (err, defaultMessage) => {
    if (err.response?.data?.errors) {
      // Handle nested errors format: { errors: { field: ['error1', 'error2'], field2: ['error3'] } }
      if (
        typeof err.response.data.errors === "object" &&
        !Array.isArray(err.response.data.errors)
      ) {
        // Extract all error messages from nested object
        const errorMessages = [];
        for (const field in err.response.data.errors) {
          if (Array.isArray(err.response.data.errors[field])) {
            errorMessages.push(...err.response.data.errors[field]);
          } else {
            errorMessages.push(err.response.data.errors[field]);
          }
        }
        return errorMessages.join(", ");
      }
      // Handle array format: { errors: ['error1', 'error2'] }
      else if (Array.isArray(err.response.data.errors)) {
        return err.response.data.errors.join(", ");
      }
    } else if (err.response?.data?.message) {
      return err.response.data.message;
    } else if (err.response?.data) {
      return typeof err.response.data === "string"
        ? err.response.data
        : JSON.stringify(err.response.data);
    } else if (err.message) {
      return err.message;
    }
    return defaultMessage;
  };

  // Helper function to convert object to FormData
  const convertToFormData = (body) => {
    const formData = new FormData();

    // Add all simple fields first
    Object.keys(body).forEach((key) => {
      const value = body[key];

      if (value === null || value === undefined) {
        return;
      }

      // Skip arrays and objects for now (we'll handle them separately)
      if (
        Array.isArray(value) ||
        (typeof value === "object" && !(value instanceof File))
      ) {
        return;
      }

      // Handle simple values and files
      formData.append(key, value);
    });

    // Handle employees array - TWO OPTIONS:

    // OPTION 1: As individual fields (recommended for ASP.NET model binding)
    if (body.employees && Array.isArray(body.employees)) {
      body.employees.forEach((employee, index) => {
        formData.append(`Employees[${index}].EmployeeId`, employee.employeeId);
        formData.append(
          `Employees[${index}].RoleOnProject`,
          employee.roleOnProject
        );
      });
    }

    // OPTION 2: As JSON string (if backend expects string)
    // if (body.employees && Array.isArray(body.employees)) {
    //   formData.append('Employees', JSON.stringify(body.employees));
    // }

    // Handle Data array
    if (body.Data && Array.isArray(body.Data)) {
      body.Data.forEach((item, index) => {
        if (item.files && item.files instanceof File) {
          formData.append(`Data[${index}].Files`, item.files);
        }
        if (item.fileType) {
          formData.append(`Data[${index}].FileType`, item.fileType);
        }
      });
    }

    return formData;
  };

  const handleGetOne = async () => {
    setInitialData([]);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios
        .get(`${API_BASE_URL}${url}/GetById/${checkedFields[0]}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data);

      setInitialData({
        Data: response.data.files,
        ...response.data[name.toLowerCase()],
      });

      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.updateFailed", { item: searchPlaceHolder })
      );
      console.error("Get one error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (body) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(body);
      const formData = convertToFormData(body);

      if (url === "/Location") {
        const response = await axios.post(
          `${API_BASE_URL}${url}/Add${name}${body.id ? "/" + body.id : ""}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let browser set Content-Type with boundary for multipart/form-data
            },
          }
        );

        if (setRefresh) {
          setRefresh((prev) => !prev);
        }

        setRefreshTotal((prev) => !prev);
        return response.data;
      } else {
        const response = await axios.post(
          `${API_BASE_URL}${url}/Add${
            url === "/Settings" || url === "/Company" ? name : ""
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let browser set Content-Type with boundary for multipart/form-data
            },
          }
        );

        if (setRefresh) {
          setRefresh((prev) => !prev);
        }

        setRefreshTotal((prev) => !prev);
        return response.data;
      }
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.addFailed", { item: searchPlaceHolder })
      );
      console.error("Add error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (body) => {
    setIsLoading(true);
    setError(null);

    try {
      if (body.Data) {
        body.Data = body.Data.filter((e) => !e.id);
      }
      console.log(body);
      const formData = convertToFormData(body);

      const response = await axios.patch(
        `${API_BASE_URL}${url}/Edit${
          url === "/Settings" || url === "/Company" ? name : ""
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (setRefresh) {
        setRefresh((prev) => !prev);
      }

      setCheckedFields([]);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.updateFailed", { item: searchPlaceHolder })
      );
      console.error("Update error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fieldsToDelete) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use Promise.all for parallel deletion instead of sequential
      if (url === "/Location") {
        await Promise.all(
          fieldsToDelete.map((fieldId) =>
            axios.delete(`${API_BASE_URL}${url}/Delete${name}/${fieldId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          )
        );
      } else {
        await Promise.all(
          fieldsToDelete.map((fieldId) =>
            axios.delete(
              `${API_BASE_URL}${url}/Delete${
                url === "/Settings" ? name : ""
              }/${fieldId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
          )
        );
      }

      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
      // Clear selection after deletion
      setCheckedFields([]);
      setRefreshTotal((prev) => !prev);
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.deleteFailed", { item: searchPlaceHolder })
      );
      console.error("Delete error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (checkedFields.length === 1) {
      if (isAdd) setIsAdd(false);
      if (!["user", "مستخدم"].includes(searchPlaceHolder)) {
        handleGetOne();
      } else {
        setInitialData(data.find((e) => e.userid === checkedFields[0]));
      }
      setOpenPopUp(true);
    }
  };

  const handleAddClick = () => {
    if (!isAdd) setIsAdd(true);
    setOpenPopUp(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setCheckedFields([]);
    }
  };

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setCheckedFields((prev) => [...prev, id]);
    } else {
      setCheckedFields((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setCheckedFields(currentData.map((item) => item.id));
    } else {
      setCheckedFields([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  return (
    <div
      className={`${
        url !== "/History" ? "h-[calc(100%-80px)] bg-gray-300 p-6" : ""
      }`}
    >
      {showDetail && url !== "/History" ? (
        <DetailView
          id={selectedId}
          fallBack={data.find(
            (e) => e.userid === selectedId || e.id === selectedId
          )}
          name={name}
          type={url.replace("/", "")}
          onClose={() => setShowDetail(false)}
          canAdd={url === "/Company" || url === "/Product"}
        />
      ) : (
        <>
          <div
            className={`${url !== "/History" ? "p-8" : ""} rounded-md bg-white`}
          >
            <h1
              className={`text-3xl font-bold text-[var(--main-color)] ${
                url === "/History" ? "mb-6" : ""
              }`}
            >
              {title}
            </h1>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {[...error.split(",")].map((e) => (
                  <p key={JSON.stringify(e)}>{e.trim()}</p>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                <p>{t("dashTable.loading")}</p>
              </div>
            )}

            {url !== "/History" ? (
              <div className="flex justify-between max-lg:justify-center items-center flex-wrap gap-3 mt-8 mb-5">
                {["log", "سجل"].includes(searchPlaceHolder) ? (
                  <select
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2.5 bg-gray-300 rounded-md w-96 transition-colors hover:bg-gray-200 focus-visible:outline-[var(--main-color)]"
                  >
                    <option value="">{t("dashTable.chooseActionType")}</option>
                    <option value="error">Error</option>
                    <option value="crud">Crud</option>
                    <option value="logIn">LogIn</option>
                  </select>
                ) : (
                  <>
                    {["user", "مستخدم"].includes(searchPlaceHolder) ||
                    ["/Location", "/Settings"].includes(url) ? null : (
                      <div className="relative w-96">
                        <FaSearch
                          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500`}
                        />
                        <input
                          type="text"
                          placeholder={`${t(
                            "dashTable.searchPlaceholder"
                          )} ${searchPlaceHolder}`}
                          className={`pl-10 pr-5 py-2 bg-[#eaecf0] rounded-md w-full transition-colors
                                  hover:bg-gray-300 focus-visible:outline-[var(--main-color)] text-gray-600
                                    font-medium placeholder:text-gray-600`}
                          aria-label={t("dashTable.searchPlaceholder")}
                          value={search}
                          onChange={handleSearchChange}
                        />
                      </div>
                    )}
                    {role === "Admin" ? (
                      <div
                        className={`flex flex-wrap gap-3 max-lg:justify-center`}
                      >
                        <button
                          onClick={handleAddClick}
                          className="px-2 w-24 sm:px-5 sm:w-32 py-2 cursor-pointer rounded-md bg-[var(--main-color)]  text-white font-bold duration-300"
                        >
                          {t("dashTable.buttons.add")}
                        </button>
                        {["/Location", "/Settings"].includes(url) ? null : (
                          <button
                            onClick={handleEditClick}
                            disabled={checkedFields.length !== 1 || isLoading}
                            className={`px-2 w-24 sm:px-5 sm:w-32 py-2 rounded-md cursor-pointer bg-[var(--sub-color)] text-white font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {t("dashTable.buttons.edit")}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(checkedFields)}
                          disabled={checkedFields.length === 0 || isLoading}
                          className={`px-2 w-24 sm:px-5 sm:w-32 py-2 rounded-md cursor-pointer bg-gray-600 text-white font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {t("dashTable.buttons.delete")}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}

            <div className="overflow-x-auto table-container" ref={tableRef}>
              <table className="w-full border-collapse text-center bg-[#eaecf0] rounded-md">
                <thead>
                  <tr>
                    {url === "/History" || role !== "Admin" ? null : (
                      <th
                        className={`h-12 bg-[var(--main-color)] text-[var(--main-color)] border-white font-semibold ${
                          language === "ar"
                            ? "rounded-tr-md border-l"
                            : "rounded-tl-md border-r"
                        }`}
                        style={{ width: "50px", minWidth: "50px" }}
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          onChange={handleSelectAll}
                          checked={
                            checkedFields.length === currentData.length &&
                            currentData.length > 0
                          }
                          aria-label={t("dashTable.selectAll")}
                        />
                      </th>
                    )}
                    {fields.map((field) => (
                      <th
                        key={JSON.stringify(field)}
                        className={`h-12 relative group bg-[var(--main-color)] text-white border-white font-semibold ${
                          language === "ar"
                            ? "last:rounded-tl-md last:border-0 first:rounded-tr-md border-l"
                            : "last:rounded-tr-md last:border-0 first:rounded-tl-md border-r"
                        }`}
                        style={{
                          width: `${field.width}px`,
                          minWidth: `${field.width}px`,
                        }}
                        onMouseEnter={(e) =>
                          updateThPosition(field.name, e.currentTarget)
                        }
                        onMouseLeave={() => setHoveredTh(null)}
                      >
                        {t(field.title)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={fields.length + 1}
                        className={`p-5 ${
                          language === "en" ? "text-left" : "text-right"
                        } text-gray-500`}
                      >
                        <div className="flex space-x-2">
                          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce"></div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentData.length > 0 ? (
                        currentData.map((dataItem) => (
                          <tr
                            key={JSON.stringify(dataItem)}
                            className="transition-colors hover:bg-gray-300"
                            onClick={() => {
                              setSelectedId(dataItem.id || dataItem.userid);
                              if (url !== "/Settings") {
                                setShowDetail(true);
                              }
                            }}
                          >
                            {url === "/History" || role !== "Admin" ? null : (
                              <td
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="p-2 border-b border-white text-md"
                              >
                                <input
                                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      dataItem.id || dataItem.userid,
                                      e.target.checked
                                    )
                                  }
                                  checked={checkedFields.includes(
                                    dataItem.id || dataItem.userid
                                  )}
                                  type="checkbox"
                                  aria-label={t("dashTable.selectItem")}
                                />
                              </td>
                            )}
                            {fields.map((field) => (
                              <td
                                key={JSON.stringify(field)}
                                className={`p-2 border-b border-l ${
                                  url === "/History"
                                    ? "first:border-l-0 border-l"
                                    : "border-l"
                                } border-white text-md`}
                              >
                                {field.name === "is_present" ? (
                                  dataItem[field.name] ? (
                                    t("dashTable.status.present")
                                  ) : (
                                    t("dashTable.status.absent")
                                  )
                                ) : field.name === "is_deleted" ? (
                                  dataItem[field.name] ? (
                                    t("dashTable.status.deleted")
                                  ) : (
                                    t("dashTable.status.active")
                                  )
                                ) : field.name === "profile_image" ? (
                                  <img
                                    src={dataItem[field.name]}
                                    alt={t("dashTable.alt.employeeImage")}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : dataItem[field.name]?.toString() ? (
                                  dataItem[field.name].toString().length >
                                  40 ? (
                                    dataItem[field.name]
                                      .toString()
                                      .substring(0, 40) + "..."
                                  ) : (
                                    dataItem[field.name].toString()
                                  )
                                ) : (
                                  "-"
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={fields.length + 1}
                            className={`p-4 ${
                              language === "en" ? "text-left" : "text-right"
                            } text-gray-500`}
                          >
                            {t("dashTable.noData")}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Dropdown outside the table container
            {hoveredTh && (
              <div
                className="fixed z-50 bg-gray-300 text-black shadow-lg rounded-b-md border border-gray-400"
                style={{
                  left: `${thPosition.left}px`,
                  top: `${thPosition.top}px`,
                  width: `${thPosition.width}px`,
                  minWidth: "max-content",
                }}
                onMouseEnter={() => setHoveredTh(thPosition.fieldName)}
                onMouseLeave={() => setHoveredTh(null)}
              >
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
                    Filter Options
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
                    Sort A-Z
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
                    Sort Z-A
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
                    Clear Filters
                  </li>
                </ul>
              </div>
            )} */}

            <div className="flex justify-center lg:justify-end items-center flex-wrap gap-3 sm:gap-5 mt-5">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">
                  {t("dashTable.rowsPerPage")}:
                </span>
                <select
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="outline-none cursor-pointer"
                  disabled={isLoading}
                  value={count}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="flex items-center gap-1 dir-ltr">
                <span>
                  {startIndex + 1}-{endIndex}
                </span>
                <span>{t("dashTable.of")}</span>
                <span>{totalItems}</span>
              </div>
              <div
                className={`flex gap-2 items-center ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isLoading}
                  aria-label={t("dashTable.nextPage")}
                  className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleRight />
                </button>
                <span>{page}</span>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isLoading}
                  aria-label={t("dashTable.previousPage")}
                  className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaAngleLeft />
                </button>
              </div>
            </div>
          </div>

          <PopUp
            url={url}
            isOpen={openPopUp}
            isAdd={isAdd}
            title={searchPlaceHolder}
            fields={popUpFields}
            onClose={() => setOpenPopUp(false)}
            initialData={!isAdd ? initialData : {}}
            handleAdd={handleAdd}
            handleUpdate={handleUpdate}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default DashTable;
