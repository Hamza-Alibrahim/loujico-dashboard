// src/Pages/Home.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Component for a single metric card
const MetricCard = ({ title, value, unit, color }) => (
  <div
    className={`flex items-center flex-col justify-center p-6 rounded-lg shadow-md flex-1 ${color}`}
  >
    <h3 className="text-xl font-bold text-white whitespace-nowrap">{title}</h3>
    <p className="mt-2 text-3xl font-bold">
      {value} <span className="text-xl font-normal">{unit}</span>
    </p>
  </div>
);

const Home = () => {
  const { t } = useTranslation();
  const [
    { activeProjects, countActiveEmployee, customer, overDueInvoices },
    setData,
  ] = useState({
    activeProjects: 0,
    countActiveEmployee: 0,
    customer: 0,
    overDueInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    user: { token },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchDta = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get("http://212.85.25.41:7176/Dashbourd/GetDashboard", {
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
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDta();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-300 min-h-screen">
        <div className="p-8 rounded-md bg-white">
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

  return (
    <div className="p-6 bg-gray-300 min-h-[calc(100vh-80px)] h-full">
      <div className="p-8 rounded-md bg-white">
        {error ? (
          <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md">
            <p>
              {t("home.error")}: {error}
            </p>
          </div>
        ) : (
          ""
        )}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {t("home.dashboard")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
          <MetricCard
            title={t("home.activeCustomers")}
            value={customer}
            color="bg-[var(--sub-color)] text-white"
          />
          <MetricCard
            title={t("home.activeProjects")}
            value={activeProjects}
            color="bg-[var(--main-color)] text-white"
          />
          <MetricCard
            title={t("home.overdueInvoices")}
            value={overDueInvoices}
            color="bg-[var(--main-color)] text-white"
          />
          <MetricCard
            title={t("home.presentEmployees")}
            value={countActiveEmployee}
            color="bg-[var(--sub-color)] text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
