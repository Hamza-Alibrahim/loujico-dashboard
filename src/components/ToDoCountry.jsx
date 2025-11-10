import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "./Select";

const ToDoCountry = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [contactTypeId, setContactTypeId] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [contactTypes, setContactTypes] = useState([]);

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://192.168.1.105:8080/api/Settings/GetAllContactType",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setContactTypes(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch contact types:", err);
      }
    };

    fetchContactTypes();
  }, []);

  // Check if add button should be disabled
  const isAddButtonDisabled = () => {
    if (!contactTypeId) return true;

    const isPhoneType = ["whatsapp", "phone"].includes(
      contactTypes
        .find((ct) => ct.id === parseInt(contactTypeId))
        ?.name?.toLowerCase()
    );

    if (isPhoneType) {
      return !phone || phone.trim() === "";
    } else {
      return !contactValue || contactValue.trim() === "";
    }
  };

  const handleAddContact = () => {
    if (contactTypeId && (contactValue || phone)) {
      const newContact = {
        contactTypeId: parseInt(contactTypeId),
        name: ["whatsapp", "phone"].includes(
          contactTypes
            .find((ct) => ct.id === parseInt(contactTypeId))
            ?.name?.toLowerCase()
        )
          ? phone
          : contactValue,
      };

      setFormData({
        ...formData,
        contacts: [...(formData.contacts || []), newContact],
      });

      // Reset form
      setContactTypeId("");
      setContactValue("");
      setPhone("");
    }
  };

  const handleRemoveContact = (index) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index),
    });
  };

  const getContactTypeName = (contactTypeId) => {
    const type = contactTypes.find((ct) => ct.id === parseInt(contactTypeId));
    return type ? type.name : "Unknown Type";
  };

  const isPhoneType = ["whatsapp", "phone"].includes(
    contactTypes
      .find((ct) => ct.id === parseInt(contactTypeId))
      ?.name?.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">{t("todoCountry.contacts")}</h1>

      {/* Add Contact Form */}
      <div className="flex items-center flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex-1">
          <select
            value={contactTypeId}
            onChange={(e) => {
              setContactTypeId(e.target.value);
              setContactValue("");
              setPhone("");
            }}
            {...commonProps}
          >
            <option value="">{t("todoCountry.rolePlaceholder")}</option>
            {contactTypes.map((type) => (
              <option key={crypto.randomUUID()} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {isPhoneType ? (
          <div className="dir-ltr flex-1">
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={setPhone}
              inputProps={{ required: true }}
            />
          </div>
        ) : (
          <div className="flex-1">
            <input
              {...commonProps}
              type="text"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={t("todoCountry.rolePlaceholder")}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAddContact}
        disabled={isAddButtonDisabled()}
        className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("todoCountry.addButton")}
      </button>

      {/* Display Added Contacts */}
      <div className="flex flex-col gap-2 mt-2">
        {(formData.contacts || []).map((contact, index) => {
          return (
            <div
              key={crypto.randomUUID()}
              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
            >
              <span>
                {getContactTypeName(contact.contactTypeId)}: {contact.name}
              </span>
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveContact(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToDoCountry;
