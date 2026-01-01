import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const ToDoCompany = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const {
    user: { token },
  } = useContext(AuthContext);

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setError(null);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get("http://loujico.somee.com/Api/Company/GetAllId", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setCompanies(response.data);
      } catch (err) {
        console.error("Failed to fetch companies data:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchCompanies();
  }, []);

  // Check if add button should be disabled
  const isAddButtonDisabled = () => {
    return !data.companyId || !data.startDate || !data.endDate || !data.price;
  };

  // Get company name by ID
  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "Unknown Company";
  };

  // Prepare company list for display
  const prepareCompaniesForDisplay = () => {
    return (formData.company || []).map((comp) => {
      if (comp.name) return comp;
      return {
        ...comp,
        name: getCompanyName(comp.companyId),
      };
    });
  };

  const handleAddCompany = () => {
    if (!isAddButtonDisabled()) {
      const newCompany = {
        companyId: data.companyId,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.price,
        name: companyName,
      };

      setFormData({
        ...formData,
        company: [...(formData.company || []), newCompany],
      });

      setData({});
      setCompanyName("");
    }
  };

  const handleRemoveCompany = (companyId) => {
    setFormData({
      ...formData,
      company: formData.company.filter((c) => c.companyId !== companyId),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">
        {t("todoCompany.associatedCompanies")}
      </h1>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
        {/* Company select */}
        <select
          {...commonProps}
          value={`${data.companyId || ""} ${companyName || ""}`.trim()}
          onChange={(e) => {
            const [companyId, ...rest] = e.target.value.split(" ");
            setData({ ...data, companyId });
            setCompanyName(rest.join(" "));
          }}
        >
          <option value="">{t("todoCompany.chooseCompany")}</option>
          {companies.map((comp) => (
            <option
              key={JSON.stringify(comp)}
              value={`${comp.id} ${comp.name}`}
            >
              {comp.name}
            </option>
          ))}
        </select>

        {/* Start date */}
        <input
          type="date"
          {...commonProps}
          value={data.startDate || ""}
          onChange={(e) => setData({ ...data, startDate: e.target.value })}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
        {/* End date */}
        <input
          type="date"
          {...commonProps}
          value={data.endDate || ""}
          onChange={(e) => setData({ ...data, endDate: e.target.value })}
        />

        {/* Price */}
        <input
          type="number"
          {...commonProps}
          placeholder={t("todoCompany.pricePlaceholder")}
          value={data.price || ""}
          onChange={(e) => setData({ ...data, price: e.target.value })}
        />
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAddCompany}
        disabled={isAddButtonDisabled()}
        className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("todoCompany.addButton")}
      </button>

      {/* Display added companies */}
      <div className="flex flex-col gap-2 mt-2">
        {prepareCompaniesForDisplay().map((comp) => (
          <div
            key={JSON.stringify(comp)}
            className="flex justify-between gap-4 items-center bg-gray-200 p-2 rounded-md"
          >
            <div className="flex flex-col gap-2">
              <span>
                {comp.name} / {t("todoCompany.startDate")}: {comp.startDate}
              </span>
              <span>
                {t("todoCompany.endDate")}: {comp.endDate} /{" "}
                {t("todoCompany.price")}: {comp.price}
              </span>
            </div>
            <FaTrash
              className="cursor-pointer shrink-0 hover:text-red-500"
              onClick={() => handleRemoveCompany(comp.companyId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoCompany;
