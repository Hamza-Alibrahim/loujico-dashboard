import { useState, useEffect, useCallback } from "react";
import { FaAngleRight, FaAngleLeft, FaTrash } from "react-icons/fa";
import PopUp from "./PopUp";
import axios from "axios";
import { useTranslation } from "react-i18next";

// API base URL should be configured globally, not hardcoded
const API_BASE_URL = "http://192.168.1.10:7176";

const DashTable = ({
  title,
  searchPlaceHolder,
  url,
  loading,
  fields,
  data,
  popUpFields = [],
  setRefresh,
  total,
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
  const token = localStorage.getItem("authToken");

  // Calculate pagination values
  const totalItems = total || data.length;
  const totalPages = Math.ceil(totalItems / count);
  const startIndex = (page - 1) * count;
  const endIndex = Math.min(startIndex + count, totalItems);
  const currentData = data.slice(0, count); // Use the data provided from parent

  // Reset to first page when items per page changes
  useEffect(() => {
    setPage(1);
  }, [count, setPage]);

  const handleAdd = async (body) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api${url}/Add`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
      return response.data;
    } catch (err) {
      console.error(t("dashTable.errors.addFailed", { item: search }), err);
      setError(t("dashTable.errors.addFailed", { item: searchPlaceHolder }));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (body) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api${url}/Edit`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
      return response.data;
    } catch (err) {
      console.error(
        t("dashTable.errors.updateFailed", { item: searchPlaceHolder }),
        err
      );
      setError(t("dashTable.errors.updateFailed", { item: searchPlaceHolder }));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fieldsToDelete) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use Promise.all for parallel deletion instead of sequential
      await Promise.all(
        fieldsToDelete.map((fieldId) =>
          axios.delete(`${API_BASE_URL}/api${url}/Delete/${fieldId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        )
      );
      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
      // Clear selection after deletion
      setCheckedFields([]);
    } catch (err) {
      console.error(
        t("dashTable.errors.deleteFailed", { item: searchPlaceHolder }),
        err
      );
      setError(t("dashTable.errors.deleteFailed", { item: searchPlaceHolder }));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (checkedFields.length === 1) {
      if (isAdd) setIsAdd(false);
      setInitialData(data.find((d) => d.id === checkedFields[0]));
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
    <div className="p-6 bg-gray-300 h-[calc(100%-80px)]">
      <div className="p-8 rounded-md bg-white">
        <h1 className="text-3xl font-bold text-[var(--main-color)]">{title}</h1>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-between max-lg:justify-center items-center flex-wrap gap-3 mt-8 mb-5">
          <input
            type="text"
            placeholder={`${t(
              "dashTable.searchPlaceholder"
            )} ${searchPlaceHolder}`}
            className="px-5 py-2 bg-gray-300 rounded-md w-96 transition-colors hover:bg-gray-200 focus-visible:outline-[var(--main-color)]"
            aria-label={t("dashTable.searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
          />
          <div className="flex flex-wrap gap-3 max-lg:justify-center">
            {popUpFields.length > 0 && (
              <>
                <button
                  onClick={handleAddClick}
                  className="px-2 w-24 sm:px-5 sm:w-32 py-2 cursor-pointer rounded-md transition-colors hover:from-[var(--main-color-lighter)] hover:to-[var(--main-color)] bg-gradient-to-br from-[var(--main-color)] to-[var(--main-color-lighter)] text-white font-bold duration-300"
                >
                  {t("dashTable.buttons.add")}
                </button>
                <button
                  onClick={handleEditClick}
                  disabled={checkedFields.length !== 1 || isLoading}
                  className={`px-2 w-24 sm:px-5 sm:w-32 py-2 rounded-md cursor-pointer transition-colors hover:from-[var(--sub-color-lighter)] hover:to-[var(--sub-color)] bg-gradient-to-br from-[var(--sub-color)] to-[var(--sub-color-lighter)] text-white font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {t("dashTable.buttons.edit")}
                </button>
              </>
            )}
            <button
              onClick={() => handleDelete(checkedFields)}
              disabled={checkedFields.length === 0 || isLoading}
              className={`px-2 w-24 sm:px-5 sm:w-32 py-2 rounded-md cursor-pointer transition-colors hover:from-[var(--third-color)] hover:to-[var(--third-color-darker)] bg-gradient-to-br from-[var(--third-color-darker)] to-[var(--third-color)] text-white font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t("dashTable.buttons.delete")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center bg-gray-300 rounded-md">
            <thead>
              <tr>
                <th
                  className={`h-12 bg-[var(--main-color-lighter)] text-[var(--main-color)] border-white font-semibold ${
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
                {fields.map((field) => (
                  <th
                    key={field.name}
                    className={`h-12 bg-[var(--main-color-lighter)] text-[var(--main-color)]  border-white font-semibold ${
                      language === "ar"
                        ? "last:rounded-tl-md border-l last:border-0"
                        : "last:rounded-tr-md border-r last:border-0"
                    }`}
                    style={{
                      width: `${field.width}px`,
                      minWidth: `${field.width}px`,
                    }}
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
                    currentData.map((dataItem, i) => (
                      <tr
                        key={dataItem.id}
                        className="transition-colors hover:bg-gray-200"
                      >
                        <td className="p-2 border-b border-l border-white text-md">
                          <input
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            onChange={(e) =>
                              handleCheckboxChange(
                                dataItem.id,
                                e.target.checked
                              )
                            }
                            checked={checkedFields.includes(dataItem.id)}
                            type="checkbox"
                            aria-label={t("dashTable.selectItem")}
                          />
                        </td>
                        {fields.map((field) => (
                          <td
                            key={`${dataItem.id}-${field.name}`}
                            className={`p-2 border-b border-l border-white text-md`}
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
                            ) : (
                              dataItem[field.name]?.toString() || "-"
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
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleRight className="cursor-pointer" />
            </button>
            <span>{page}</span>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              aria-label={t("dashTable.previousPage")}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleLeft className="cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {popUpFields.length > 0 && (
        <PopUp
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
      )}
    </div>
  );
};

export default DashTable;
