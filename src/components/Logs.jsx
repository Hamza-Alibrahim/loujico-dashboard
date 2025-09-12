import DashTable from "./DashTable";
import { logFields as popUpFields } from "../popUpFields";
import { logFields } from "../fields";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axios from "axios";

const Logs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          return;
        }

        const response = await axios
          .get("http://192.168.1.10:7176/api/Logs/GetAll?Page=1&Count=10", {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setLogs(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-300 h-full">
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 rounded-xs bg-[var(--main-color)] animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <DashTable
      title={t("log.title")}
      search={t("log.search")}
      url="/Logs"
      fields={logFields}
      data={logs}
      popUpFields={popUpFields}
      isrefresh={refresh}
      setRefresh={setRefresh}
    />
  );
};

export default Logs;
