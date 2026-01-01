import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ToDoEmp from "./ToDoEmp";
import ToDoFile from "./ToDoFile";
import Select from "./Select";
import ToDoCountry from "./ToDoCountry";
import ToDoActivity from "./ToDoActivity";
import ToDoAddress from "./ToDoAddress";
import ToDoCompany from "./TodoCompany";

const PopUp = ({
  url,
  isOpen,
  isAdd,
  title,
  fields,
  initialData = null,
  onClose,
  handleAdd,
  handleUpdate,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // Check if fields is a multi-page object
  const isMultiPage =
    fields && typeof fields === "object" && !Array.isArray(fields);
  const pageKeys = isMultiPage ? Object.keys(fields) : [];
  const currentFields = isMultiPage ? fields[pageKeys[currentPage]] : fields;

  useEffect(() => {
    if (initialData) {
      if (initialData.roles) {
        initialData.roles = initialData.roles[0];
      }
      setFormData(initialData);
    } else {
      // Initialize form with default values for all pages
      const initialFormData = {};

      if (isMultiPage) {
        // Initialize all pages
        pageKeys.forEach((key) => {
          fields[key].forEach((field) => {
            setFieldDefaultValue(initialFormData, field);
          });
        });
      } else {
        // Initialize single page
        fields.forEach((field) => {
          setFieldDefaultValue(initialFormData, field);
        });
      }
      setFormData(initialFormData);
    }
    // Reset touched fields and current page when opening the popup
    setTouched({});
    setErrors({});
    setCurrentPage(0);
  }, [isOpen, initialData]);

  // Helper function to set field default values
  const setFieldDefaultValue = (formDataObj, field) => {
    if (field.type === "checkbox") {
      formDataObj[field.name] =
        field.default !== undefined ? field.default : false;
    } else if (field.type === "number") {
      formDataObj[field.name] = field.default || 0;
    } else {
      formDataObj[field.name] = field.default || "";
    }
  };

  if (!isOpen) return null;

  // Field validation function
  const validateField = (name, value) => {
    const field = currentFields.find((f) => f.name === name);
    if (!field) return "";

    let error = "";

    // Check if field is required
    if (field.required && (!value || value.toString().trim() === "")) {
      error = t("popup.validation.required", {
        field: field.title || field.name[0].toUpperCase() + field.name.slice(1),
      });
    }
    // Email format validation
    else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = t("popup.validation.invalidEmail");
      }
    }
    // Phone number validation
    else if (field.type === "tel" && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        error = t("popup.validation.invalidPhone");
      }
    }
    // Number validation
    else if (field.type === "number" && value !== undefined && value !== null) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        error = t("popup.validation.invalidNumber");
      } else if (field.min !== undefined && numValue < field.min) {
        error = t("popup.validation.minValue", { min: field.min });
      } else if (field.max !== undefined && numValue > field.max) {
        error = t("popup.validation.maxValue", { max: field.max });
      }
    }
    // Date validation
    else if ((field.type === "date" || field.type === "datetime") && value) {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        error = t("popup.validation.invalidDate");
      } else if (field.minDate && new Date(value) < new Date(field.minDate)) {
        error = t("popup.validation.dateAfter", {
          date: new Date(field.minDate).toLocaleDateString(),
        });
      } else if (field.maxDate && new Date(value) > new Date(field.maxDate)) {
        error = t("popup.validation.dateBefore", {
          date: new Date(field.maxDate).toLocaleDateString(),
        });
      }
    }
    // Text length validation
    else if (field.type === "text" || field.type === "textarea") {
      if (field.minLength && value.length < field.minLength) {
        error = t("popup.validation.minLength", { minLength: field.minLength });
      } else if (field.maxLength && value.length > field.maxLength) {
        error = t("popup.validation.maxLength", { maxLength: field.maxLength });
      }
    }
    // File validation
    else if (field.type === "file" && value) {
      if (
        field.accept &&
        field.accept
          .split(",")
          .some((ext) =>
            value.name.toLowerCase().endsWith(ext.trim().toLowerCase())
          )
      ) {
        error = t("popup.validation.invalidFileType", { accept: field.accept });
      } else if (field.maxSize && value.size > field.maxSize) {
        error = t("popup.validation.fileTooLarge", {
          maxSize: field.maxSize / 1024 / 1024,
        });
      }
    }

    return error;
  };

  // Validate current page fields
  const validateCurrentPage = () => {
    const newErrors = {};
    currentFields.forEach((field) => {
      if (field.type !== "hidden") {
        const error = validateField(field.name, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let newValue;
    if (type === "file") {
      newValue = files[0];
    } else if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate immediately if field was touched before
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Mark field as touched on blur
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const goToNextPage = () => {
    // Validate current page before proceeding
    const newErrors = validateCurrentPage();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Mark all fields on current page as touched to show errors
      const allTouched = { ...touched };
      currentFields.forEach((field) => {
        if (field.type !== "hidden") {
          allTouched[field.name] = true;
        }
      });
      setTouched(allTouched);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMultiPage && currentPage < pageKeys.length - 1) {
      // If there are more pages, go to next page instead of submitting
      goToNextPage();
      return;
    }

    // Mark all fields as touched on final submit
    const allTouched = {};
    const allFields = isMultiPage
      ? pageKeys.flatMap((key) => fields[key])
      : fields;

    allFields.forEach((field) => {
      if (field.type !== "hidden") {
        allTouched[field.name] = true;
      }
    });
    setTouched(allTouched);

    // Validate all fields
    const allErrors = {};
    if (isMultiPage) {
      pageKeys.forEach((key) => {
        fields[key].forEach((field) => {
          if (field.type !== "hidden") {
            const error = validateField(field.name, formData[field.name]);
            if (error) allErrors[field.name] = error;
          }
        });
      });
    } else {
      fields.forEach((field) => {
        if (field.type !== "hidden") {
          const error = validateField(
            field.name,
            formData[field.type === "employee" ? "employees" : field.name]
          );
          if (error) allErrors[field.name] = error;
        }
      });
    }

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return; // Don't continue if there are errors
    }

    if (isAdd) {
      handleAdd(formData);
    } else {
      handleUpdate(formData);
    }

    onClose();
  };

  const renderField = (field) => {
    if (field.type === "hidden") return null;

    if (field.readOnly) {
      return (
        <div className="px-3 py-2 bg-gray-300 rounded-md">
          {formData[field.name] || "-"}
        </div>
      );
    }

    const commonProps = {
      name: field.name,
      value: field.type === "checkbox" ? undefined : formData[field.name] || "",
      onChange: handleInputChange,
      onBlur: handleBlur,
      className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] max-lg:w-full ${
        errors[field.name]
          ? "border-2 border-red-500"
          : touched[field.name]
          ? "border border-green-500"
          : ""
      }`,
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            field={field}
            fields={currentFields}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );

      case "textarea":
        return <textarea {...commonProps} rows={3} />;

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={formData[field.name] || false}
            onChange={handleInputChange}
            onBlur={handleBlur}
            name={field.name}
            className="h-5 w-5 rounded-md"
          />
        );

      case "date":
        if (commonProps.value) {
          const dateValue = new Date(commonProps.value);
          const formattedDate = dateValue.toISOString().split("T")[0];

          return <input type="date" {...commonProps} value={formattedDate} />;
        }
        return <input type="date" {...commonProps} />;
      case "datetime":
      case "email":
      case "number":
      case "tel":
        return <input type={field.type} {...commonProps} />;

      case "file":
        return (
          <ToDoFile formData={formData} setFormData={setFormData} url={url} />
        );
      case "contact":
        return <ToDoCountry formData={formData} setFormData={setFormData} />;
      case "employee":
        return (
          <ToDoEmp
            required={field.required}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "company":
        return <ToDoCompany formData={formData} setFormData={setFormData} />;
      case "activity":
        return <ToDoActivity formData={formData} setFormData={setFormData} />;
      case "address":
        return <ToDoAddress formData={formData} setFormData={setFormData} />;
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  // Check if a field should be full width
  const isFullWidthField = (field) => {
    const fullWidthTypes = [
      "file",
      "contact",
      "employee",
      "textarea",
      "address",
    ];
    return fullWidthTypes.includes(field.type) || field.fullWidth;
  };

  // Group fields into rows, handling full-width fields
  const visibleFields = currentFields.filter(
    (field) => field.type !== "hidden"
  );

  const groupedFields = [];
  let currentRow = [];

  visibleFields.forEach((field) => {
    if (isFullWidthField(field)) {
      // If we have fields in current row, push them first
      if (currentRow.length > 0) {
        groupedFields.push(currentRow);
        currentRow = [];
      }
      // Push the full-width field as a single row
      groupedFields.push([field]);
    } else {
      // Add regular field to current row
      currentRow.push(field);
      // If row is full (2 fields), push it and start new row
      if (currentRow.length === 2) {
        groupedFields.push(currentRow);
        currentRow = [];
      }
    }
  });

  // Push any remaining fields in the current row
  if (currentRow.length > 0) {
    groupedFields.push(currentRow);
  }

  const isLastPage = isMultiPage ? currentPage === pageKeys.length - 1 : true;
  const isFirstPage = currentPage === 0;

  return (
    <div
      className={`fixed inset-0 bg-[rgb(0,0,0,0.5)] flex justify-center items-center z-50 p-4 max-sm:p-2 text-[var(--main-color)] ${
        language === "ar" ? "text-right" : ""
      }`}
    >
      <div className="bg-gray-300 p-6 max-sm:p-4 rounded-md w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto duration-300 hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isAdd ? t("popup.add") : t("popup.edit")} {title}
            {isMultiPage &&
              ` - ${
                t(`popup.pages.${pageKeys[currentPage]}`) ||
                pageKeys[currentPage]
              }`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Progress indicator for multi-page forms */}
        {isMultiPage && (
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {pageKeys.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentPage
                      ? "bg-[var(--main-color)]"
                      : index < currentPage
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {groupedFields.map((row, rowIndex) => (
            <div key={rowIndex} className="flex max-sm:flex-col gap-4">
              {row.map((field, fieldIndex) => (
                <div
                  key={rowIndex + "" + fieldIndex}
                  className={`flex flex-col gap-2 ${
                    isFullWidthField(field) ? "w-full" : "flex-1"
                  }`}
                >
                  {field.name && (
                    <label htmlFor={field.name} className="text-sm font-medium">
                      {t(field.title)}
                      {field.required && field.type !== "employee" && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  )}
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                  {!errors[field.name] && touched[field.name] && (
                    <p className="text-green-500 text-xs mt-1">✓</p>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            {/* Navigation buttons for multi-page forms */}
            {isMultiPage && (
              <div className="flex gap-2">
                {!isFirstPage && (
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer text-[var(--main-color)] bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    {language === "ar" ? <FaArrowRight /> : <FaArrowLeft />}
                    {t("popup.previous")}
                  </button>
                )}
              </div>
            )}

            <div
              className={`flex ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-3`}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 cursor-pointer text-[var(--main-color)] bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                {t("popup.cancel")}
              </button>

              {isMultiPage && !isLastPage ? (
                <button
                  type="button"
                  onClick={goToNextPage}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors"
                >
                  {t("popup.next")}
                  {language === "ar" ? <FaArrowLeft /> : <FaArrowRight />}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors"
                  >
                    {isAdd ? t("popup.add") : t("popup.edit")}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
