import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getDetailFields } from "../detailFields";
import { FaTimes, FaTrash } from "react-icons/fa";
import History from "./History";
import PopUp from "./PopUp";
import { addCompanyFields } from "../popUpFields";
import Select from "./Select";

const DetailView = ({ id, fallBack, name, type, onClose, canAdd = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const fields = getDetailFields(type);
  const dataToShow = data;
  const popUpFields = addCompanyFields[popup] || [];
  const options =
    name === "product"
      ? ["Company"]
      : ["Employee", "Contact", "Activity", "File", "Address"];
  const getHandleAdd = () => {
    const addFunctions = {
      employee: AddEmployee,
      contact: AddContact,
      activity: AddActivity,
      address: AddAdress,
      file: AddFile,
      company: AddCompany,
    };
    return addFunctions[popup];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios
          .get(`http://192.168.1.105:8080/api/${type}/GetById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setData({
          files: response.data.files,
          ...response.data[name.toLowerCase()],
        });
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(t("detailView.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    if (id && type !== "Account" && type !== "Logs") {
      fetchData();
    } else {
      setData(fallBack);
      setLoading(false);
    }
  }, [id, type, refresh]);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const handleApiError = (err, defaultMessage) => {
    if (err.response?.data?.errors) {
      if (
        typeof err.response.data.errors === "object" &&
        !Array.isArray(err.response.data.errors)
      ) {
        const errorMessages = [];
        for (const field in err.response.data.errors) {
          if (Array.isArray(err.response.data.errors[field])) {
            errorMessages.push(...err.response.data.errors[field]);
          } else {
            errorMessages.push(err.response.data.errors[field]);
          }
        }
        return errorMessages.join(", ");
      } else if (Array.isArray(err.response.data.errors)) {
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

  // ADD FUNCTIONS
  const AddContact = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.1.105:8080/api/Company/AddContacts/${id}`,
        body.contacts,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add contact error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const AddEmployee = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body);

      const response = await axios.post(
        `http://192.168.1.105:8080/api/Company/AddEmployees/${id}`,
        [body],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add employee error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const AddActivity = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.activities);

      const response = await axios.post(
        `http://192.168.1.105:8080/api/Company/AddActivities/${id}`,
        body.activities,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add activity error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const AddAdress = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.addresses);

      const response = await axios.post(
        `http://192.168.1.105:8080/api/Company/AddAddresses/${id}`,
        body.addresses,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add activity error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const AddCompany = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.company);

      const response = await axios.post(
        `http://192.168.1.105:8080/api/Product/AddCompany/${id}`,
        body.company,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add activity error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
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

  const AddFile = async (body) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body);
      const data = convertToFormData(body);

      const response = await axios.post(
        `http://192.168.1.105:8080/api/Company/AddFiles/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.addFailed")
      );
      console.error("Add file error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // DELETE FUNCTIONS (PATCH requests)
  const DeleteContact = async (contactId) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      // Get current data and remove the contact
      const updatedContacts = dataToShow.contacts
        .filter((contact) => contact.id !== contactId)
        .map((contact) => ({
          name: contact.contactName,
          contactTypeId: contact.contactTypeId,
        }));

      console.log(
        `http://192.168.1.105:8080/api/Company/EditContacts/${id}`,
        updatedContacts,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.patch(
        `http://192.168.1.105:8080/api/Company/EditContacts/${id}`,
        updatedContacts,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete contact error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const DeleteEmployee = async (employeeId, role = "") => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      if (type === "Project" || type === "Product") {
        const newdata = {
          ...dataToShow,
          employees: dataToShow.employees.filter((emp) => {
            return emp.employeeId !== employeeId || emp.roleOnProject !== role;
          }),
        };
        const formData = convertToFormData(newdata);
        console.log(newdata);
        const response = await axios.patch(
          `http://192.168.1.105:8080/api/${type}/Edit`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRefresh((prev) => !prev);
        return response.data;
      } else {
        const updatedEmployees = dataToShow.employees.filter(
          (emp) => emp.id !== employeeId
        );
        const response = await axios.patch(
          `http://192.168.1.105:8080/api/Company/EditEmployees/${id}`,
          updatedEmployees,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setRefresh((prev) => !prev);
        return response.data;
      }
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete employee error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const DeleteActivity = async (activityId) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const updatedActivities = dataToShow.activities.filter(
        (activity) => activity.activityId !== activityId
      );

      console.log(updatedActivities);

      const response = await axios.patch(
        `http://192.168.1.105:8080/api/Company/EditActivities/${id}`,
        updatedActivities,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete activity error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const DeleteAddress = async (addressId) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const updatedaddresses = dataToShow.addresses.filter(
        (address) => address.id !== addressId
      );

      console.log(updatedaddresses);

      const response = await axios.patch(
        `http://192.168.1.105:8080/api/Company/Editaddresses/${id}`,
        updatedaddresses,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete activity error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const DeleteFile = async (fileId) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://192.168.1.105:8080/api/${type}/DeleteFile/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete file error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const DeleteCompany = async (companyId) => {
    setError(null);
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://192.168.1.105:8080/api/Product/DeleteCompany/${id}?companyId=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefresh((prev) => !prev);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("detailView.errors.deleteFailed")
      );
      console.error("Delete file error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handler functions for delete buttons
  const handleDeleteContact = (contactId) => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteContact(contactId);
    }
  };

  const handleDeleteEmployee = (employeeId, role = "") => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteEmployee(employeeId, role);
    }
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteActivity(activityId);
    }
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteAddress(addressId);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteFile(fileId);
    }
  };

  const handleDeleteCompany = (fileId) => {
    if (window.confirm(t("detailView.confirmDelete"))) {
      DeleteCompany(fileId);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-300 min-h-screen">
        <div className="p-8 rounded-md bg-white">
          <h1 className="text-3xl font-bold text-[var(--main-color)] mb-6">
            {t(`detailView.title.${type}`)}
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="flex space-x-2">
              <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderFieldValue = (field, value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      !value.toString().length
    ) {
      return "-";
    }

    // Check if this field should be full width (array fields)
    const shouldBeFullWidth = Array.isArray(value) && value.length > 0;

    const content = (() => {
      switch (field.name) {
        case "employees":
          return (
            <div className="flex flex-col gap-3">
              {value.map((emp) => {
                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    {/* Main Info Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* First Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.firstName")}
                            </div>
                            <div className="text-gray-800">
                              {emp.firstName || "-"}
                            </div>
                          </div>

                          {/* Last Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.lastName")}
                            </div>
                            <div className="text-gray-800">
                              {emp.lastName || "-"}
                            </div>
                          </div>

                          {/* Position */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.position")}
                            </div>
                            <div className="text-gray-800">
                              {emp.position ||
                                emp.roleOnProject ||
                                emp.roleOnProduct ||
                                "-"}
                            </div>
                          </div>

                          {/* Department */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.department")}
                            </div>
                            <div className="text-gray-800">
                              {emp.department || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Notes - Full Width */}
                        {emp.notes && (
                          <div className="mt-3">
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.notes")}
                            </div>
                            <div className="text-gray-800 bg-white p-2 rounded border">
                              {emp.notes}
                            </div>
                          </div>
                        )}

                        {/* Contacts - Full Width */}
                        {emp.contacts && emp.contacts.length > 0 && (
                          <div className="mt-3">
                            <div className="font-semibold text-[var(--main-color)] text-sm mb-2">
                              {t("fields.employee.contactName")}
                            </div>
                            <div className="flex flex-col gap-2">
                              {emp.contacts.map((contact, contactIndex) => (
                                <div
                                  key={crypto.randomUUID()}
                                  className="flex justify-between items-center bg-white p-2 rounded border"
                                >
                                  <div className="flex gap-4">
                                    {contact.contactType && (
                                      <span className="font-medium text-[var(--main-color)]">
                                        {contact.contactType}:
                                      </span>
                                    )}
                                    <span>
                                      {contact.name ||
                                        contact.contactName ||
                                        "-"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() =>
                            handleDeleteEmployee(
                              emp.employeeId || emp.id,
                              emp.roleOnProject || emp.roleOnProduct
                            )
                          }
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "files":
          return (
            <div className="flex flex-col gap-3">
              {value.map((file) => {
                console.log(file);
                // Function to get file icon based on file type or extension
                const getFileIcon = (fileName, fileType) => {
                  const extension = fileName?.split(".").pop()?.toLowerCase();
                  const type = fileType?.toLowerCase();

                  if (type?.includes("pdf") || extension === "pdf") {
                    return "📄"; // PDF icon
                  } else if (
                    type?.includes("image") ||
                    ["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(
                      extension
                    )
                  ) {
                    return "🖼️"; // Image icon
                  } else if (
                    type?.includes("word") ||
                    extension === "doc" ||
                    extension === "docx"
                  ) {
                    return "📝"; // Word document icon
                  } else if (
                    type?.includes("excel") ||
                    extension === "xls" ||
                    extension === "xlsx"
                  ) {
                    return "📊"; // Excel icon
                  } else if (
                    type?.includes("powerpoint") ||
                    extension === "ppt" ||
                    extension === "pptx"
                  ) {
                    return "📽️"; // PowerPoint icon
                  } else if (
                    type?.includes("zip") ||
                    extension === "zip" ||
                    extension === "rar"
                  ) {
                    return "📦"; // Archive icon
                  } else if (type?.includes("text") || extension === "txt") {
                    return "📃"; // Text file icon
                  } else {
                    return "📎"; // Default file icon
                  }
                };

                const fileIcon = getFileIcon(file.fileName, file.fileType);

                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* File Name with Icon */}
                          <div className="md:col-span-2">
                            <div className="font-semibold text-[var(--main-color)] text-sm mb-2">
                              {t("fields.file.fileName")}
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className="text-2xl"
                                title={file.fileType || "File"}
                              >
                                {fileIcon}
                              </span>
                              <a
                                href={`http://192.168.1.105:8080/upload/${
                                  type === "Emp" ? "Employee" : type
                                }s/${file.fileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-words flex-1"
                                title={`Download ${file.fileName}`}
                              >
                                {file.fileName}
                              </a>
                            </div>
                          </div>

                          {/* File Type */}
                          {file.fileType && (
                            <div>
                              <div className="font-semibold text-[var(--main-color)] text-sm">
                                {t("fields.file.fileType")}
                              </div>
                              <div className="text-gray-800 flex items-center gap-2">
                                <span className="text-lg">{fileIcon}</span>
                                {file.fileType}
                              </div>
                            </div>
                          )}

                          {/* Upload Date */}
                          {file.uploadedAt && (
                            <div>
                              <div className="font-semibold text-[var(--main-color)] text-sm">
                                {t("fields.file.uploadedAt")}
                              </div>
                              <div className="text-gray-800">
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() =>
                            handleDeleteFile(file.id || file.entityId)
                          }
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "contacts":
          return (
            <div className="flex flex-col gap-3">
              {value.map((contact) => {
                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Contact Type */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.contact.type")}
                            </div>
                            <div className="text-gray-800">
                              {contact.contactType || "-"}
                            </div>
                          </div>

                          {/* Contact Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.contact.name")}
                            </div>
                            <div className="text-gray-800">
                              {contact.contactName || contact.name || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Additional Contact Info */}
                        {(contact.email || contact.phone) && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {contact.email && (
                              <div>
                                <div className="font-semibold text-[var(--main-color)] text-sm">
                                  Email
                                </div>
                                <div className="text-gray-800">
                                  {contact.email}
                                </div>
                              </div>
                            )}
                            {contact.phone && (
                              <div>
                                <div className="font-semibold text-[var(--main-color)] text-sm">
                                  Phone
                                </div>
                                <div className="text-gray-800">
                                  {contact.phone}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() => handleDeleteContact(contact.id)}
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "activities":
          return (
            <div className="flex flex-col gap-3">
              {value.map((activity) => {
                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Industry Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.activity.industryName")}
                            </div>
                            <div className="text-gray-800">
                              {activity.industryName || "-"}
                            </div>
                          </div>

                          {/* Activity Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.activity.activityName")}
                            </div>
                            <div className="text-gray-800">
                              {activity.activityName || activity.name || "-"}
                            </div>
                          </div>

                          {/* Activity ID
                          {(activity.activityId || activity.id) && (
                            <div>
                              <div className="font-semibold text-[var(--main-color)] text-sm">
                                {t("fields.activity.id")}
                              </div>
                              <div className="text-gray-800">
                                {activity.activityId || activity.id}
                              </div>
                            </div>
                          )} */}

                          {/* Industry ID */}
                          {activity.industryId && (
                            <div>
                              <div className="font-semibold text-[var(--main-color)] text-sm">
                                {t("fields.activity.industryId")}
                              </div>
                              <div className="text-gray-800">
                                {activity.industryId}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Activity Description */}
                        {activity.description && (
                          <div className="mt-3">
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.activity.description")}
                            </div>
                            <div className="text-gray-800 bg-white p-2 rounded border">
                              {activity.description}
                            </div>
                          </div>
                        )}

                        {/* Activity Type */}
                        {activity.type && (
                          <div className="mt-3">
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.activity.type")}
                            </div>
                            <div className="text-gray-800">{activity.type}</div>
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() =>
                            handleDeleteActivity(
                              activity.activityId || activity.id
                            )
                          }
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "company":
          return (
            <div className="flex flex-col gap-3">
              {value.map((company, index) => {
                const startDate = new Date(
                  company.startDate
                ).toLocaleDateString();
                const endDate = new Date(company.endDate).toLocaleDateString();

                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Company Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.company.name")}
                            </div>
                            <div className="text-gray-800">
                              {company.name || "-"}
                            </div>
                          </div>

                          {/* Start Date */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.company.startDate")}
                            </div>
                            <div className="text-gray-800">{startDate}</div>
                          </div>

                          {/* End Date */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.company.endDate")}
                            </div>
                            <div className="text-gray-800">{endDate}</div>
                          </div>

                          {/* Total Price */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.company.price")}
                            </div>
                            <div className="text-gray-800">
                              {company.price !== undefined
                                ? `$${company.price.toFixed(2)}`
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() => handleDeleteCompany(company.companyId)}
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "addresses":
          return (
            <div className="flex flex-col gap-3">
              {value.map((address, index) => {
                return (
                  <div
                    key={crypto.randomUUID()}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Country */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.address.country")}
                            </div>
                            <div className="text-gray-800">
                              {address.country || "-"}
                            </div>
                          </div>

                          {/* State */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.address.state")}
                            </div>
                            <div className="text-gray-800">
                              {address.state || "-"}
                            </div>
                          </div>

                          {/* City */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.address.city")}
                            </div>
                            <div className="text-gray-800">
                              {address.city || "-"}
                            </div>
                          </div>

                          {/* Address Line */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.address.addressLine")}
                            </div>
                            <div className="text-gray-800">
                              {address.addressLine || "-"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0 ml-4">
                        <FaTrash
                          onClick={() => handleDeleteAddress(address.id)}
                          className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                          title={t("detailView.confirmDelete")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "legal":
          return value.legalInfo;
        case "found_Date":
          const dateValue = new Date(value);
          const formattedDate = dateValue.toISOString().split("T")[0];
          return formattedDate;
        default:
          return value.toString();
      }
    })();

    // Wrap in full-width container if it's an array field
    if (shouldBeFullWidth) {
      return <div className="col-span-2">{content}</div>;
    }

    return content;
  };

  return (
    <>
      <div className="p-6 bg-gray-300 min-h-screen">
        <div className="p-8 rounded-md bg-white">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              {t(`detailView.title.${type}`)}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {error && (
            <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md">
              {[...error.split(",")].map((e) => (
                <p key={crypto.randomUUID()}>{e.trim()}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map((field) => {
              const value = dataToShow[field.name];
              const isArrayField =
                (Array.isArray(value) && value.length > 0) ||
                field.name === "companyDescription";

              return (
                <div
                  key={crypto.randomUUID()}
                  className={`bg-gray-100 p-4 rounded-md shadow-sm ${
                    isArrayField ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="font-semibold text-[var(--main-color)] mb-2">
                    {t(field.title)}
                  </div>
                  <div className="text-gray-800 break-words">
                    {renderFieldValue(field, value)}
                  </div>
                </div>
              );
            })}
          </div>

          {["Account", "Logs"].includes(type) ? null : (
            <History id={id} url={type} />
          )}

          <div className="flex justify-end gap-3 items-center pt-6 border-t border-gray-200 mt-10">
            {canAdd && (
              <>
                <select
                  value={popup}
                  onChange={(e) => {
                    setPopup(e.target.value);
                  }}
                  className="px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white outline-3 outline-[var(--main-color)] max-lg:w-full"
                >
                  <option value="">
                    {t("popup.selectPlaceholder", {
                      field: t("detailView.option"),
                    })}
                  </option>
                  {options.map((o, i) => {
                    return (
                      <option key={crypto.randomUUID()} value={o.toLowerCase()}>
                        {t(`detailView.options.${o.toLowerCase()}`)}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => {
                    if (popup) {
                      setOpen(true);
                    }
                  }}
                  className="px-6 py-2 cursor-pointer bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color-darker)] transition-colors"
                >
                  {t("popup.add")}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 cursor-pointer bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color-darker)] transition-colors"
            >
              {t("detailView.close")}
            </button>
          </div>
        </div>

        {canAdd && (
          <PopUp
            isOpen={open}
            fields={popUpFields}
            onClose={() => setOpen(false)}
            isAdd={true}
            handleAdd={getHandleAdd()}
            title={t(`detailView.options.${popup}`)}
          />
        )}
      </div>
    </>
  );
};

export default DetailView;
