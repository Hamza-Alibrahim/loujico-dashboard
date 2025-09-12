import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import ToDoEmp from "./ToDoEmp";
import ToDoFile from "./ToDoFile";

const PopUp = ({
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
  const [touched, setTouched] = useState({}); // Track touched fields

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize form with default values
      const initialFormData = {};
      fields.forEach((field) => {
        if (field.type === "checkbox") {
          initialFormData[field.name] =
            field.default !== undefined ? field.default : false;
        } else if (field.type === "number") {
          initialFormData[field.name] = field.default || 0;
        } else {
          initialFormData[field.name] = field.default || "";
        }
      });
      setFormData(initialFormData);
    }
    // Reset touched fields when opening the popup
    setTouched({});
    setErrors({});
  }, [initialData, fields, isOpen]);

  if (!isOpen) return null;

  // Field validation function
  const validateField = (name, value) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return "";

    let error = "";

    // Check if field is required
    if (field.required && (!value || value.toString().trim() === "")) {
      error = t("popup.validation.required", { field: t(field.title) });
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
        !field.accept
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

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched on Submit
    const allTouched = {};
    fields.forEach((field) => {
      if (field.type !== "hidden") {
        allTouched[field.name] = true;
      }
    });
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
          <select {...commonProps}>
            <option value="">
              {t("popup.selectPlaceholder", { field: t(field.title) })}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
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
      case "datetime":
      case "email":
      case "number":
      case "tel":
        return <input type={field.type} {...commonProps} />;

      case "file":
        return (
          <div>
            <input
              type="file"
              className="cursor-pointer max-sm:w-full"
              onChange={handleInputChange}
              onBlur={handleBlur}
              name={field.name}
              accept={field.accept}
            />
            {formData[field.name]?.name && (
              <p className="text-sm text-gray-600 mt-1">
                {t("popup.selectedFile")}: {formData[field.name].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            defaultValue={formData[field.name]}
            {...commonProps}
          />
        );
    }
  };

  // Group fields into rows of two, excluding hidden fields
  const visibleFields = fields.filter((field) => field.type !== "hidden");
  const groupedFields = [];
  for (let i = 0; i < visibleFields.length; i += 2) {
    groupedFields.push(visibleFields.slice(i, i + 2));
  }

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
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {groupedFields.map((row, rowIndex) => (
            <div key={rowIndex} className="flex max-sm:flex-col gap-4">
              {row.map((field) => (
                <div key={field.name} className="flex flex-col gap-2 flex-1">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    {t(field.title)}
                    {field.required && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </label>
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

          {["project", "مشروع"].includes(title) ? (
            <>
              <ToDoEmp />
            </>
          ) : null}

          <ToDoFile />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer text-[var(--main-color)] bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
            >
              {t("popup.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors"
            >
              {isAdd ? t("popup.add") : t("popup.edit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
