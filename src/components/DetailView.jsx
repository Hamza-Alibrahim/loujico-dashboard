import { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getDetailFields } from "../detailFields";
import {
  FaAngleLeft,
  FaAngleRight,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import History from "./History";
import PopUp from "./PopUp";
import { addCompanyFields } from "../popUpFields";
import { AuthContext } from "../Context/AuthContext";
import ToDoFile from "./ToDoFile";

const DetailView = ({ id, fallBack, name, type, onClose, canAdd = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState("");
  const [open, setOpen] = useState(false);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksPageSize, setTasksPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [taskDetails, setTaskDetails] = useState({});
  const [title, setTitle] = useState(false);
  const {
    user: { token, role, employeeId },
  } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const debounceTimerRef = useRef(null);

  const canManageTasks = role !== "Programmer";
  const isProgrammer = role === "Programmer";
  const fields = getDetailFields(
    Object.keys(taskDetails).length && !editTask ? "Task" : type
  );
  const dataToShow = data;
  let popUpFields = addCompanyFields[popup] || [];

  if (popup === "task" && !editTask) {
    popUpFields = popUpFields.filter((field) => {
      if (field.name !== "status" && field.type !== "file") {
        return true;
      }

      return false;
    });
  }

  const options =
    name === "product"
      ? ["Company"]
      : ["Employee", "Contact", "Activity", "File", "Address"];
  const statusOptions = [
    "All",
    "Pending",
    "InProgress",
    "Completed",
    "Cancelled",
  ];
  const getHandleAdd = () => {
    const addFunctions = {
      task: AddTask,
      employee: AddEmployee,
      contact: AddContact,
      activity: AddActivity,
      address: AddAdress,
      file: AddFile,
      company: AddCompany,
    };
    return addFunctions[popup];
  };

  // Fetch main data (company/project/product details)
  useEffect(() => {
    const fetchMainData = async () => {
      try {
        setLoading(true);

        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios
          .get(`http://loujico.somee.com/Api/${type}/GetById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setData((prev) => ({
          ...prev,
          files: response.data.files,
          ...response.data[name.toLowerCase()],
        }));
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(t("detailView.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    if (id && type !== "Account" && type !== "Logs") {
      fetchMainData();
    } else {
      setData(fallBack);
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!id || type !== "Project") return;

      setData((prev) => ({
        ...prev,
        tasks: { items: [], totalCount: 0 },
      }));

      try {
        setLoadingTasks(true);
        const response = await axios.get(
          `http://loujico.somee.com/Api/Task/GetAll?projectId=${id}&page=${tasksPage}&pageSize=${tasksPageSize}&myTasks=${myTasksOnly}&status=${statusFilter}&search=${debouncedSearchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const tasks = response.data;

        setData((prev) => ({
          ...prev,
          tasks,
        }));
      } catch (err) {
        console.error("Error loading tasks:", err);
        // Keep existing tasks data if fetch fails
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [
    refreshTasks,
    tasksPage,
    tasksPageSize,
    debouncedSearchQuery,
    myTasksOnly,
    statusFilter,
  ]);

  const handleTasksPageChange = (newPage) => {
    if (newPage < 1) return;
    setTasksPage(newPage);
  };

  const handleTasksPageSizeChange = (newSize) => {
    setTasksPageSize(newSize);
    setTasksPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
      setTasksPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay
  };

  const getTaskDetails = async (id, load) => {
    setTaskDetails({});
    if (load) {
      setTitle(`${id}`);
      setLoading(true);
    }
    try {
      const response = await axios
        .get(`http://loujico.somee.com/Api/Task/GetById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data);

      if (!load) {
        response.employees = response.assignedEmployees.map((emp) => {
          return { employeeId: emp.employeeId, roleOnProject: emp.roleOnTask };
        });
        response.Data = response.files;
        delete response.assignedEmployees;
        delete response.files;
      }

      setTaskDetails({ ...response });

      return response.data;
    } catch (err) {
      setTitle(false);
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.updateFailed", { item: searchPlaceHolder })
      );
      console.error("Get one error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      const response = await axios
        .patch(
          `http://loujico.somee.com/Api/Task/EditTaskStatus/${id}?Status=${status}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => res.data);

      setRefreshTasks((prev) => !prev);
      getTaskDetails(id, true);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(
        err,
        t("dashTable.errors.updateFailed", { item: "searchPlaceHolder" })
      );
      console.error("Get one error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.post(
        `http://loujico.somee.com/Api/Company/AddContacts/${id}`,
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

  const AddTask = async (body) => {
    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      body.projectId = id;

      body.assignedEmployees = body.employees
        ? body.employees.map((emp) => {
            return {
              employeeId: +emp.employeeId,
              roleOnTask: emp.roleOnProject,
            };
          })
        : [];
      delete body.employees;

      console.log(body);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Task/Add`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefreshTasks((prev) => !prev);
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

  const AddEmployee = async (body) => {
    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Company/AddEmployees/${id}`,
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.activities);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Company/AddActivities/${id}`,
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.addresses);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Company/AddAddresses/${id}`,
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body.company);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Product/AddCompany/${id}`,
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

    // OPTION 1: As individual fields (recommended for ASP.NET model binding)
    if (body.assignedEmployees && Array.isArray(body.assignedEmployees)) {
      body.assignedEmployees.forEach((employee, index) => {
        formData.append(
          `AssignedEmployees[${index}].EmployeeId`,
          employee.employeeId
        );
        formData.append(
          `AssignedEmployees[${index}].RoleOnTask`,
          employee.roleOnTask
        );
      });
    }

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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body);
      const data = convertToFormData(body);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Company/AddFiles/${id}`,
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

  const AddTaskFile = async (body) => {
    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      console.log(body);
      const data = convertToFormData(body);

      const response = await axios.post(
        `http://loujico.somee.com/Api/Task/AddFile?id=${taskDetails.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getTaskDetails(taskDetails.id, true);
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

      const response = await axios.patch(
        `http://loujico.somee.com/Api/Company/EditContacts/${id}`,
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

  const DeleteTask = async (taskId) => {
    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://loujico.somee.com/Api/Task/Delete/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefreshTasks((prev) => !prev);
      return response.data;
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

  const EditTask = async (body) => {
    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    setError(null);
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      body.assignedEmployees = body.employees
        ? body.employees.map((emp) => {
            return {
              employeeId: +emp.employeeId,
              roleOnTask: emp.roleOnProject,
            };
          })
        : [];
      delete body.employees;

      console.log(body);
      const data = convertToFormData(body);

      const response = await axios.patch(
        `http://loujico.somee.com/Api/Task/Edit?id=${body.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefreshTasks((prev) => !prev);
      return response.data;
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

  const DeleteEmployee = async (employeeId, role = "") => {
    setError(null);
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
          `http://loujico.somee.com/Api/${type}/Edit`,
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
          `http://loujico.somee.com/Api/Company/EditEmployees/${id}`,
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
        `http://loujico.somee.com/Api/Company/EditActivities/${id}`,
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
        `http://loujico.somee.com/Api/Company/Editaddresses/${id}`,
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    const forTask = Object.keys(taskDetails).length && !editTask;

    try {
      const response = await axios.delete(
        `http://loujico.somee.com/Api/${
          forTask ? "Task" : type
        }/DeleteFile/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (forTask) {
        getTaskDetails(taskDetails.id, true);
      } else {
        setRefresh((prev) => !prev);
      }
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://loujico.somee.com/Api/Product/DeleteCompany/${id}?companyId=${companyId}`,
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
            {t(`detailView.title.${type}`)}{" "}
            {title
              ? i18n.language === "en"
                ? "( Task / " + title + " )"
                : "( مهمة / " + title + " )"
              : ""}
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
    const assigned =
      taskDetails && taskDetails.assignedEmployees
        ? taskDetails.assignedEmployees.some(
            (emp) => emp.employeeId == employeeId
          )
        : [];

    const content = (() => {
      switch (field.name) {
        case "assignedEmployees":
          return (
            <div className="flex flex-col gap-3">
              {value.map((emp) => {
                return (
                  <div
                    key={`${emp.id}-${emp.employeeId}`}
                    className="flex flex-col gap-3 bg-gray-100 border border-gray-300 rounded-md p-4"
                  >
                    {/* Main Info Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Emp ID */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.id")}
                            </div>
                            <div className="text-gray-800">
                              {emp.employeeId}
                            </div>
                          </div>

                          {/* Name */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.name")}
                            </div>
                            <div className="text-gray-800">{emp.name}</div>
                          </div>

                          {/* Position/Role */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.position")}
                            </div>
                            <div className="text-gray-800">
                              {emp.roleOnTask || emp.position || "-"}
                            </div>
                          </div>

                          {/* Assigned Date */}
                          <div>
                            <div className="font-semibold text-[var(--main-color)] text-sm">
                              {t("fields.employee.assignedAt") ||
                                "Assigned Date"}
                            </div>
                            <div className="text-gray-800">
                              {emp.assignedAt
                                ? new Date(emp.assignedAt).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "employees":
          return (
            <div className="flex flex-col gap-3">
              {value.map((emp) => {
                return (
                  <div
                    key={JSON.stringify(emp)}
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
                              {emp.contacts.map((contact) => (
                                <div
                                  key={JSON.stringify(contact)}
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
            <>
              {role !== "Programmer" || assigned ? (
                <ToDoFile
                  url={"Task"}
                  forProgrammer={true}
                  AddFile={AddTaskFile}
                />
              ) : null}
              <div className="flex flex-col gap-3">
                {value.map((file) => {
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
                      key={JSON.stringify(file)}
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
                                  href={`http://loujico.somee.com/Api/upload/${
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
                                  {new Date(
                                    file.uploadedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        {role !== "Programmer" || assigned ? (
                          <div className="flex-shrink-0 ml-4">
                            <FaTrash
                              onClick={() =>
                                handleDeleteFile(file.id || file.entityId)
                              }
                              className="hover:text-red-500 transition-colors cursor-pointer mt-1"
                              title={t("detailView.confirmDelete")}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        case "tasks":
          const tasksData = value;
          const tasks = tasksData?.items || [];
          const totalTasks = tasksData?.totalCount || 0;
          const totalPages = Math.ceil(totalTasks / tasksPageSize);
          const startIndex = (tasksPage - 1) * tasksPageSize + 1;
          const endIndex = Math.min(tasksPage * tasksPageSize, totalTasks);

          return (
            <div className="space-y-4">
              {/* Add Task Button (for non-programmers) */}
              {canManageTasks && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (editTask) {
                        setEditTask(false);
                        setTaskDetails({});
                      }

                      setPopup("task");
                      setOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color-darker)] transition-colors cursor-pointer"
                  >
                    <FaPlus /> {t("detailView.addTask")}
                  </button>
                </div>
              )}

              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={t("detailView.searchTasks")}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Status Filter - for all roles */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setTasksPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option === "All" ? "" : option}>
                      {t(`detailView.statusOption.${option}`)}
                    </option>
                  ))}
                </select>

                {/* My Tasks Toggle - only for programmers */}
                {isProgrammer && (
                  <button
                    onClick={() => {
                      setMyTasksOnly(!myTasksOnly);
                      setTasksPage(1);
                    }}
                    className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                      myTasksOnly
                        ? "bg-[var(--main-color)] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {t("detailView.myTasks")}
                  </button>
                )}
              </div>

              {/* Tasks Loading State */}
              {loadingTasks ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce"></div>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {t("detailView.noTasks")}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => {
                      // Get status color
                      const getStatusColor = (status) => {
                        switch (status?.toLowerCase()) {
                          case "completed":
                            return "bg-green-100 text-green-800 border-green-200";
                          case "inprogress":
                          case "in progress":
                            return "bg-blue-100 text-blue-800 border-blue-200";
                          case "pending":
                            return "bg-yellow-100 text-yellow-800 border-yellow-200";
                          case "cancelled":
                            return "bg-red-100 text-red-800 border-red-200";
                          default:
                            return "bg-gray-100 text-gray-800 border-gray-200";
                        }
                      };

                      // Get status icon
                      const getStatusIcon = (status) => {
                        switch (status?.toLowerCase()) {
                          case "completed":
                            return "✅";
                          case "inprogress":
                          case "in progress":
                            return "🔄";
                          case "pending":
                            return "⏳";
                          case "blocked":
                            return "🚫";
                          default:
                            return "📋";
                        }
                      };

                      return (
                        <div
                          key={JSON.stringify(task)}
                          className="flex flex-col bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          {/* Task Header with Action Buttons */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-lg">
                                {getStatusIcon(task.status)}
                              </span>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800">
                                  {task.title || "Untitled Task"}
                                </h3>
                              </div>
                            </div>

                            {/* Task ID and Action Buttons */}
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-gray-500 font-mono">
                                #{task.id}
                              </div>

                              {/* Action Buttons based on role */}
                              {isProgrammer ? null : ( // Programmer only sees edit button
                                // Non-programmers see both edit and delete
                                <>
                                  <button
                                    onClick={() => {
                                      if (!editTask) {
                                        setEditTask(true);
                                      }

                                      getTaskDetails(task.id, false);
                                      setPopup("task");
                                      setOpen(true);
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                    title={t("detailView.editTask")}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          t("detailView.confirmDelete")
                                        )
                                      ) {
                                        DeleteTask(task.id);
                                      }
                                    }}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                    title={t("detailView.deleteTask")}
                                  >
                                    <FaTrash />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className={`px-2 py-0.5 outline-none rounded-full text-xs font-medium border ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {t(`detailView.statusOption.${task.status}`)}
                              </div>

                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {t("detailView.estimatedHours", {
                                  hours: task.estimatedHours || 0,
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Assignees */}
                          {task.employeeNames &&
                            task.employeeNames.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                  {t("detailView.assignees")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {task.employeeNames.map((employee, idx) => (
                                    <div
                                      key={idx + employee}
                                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                                    >
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                      {employee}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Task Metadata */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                {task.createdDate ? (
                                  <span>
                                    {new Date(
                                      task.createdDate
                                    ).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span>{t("detailView.noDate")}</span>
                                )}
                              </div>
                              {task.lastModified && (
                                <div className="flex items-center gap-1">
                                  <span>✏️</span>
                                  <span>
                                    {new Date(
                                      task.lastModified
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {/* View Details Button */}
                              <button
                                onClick={() => getTaskDetails(task.id, true)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 cursor-pointer"
                              >
                                {t("detailView.viewDetails")}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination for Tasks */}
                  {totalTasks > 0 && (
                    <div className="flex justify-center lg:justify-end items-center flex-wrap gap-3 sm:gap-5 mt-5 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">
                          {t("dashTable.rowsPerPage")}:
                        </span>
                        <select
                          onChange={(e) =>
                            handleTasksPageSizeChange(Number(e.target.value))
                          }
                          className="outline-none cursor-pointer bg-gray-100 px-2 py-1 rounded"
                          value={tasksPageSize}
                          disabled={loadingTasks}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 dir-ltr">
                        <span>
                          {startIndex}-{endIndex}
                        </span>
                        <span>{t("dashTable.of")}</span>
                        <span>{totalTasks}</span>
                      </div>
                      <div
                        className={`flex gap-2 items-center ${
                          i18n.language === "en" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <button
                          onClick={() => handleTasksPageChange(tasksPage + 1)}
                          disabled={tasksPage >= totalPages || loadingTasks}
                          aria-label={t("dashTable.nextPage")}
                          className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed p-1 hover:bg-gray-200 rounded"
                        >
                          <FaAngleRight className="text-lg" />
                        </button>
                        <span className="px-2">{tasksPage}</span>
                        <button
                          onClick={() => handleTasksPageChange(tasksPage - 1)}
                          disabled={tasksPage <= 1 || loadingTasks}
                          aria-label={t("dashTable.previousPage")}
                          className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed p-1 hover:bg-gray-200 rounded"
                        >
                          <FaAngleLeft className="text-lg" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        case "contacts":
          return (
            <div className="flex flex-col gap-3">
              {value.map((contact) => {
                return (
                  <div
                    key={JSON.stringify(contact)}
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
                    key={JSON.stringify(activity)}
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
              {value.map((company) => {
                const startDate = new Date(
                  company.startDate
                ).toLocaleDateString();
                const endDate = new Date(company.endDate).toLocaleDateString();

                return (
                  <div
                    key={JSON.stringify(company)}
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
              {value.map((address) => {
                return (
                  <div
                    key={JSON.stringify(address)}
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
        case "status":
          const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
              case "completed":
                return "bg-green-100 text-green-800 border-green-200";
              case "inprogress":
              case "in progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
              case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
              case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
              default:
                return "bg-gray-100 text-gray-800 border-gray-200";
            }
          };

          if (role == "Programmer" && !assigned) {
            return (
              <div
                className={`px-3 w-fit py-0.5 outline-none rounded-full text-xs font-medium border ${getStatusColor(
                  value.toString()
                )}`}
              >
                {t(`detailView.statusOption.${value.toString()}`)}
              </div>
            );
          }

          return (
            <select
              value={value.toString() || "Pending"}
              onChange={(e) => handleUpdateTaskStatus(+title, e.target.value)}
              className={`px-2 py-0.5 outline-none rounded-full text-xs font-medium border cursor-pointer ${getStatusColor(
                value.toString()
              )}`}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`detailView.statusOption.${option}`)}
                </option>
              ))}
            </select>
          );
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
              {t(`detailView.title.${type}`)}{" "}
              {title
                ? i18n.language === "en"
                  ? "( Task / " + title + " )"
                  : "( مهمة / " + title + " )"
                : ""}
            </h1>
            <button
              onClick={() => {
                if (Object.keys(taskDetails).length && !editTask) {
                  setTitle(false);
                  setTaskDetails({});
                } else {
                  onClose();
                }
              }}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {error && (
            <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md">
              {[...error.split(",")].map((e) => (
                <p key={JSON.stringify(e)}>{e.trim()}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map((field) => {
              const value =
                Object.keys(taskDetails).length && !editTask
                  ? taskDetails[field.name]
                  : dataToShow[field.name];
              const isArrayField =
                value &&
                ((Array.isArray(value) && value.length > 0) ||
                  field.name === "companyDescription" ||
                  field.name === "tasks");

              return (
                <div
                  key={JSON.stringify(field)}
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
            <History
              id={id}
              url={Object.keys(taskDetails).length && !editTask ? "Task" : type}
            />
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
                  {options.map((o) => {
                    return (
                      <option key={JSON.stringify(o)} value={o.toLowerCase()}>
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
              onClick={() => {
                if (Object.keys(taskDetails).length && !editTask) {
                  setTitle(false);
                  setTaskDetails({});
                } else {
                  onClose();
                }
              }}
              className="px-6 py-2 cursor-pointer bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color-darker)] transition-colors"
            >
              {t("detailView.close")}
            </button>
          </div>
        </div>

        {(canAdd || type === "Project") && (
          <PopUp
            isOpen={open}
            fields={popUpFields}
            initialData={taskDetails}
            onClose={() => {
              setOpen(false);
              setEditTask(false);
              setTaskDetails({});
            }}
            isAdd={!editTask}
            handleAdd={getHandleAdd()}
            handleUpdate={EditTask}
            title={t(`detailView.options.${popup}`)}
          />
        )}
      </div>
    </>
  );
};

export default DetailView;
