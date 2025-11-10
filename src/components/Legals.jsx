import DashTable from "./DashTable";
import { legalFields } from "../fields";
import { legalFields as popUpFields } from "../popUpFields";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

const Legals = () => {
  const { t } = useTranslation();
  const [legals, setLegals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(`http://192.168.1.105:8080/api/Settings/GetAllLegalType`, {
            //timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setLegals(response.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch legal data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, page, count, search]);

  return (
    <DashTable
      title={t("legal.title")}
      searchPlaceHolder={t("legal.search")}
      url="/Settings"
      name="Legal"
      fields={legalFields}
      data={legals}
      popUpFields={popUpFields}
      loading={loading}
      setRefresh={setRefresh}
      page={page}
      count={count}
      search={search}
      setPage={setPage}
      setCount={setCount}
      setSearch={setSearch}
      error={error}
    />
  );
};
export default Legals;
