import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Select = ({
  field,
  fields = [],
  formData,
  setFormData,
  setValue = () => {},
  errors = [],
  setErrors = () => {},
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchDta = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(field.api, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(t("home.dashboardError"));
      }
    };

    if (field.api) {
      fetchDta();
    }
  }, []);

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
      if (value.split(" ").length > 1) {
        newValue = value.split(" ")[0];
        setValue(value.split(" ")[1].toLowerCase());
      } else {
        newValue = value;
      }
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

  const commonProps = {
    name: field.name,
    value: formData[field.name] || "",
    onChange: handleInputChange,
    onBlur: handleBlur,
    className: `w-full px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] max-lg:w-full ${
      errors[field.name]
        ? "border-2 border-red-500"
        : touched[field.name]
        ? "border border-green-500"
        : ""
    }`,
  };

  if (field.name === "legalId") {
    if (formData["legal"]) {
      commonProps.value = formData["legal"].id;
    }
  }

  return (
    <select {...commonProps}>
      {data.length || !field.api ? (
        <option value="">
          {t("popup.selectPlaceholder", { field: t(field.title) })}
        </option>
      ) : (
        <option value="">{t("popup.loadingData")}</option>
      )}
      {data.map((e) => {
        return (
          <option key={crypto.randomUUID()} value={`${e.id}`}>
            {e.title || e.customerName || e.legalInfo || e.name}
          </option>
        );
      })}
      {field.options?.map((option) => (
        <option key={crypto.randomUUID()} value={option.value}>
          {t(option.label)}
        </option>
      ))}
    </select>
  );
};

export default Select;
