// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Component for a single metric card
const MetricCard = ({ title, value, unit, color }) => (
  <div className={`p-6 rounded-lg shadow-md flex-1 ${color}`}>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 text-3xl font-bold">
      {value} <span className="text-xl font-normal">{unit}</span>
    </p>
  </div>
);

const Home = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({
    activeCustomers: "...",
    activeProjects: "...",
    overdueInvoices: "...",
    presentEmployees: "...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace these with your actual API endpoints
        const [customersRes, projectsRes, invoicesRes, employeesRes] =
          await Promise.all([
            axios.get("home.YOUR_API_ENDPOINT/customers/active"),
            axios.get("home.YOUR_API_ENDPOINT/projects/status"),
            axios.get("home.YOUR_API_ENDPOINT/invoices/overdue"),
            axios.get("home.YOUR_API_ENDPOINT/employees/present"),
          ]);

        setMetrics({
          activeCustomers: customersRes.data.count,
          activeProjects: projectsRes.data.count, // You may need to modify this if the API returns project details instead of direct count
          overdueInvoices: invoicesRes.data.count, // You may need to modify this if the API returns invoice details
          presentEmployees: employeesRes.data.count,
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(t("home.dashboardError"));
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        {t("home.loadingDashboard")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {t("home.error")}: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-300 h-[calc(100%-80px)]">
      <div className="p-8 rounded-md bg-white">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {t("home.dashboard")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t("home.activeCustomers")}
            value={metrics.activeCustomers}
            color="bg-[var(--main-color-lighter)] text-white"
          />
          <MetricCard
            title={t("home.activeProjects")}
            value={metrics.activeProjects}
            color="bg-[var(--sub-color-lighter)] text-white"
          />
          <MetricCard
            title={t("home.overdueInvoices")}
            value={metrics.overdueInvoices}
            color="bg-[var(--main-color-lighter)] text-white"
          />
          <MetricCard
            title={t("home.presentEmployees")}
            value={metrics.presentEmployees}
            color="bg-[var(--sub-color-lighter)] text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
